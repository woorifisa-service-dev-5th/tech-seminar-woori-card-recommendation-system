package com.seminar.wooricard.server.card.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardDetailResponse {
    private Long id; // ID 필드 추가
    private String cardName;
    private String benefits;
    private String imageUrl; // 완성된 전체 이미지 URL
}
