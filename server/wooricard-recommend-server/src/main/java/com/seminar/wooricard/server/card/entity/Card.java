package com.seminar.wooricard.server.card.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("card")
public class Card {

    @Id
    private Long id;

    @Column("card_name")
    private String cardName;

    private String benefits;

    @Column("card_url")
    private String cardUrl;
}
