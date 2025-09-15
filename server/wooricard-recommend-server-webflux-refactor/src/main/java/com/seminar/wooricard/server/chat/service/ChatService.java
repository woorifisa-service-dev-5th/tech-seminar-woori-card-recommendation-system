package com.seminar.wooricard.server.chat.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.seminar.wooricard.server.card.dto.CardDetailResponse;
import com.seminar.wooricard.server.card.service.CardService;
import com.seminar.wooricard.server.chat.dto.ChatRequest;
import com.seminar.wooricard.server.chat.utils.ChatParsingUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DefaultDataBufferFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final WebClient aiWebClient;
    private final CardService cardService;
    private final ObjectMapper objectMapper;

    public Flux<DataBuffer> getChainedChatResponse(ChatRequest request) {
        log.info("Connecting to AI server with query: {}", request.getQuery());

        // AI 서버 응답 스트림
        Flux<DataBuffer> aiResponseStream = aiWebClient.post()
                .uri("/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToFlux(DataBuffer.class)
                .doOnError(error -> log.error("AI server stream error", error));

        // transform을 사용하여 스트림 처리 로직을 캡슐화하고 재사용 가능하게 만듭니다.
        return aiResponseStream.transform(this::processStreamAndChainCardDetails);
    }

    /**
     * AI 응답 토큰 스트림을 그대로 클라이언트에 전달하고,
     * 스트림이 완료된 후 누적된 전체 텍스트에서 카드 이름을 파싱하여
     * 카드 상세 정보 JSON 배열을 스트림의 마지막에 이어 붙입니다.
     * @param inputStream 원본 AI 응답 스트림 (Flux<DataBuffer>)
     * @return 토큰 스트림 + 최종 JSON 배열 스트림
     */
    private Flux<DataBuffer> processStreamAndChainCardDetails(Flux<DataBuffer> inputStream) {
        // 상태를 저장할 변수 (스트림의 side-effect로 사용되지만, onComplete 시점에서만 읽으므로 안전)
        StringBuilder fullResponse = new StringBuilder();

        // 1. AI 스트림 처리: 토큰을 그대로 전달하면서, 전체 응답을 StringBuilder에 누적
        Flux<DataBuffer> tokenStream = inputStream
                .doOnNext(dataBuffer -> {
                    // asReadOnlyBuffer()를 사용하여 원본 버퍼를 수정하지 않도록 보장
                    fullResponse.append(StandardCharsets.UTF_8.decode(dataBuffer.asByteBuffer().asReadOnlyBuffer()));
                });

        // 2. 토큰 스트림이 완료된 "후에" 실행될 카드 상세 정보 조회 Mono
        // Mono.defer()는 구독 시점(즉, tokenStream이 완료된 후)에 내부 로직을 실행하도록 보장합니다.
        Mono<DataBuffer> cardDetailsJsonStream = Mono.defer(() -> {
            String finalResponseText = fullResponse.toString();
            List<String> cardNames = ChatParsingUtils.parseCardNames(finalResponseText);

            if (cardNames.isEmpty()) {
                log.info("No card names found in the final response. Completing stream.");
                return Mono.empty(); // 카드 이름이 없으면 아무것도 보내지 않고 스트림 종료
            }

            log.info("Fetching details for cards found in final response: {}", cardNames);
            return cardService.getCardDetailsByNames(cardNames)
                    .collectList() // Flux<CardDetailResponse>를 Mono<List<CardDetailResponse>>로 변환
                    .flatMap(this::convertCardListToJsonBuffer); // List를 최종 JSON DataBuffer로 변환
        });

        // 3. 토큰 스트림과, 그것이 완료된 후 실행될 카드 정보 스트림을 이어 붙입니다.
        // concatWith는 tokenStream이 완전히 종료된 후에 cardDetailsJsonStream을 구독하고 실행합니다.
        return tokenStream.concatWith(cardDetailsJsonStream);
    }

    /**
     * List<CardDetailResponse>를 최종 JSON 배열 형태의 DataBuffer로 변환합니다.
     * @param cardList 카드 상세 정보 리스트
     * @return SSE 형식으로 래핑된 JSON 배열 DataBuffer
     */
    private Mono<DataBuffer> convertCardListToJsonBuffer(List<CardDetailResponse> cardList) {
        if (cardList.isEmpty()) {
            return Mono.empty();
        }
        try {
            // SSE 형식이 아닌, 순수한 JSON 배열 문자열을 생성
            String jsonArray = objectMapper.writeValueAsString(cardList);
            log.info("Sending final card details JSON array: {}", jsonArray);

            // 클라이언트에서 파싱할 수 있도록 Server-Sent Events 형식에 맞춰 data 필드에 담아 전송
            String finalPayload = "data: " + jsonArray + "\n\n";
            return Mono.just(stringToDataBuffer(finalPayload));
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize card list to JSON", e);
            return Mono.error(e); // 에러 발생 시 스트림에 에러 신호를 보냄
        }
    }

    /**
     * String을 DataBuffer로 변환하는 헬퍼 메서드
     * @param value 변환할 문자열
     * @return DataBuffer
     */
    private DataBuffer stringToDataBuffer(String value) {
        byte[] bytes = value.getBytes(StandardCharsets.UTF_8);
        return new DefaultDataBufferFactory().wrap(bytes);
    }
}

