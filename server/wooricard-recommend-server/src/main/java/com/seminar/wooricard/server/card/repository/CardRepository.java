package com.seminar.wooricard.server.card.repository;

import com.seminar.wooricard.server.card.entity.Card;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import java.util.Collection;

@Repository
public interface CardRepository extends ReactiveCrudRepository<Card, Long> {
    // 여러 개의 카드 이름을 기반으로 카드 정보를 찾아옴 (비동기 스트림)
    Flux<Card> findByCardNameIn(Collection<String> cardNames);
}
