package com.seminar.wooricard.server.card.service;

import com.seminar.wooricard.server.card.dto.CardDetailResponse;
import com.seminar.wooricard.server.card.entity.Card;
import com.seminar.wooricard.server.card.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;

    public List<CardDetailResponse> getCardDetailsByNames(List<String> cardNames) {
        return cardRepository.findByCardNameIn(cardNames).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private CardDetailResponse toDto(Card card) {
        return new CardDetailResponse(
                card.getId(),
                card.getCardName(),
                card.getBenefits(),
                "/images/" + card.getId() + ".png",
                card.getCardUrl()
        );
    }
}
