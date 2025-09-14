package com.seminar.wooricard.server.card.service;

import com.seminar.wooricard.server.card.dto.CardDetailResponse;
import com.seminar.wooricard.server.card.entity.Card;
import com.seminar.wooricard.server.card.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;

    public Flux<CardDetailResponse> getCardDetailsByNames(List<String> cardNames) {
        return cardRepository.findByCardNameIn(cardNames)
                .map(this::toDto);
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
