package com.seminar.wooricard.server.chat.service;

import com.seminar.wooricard.server.chat.dto.ChatRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final WebClient aiWebClient;

    public Flux<String> getStreamingChatResponse(ChatRequest request) {
        return aiWebClient.post()
                .uri("/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToFlux(String.class); // (중요)
    }
}
