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
import java.util.ArrayList;
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

        // transform을 사용하여 스트림을 상태 기반으로 변환 및 처리
        return aiResponseStream.transform(this::processStreamAndChainCardDetails);
    }

    private Flux<DataBuffer> processStreamAndChainCardDetails(Flux<DataBuffer> inputStream) {
        // 상태를 저장할 변수들
        StringBuilder fullResponse = new StringBuilder();
        List<String> cardNamesFound = new ArrayList<>();

        // 1. AI 스트림 처리: 토큰을 그대로 전달하면서, 카드 이름 파싱을 시도
        Flux<DataBuffer> tokenStream = inputStream
                .doOnNext(dataBuffer -> {
                    String chunk = StandardCharsets.UTF_8.decode(dataBuffer.asByteBuffer().asReadOnlyBuffer()).toString();
                    fullResponse.append(chunk);
                    List<String> parsedNames = ChatParsingUtils.parseCardNames(fullResponse.toString());
                    if (!parsedNames.isEmpty() && cardNamesFound.isEmpty()) {
                        log.info("Card names found: {}", parsedNames);
                        cardNamesFound.addAll(parsedNames);
                    }
                });

        // 2. 카드 상세 정보 조회 및 JSON 배열 변환 스트림
        Mono<DataBuffer> cardDetailsJsonStream = Mono.defer(() -> {
            if (cardNamesFound.isEmpty()) {
                log.info("No card names were found to fetch details.");
                return Mono.empty();
            }
            log.info("Fetching details for cards: {}", cardNamesFound);
            return cardService.getCardDetailsByNames(cardNamesFound)
                    .collectList() // Flux<CardDetailResponse> -> Mono<List<CardDetailResponse>>
                    .flatMap(this::convertCardListToJsonBuffer); // Mono<List> -> Mono<DataBuffer>
        });

        // 3. 토큰 스트림이 끝난 후, 카드 상세 정보 JSON 배열 스트림을 이어 붙임
        return Flux.concat(tokenStream, cardDetailsJsonStream);
    }

    // List<CardDetailResponse>를 최종 JSON 배열 형태의 DataBuffer로 변환
    private Mono<DataBuffer> convertCardListToJsonBuffer(List<CardDetailResponse> cardList) {
        if (cardList.isEmpty()) {
            return Mono.empty();
        }
        try {
            // SSE 형식이 아닌, 순수한 JSON 배열 문자열을 생성
            String jsonArray = objectMapper.writeValueAsString(cardList);
            log.info("Sending final card details JSON array: {}", jsonArray);
            // 클라이언트에서 파싱할 수 있도록 특별한 접두사를 붙여서 보냄
            String finalPayload = "data: " + jsonArray + "\n\n";
            return Mono.just(stringToDataBuffer(finalPayload));
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize card list to JSON", e);
            return Mono.error(e);
        }
    }

    // String을 DataBuffer로 변환하는 헬퍼 메서드
    private DataBuffer stringToDataBuffer(String value) {
        byte[] bytes = value.getBytes(StandardCharsets.UTF_8);
        return new DefaultDataBufferFactory().wrap(bytes);
    }
}

