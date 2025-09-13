package com.seminar.wooricard.server.card.repository;

import com.seminar.wooricard.server.card.entity.Card;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository; // (1) import 변경
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import java.util.Collection;

@Repository
public interface CardRepository extends ReactiveMongoRepository<Card, Long> {

    Flux<Card> findByCardNameIn(Collection<String> cardNames);
}
