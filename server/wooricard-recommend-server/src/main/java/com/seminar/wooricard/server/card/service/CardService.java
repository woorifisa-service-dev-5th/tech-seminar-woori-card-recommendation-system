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
                .map(this::toDto); // 조회된 각 Card 엔티티를 DTO로 변환
    }

    // Card 엔티티를 CardDetailResponse DTO로 변환하는 헬퍼 메서드
    private CardDetailResponse toDto(Card card) {
        return new CardDetailResponse(
                card.getId(),
                card.getCardName(),
                card.getBenefits(),
                "/images/" + card.getId() + ".png" // ID를 기반으로 이미지 URL 생성
        );
    }
}
