package com.seminar.wooricard.server.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardDetailResponse {
    private Long id;
    private String cardName;
    private String benefits;
    private String imageUrl;
    private String cardUrl;
}
