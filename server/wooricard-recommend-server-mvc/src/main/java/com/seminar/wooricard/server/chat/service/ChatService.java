package com.seminar.wooricard.server.chat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seminar.wooricard.server.chat.dto.ChatRequest;
import com.seminar.wooricard.server.chat.utils.EmitterUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final RestTemplate restTemplate;
    private final EmitterUtils emitterUtils;
    private final ObjectMapper objectMapper;

    @Value("${ai.server.url}")
    private String aiServerUrl;

    public ResponseBodyEmitter getStreamingChatResponse(ChatRequest request) {
        ResponseBodyEmitter emitter = emitterUtils.createEmitter();
        ExecutorService executor = Executors.newSingleThreadExecutor();

        executor.execute(() -> {
            try {
                URI uri = UriComponentsBuilder.fromHttpUrl(aiServerUrl + "/chat").build().toUri();

                restTemplate.execute(uri, HttpMethod.POST,
                        (requestCallback) -> {
                            requestCallback.getHeaders().add("Content-Type", "application/json");
                            try {
                                Map<String, String> body = new HashMap<>();
                                body.put("query", request.getQuery());
                                objectMapper.writeValue(requestCallback.getBody(), body);
                            } catch (IOException e) {
                                log.error("Failed to write request body", e);
                                throw new RuntimeException(e);
                            }
                        },
                        (responseExtractor) -> {
                            try (InputStream is = responseExtractor.getBody()) {
                                byte[] buffer = new byte[4096];
                                int len;
                                while ((len = is.read(buffer)) != -1) {
                                    byte[] actualData = new byte[len];
                                    System.arraycopy(buffer, 0, actualData, 0, len);
                                    emitter.send(actualData);
                                }
                            }
                            emitter.complete(); // 스트림 정상 종료
                            return null;
                        }
                );
            } catch (Exception e) {
                log.error("Error during AI server stream processing", e);
                emitter.completeWithError(e); // 에러 발생 시 스트림 종료
            } finally {
                executor.shutdown();
            }
        });
        return emitter;
    }
}

