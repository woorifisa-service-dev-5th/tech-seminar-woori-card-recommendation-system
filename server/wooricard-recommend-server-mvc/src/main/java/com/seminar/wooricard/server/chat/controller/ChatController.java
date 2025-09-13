package com.seminar.wooricard.server.chat.controller;

import com.seminar.wooricard.server.chat.dto.ChatRequest;
import com.seminar.wooricard.server.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter; // ✨ SseEmitter 대신 ResponseBodyEmitter를 import 합니다.

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;


    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseBodyEmitter streamChat(@RequestBody ChatRequest request) {
        return chatService.getStreamingChatResponse(request);
    }
}

