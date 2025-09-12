package com.seminar.wooricard.server.chat.service;

import com.seminar.wooricard.server.chat.dto.ChatRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.buffer.DataBuffer; // 👈 import 추가
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final WebClient aiWebClient;

    // ✨ 반환 타입을 Flux<String>에서 Flux<DataBuffer>로 변경
    public Flux<DataBuffer> getStreamingChatResponse(ChatRequest request) {
        log.info("Attempting to connect to AI server with query: {}", request.getQuery());

        return aiWebClient.post()
                .uri("/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                // ✨ bodyToFlux를 String.class가 아닌 DataBuffer.class로 변경
                .bodyToFlux(DataBuffer.class)
                .doOnError(error -> log.error("Error during AI server stream processing", error))
                .doOnComplete(() -> log.info("AI server stream processing completed."));
    }
}