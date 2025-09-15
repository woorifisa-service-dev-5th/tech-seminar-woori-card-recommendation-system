package com.seminar.wooricard.server.card.controller;

import com.seminar.wooricard.server.card.dto.CardDetailResponse;
import com.seminar.wooricard.server.card.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    // 요청 예시: /api/cards?names=카드의정석 TEN,트래블월렛 우리카드
    @GetMapping
    public Flux<CardDetailResponse> getCardDetails(@RequestParam List<String> names) {
        return cardService.getCardDetailsByNames(names);
    }
}

