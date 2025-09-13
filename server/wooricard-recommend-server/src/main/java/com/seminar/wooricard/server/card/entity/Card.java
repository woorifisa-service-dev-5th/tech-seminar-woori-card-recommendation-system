package com.seminar.wooricard.server.card.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "card")
public class Card {

    @Id
    private Long id;

    @Field("card_name")
    private String cardName;

    private String benefits;

    @Field("card_url")
    private String cardUrl;
}
