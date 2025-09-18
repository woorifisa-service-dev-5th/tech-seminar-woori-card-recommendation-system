package com.seminar.wooricard.server.card.repository;

import com.seminar.wooricard.server.card.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository; // 👈 JpaRepository를 import합니다.
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByCardNameIn(Collection<String> cardNames);
}
