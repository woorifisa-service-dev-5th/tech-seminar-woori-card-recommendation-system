package com.seminar.wooricard.server.card.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "card")
public class Card {

    @Id
    private Long id;

    @Column(name = "card_name")
    private String cardName;

    private String benefits;

    @Column(name = "card_url")
    private String cardUrl;
}
