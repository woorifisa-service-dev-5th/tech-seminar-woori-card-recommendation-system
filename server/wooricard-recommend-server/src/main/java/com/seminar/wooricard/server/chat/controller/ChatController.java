package com.seminar.wooricard.server.chat.controller;

import com.seminar.wooricard.server.chat.dto.ChatRequest;
import com.seminar.wooricard.server.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.buffer.DataBuffer; // 👈 import 추가
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // ✨ 반환 타입을 Flux<String>에서 Flux<DataBuffer>로 변경
    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<DataBuffer> streamChat(@RequestBody ChatRequest request) {
        return chatService.getStreamingChatResponse(request);
    }
}