package com.seminar.wooricard.server.card.repository;

import com.seminar.wooricard.server.card.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository; // 👈 JpaRepository를 import합니다.
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
// ReactiveCrudRepository 대신 JpaRepository를 상속받습니다.
public interface CardRepository extends JpaRepository<Card, Long> {
    // 반환 타입을 Flux<Card>에서 List<Card>로 변경합니다.
    List<Card> findByCardNameIn(Collection<String> cardNames);
}
