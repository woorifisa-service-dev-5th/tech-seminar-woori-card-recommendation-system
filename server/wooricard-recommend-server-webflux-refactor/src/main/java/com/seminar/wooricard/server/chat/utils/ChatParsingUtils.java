package com.seminar.wooricard.server.chat.utils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ChatParsingUtils {

    // CARD_NAME::["이름1", "이름2"] 형식을 찾기 위한 정규식
    private static final Pattern CARD_NAME_PATTERN = Pattern.compile("CARD_NAME::\\s*(\\[.*?\\])");

    /**
     * AI 응답 텍스트에서 카드 이름 목록을 추출
     * @param text AI 응답의 일부 (스트림 청크)
     * @return 추출된 카드 이름 목록
     */
    public static List<String> parseCardNames(String text) {
        if (text == null || text.isEmpty()) {
            return Collections.emptyList();
        }

        Matcher matcher = CARD_NAME_PATTERN.matcher(text);
        if (matcher.find()) {
            try {
                // 대괄호 안의 내용만 추출
                String content = matcher.group(1).replace("[", "").replace("]", "");

                if (content.trim().isEmpty()) {
                    return Collections.emptyList();
                }

                List<String> cardNames = new ArrayList<>();
                // 쉼표를 기준으로 분리하고, 각 이름의 앞뒤 공백과 따옴표를 제거
                for (String name : content.split(",")) {
                    cardNames.add(name.trim().replaceAll("^\"|\"$", ""));
                }
                return cardNames;
            } catch (Exception e) {
                // 파싱 중 에러가 발생하면 빈 리스트를 반환
                return Collections.emptyList();
            }
        }
        return Collections.emptyList();
    }
}
