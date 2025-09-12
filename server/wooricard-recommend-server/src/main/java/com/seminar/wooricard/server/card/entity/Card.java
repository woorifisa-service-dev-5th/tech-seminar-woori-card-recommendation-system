package com.seminar.wooricard.server.card.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("card") // DB의 'card' 테이블과 매핑
public class Card {

    @Id
    private Long id;

    @Column("card_name") // DB의 컬럼명과 필드명이 다를 경우 명시
    private String cardName;

    private String benefits;
}
