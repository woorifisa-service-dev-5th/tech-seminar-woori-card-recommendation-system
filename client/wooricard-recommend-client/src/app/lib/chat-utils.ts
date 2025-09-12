/**
 * AI 응답 텍스트에서 카드 이름 식별자를 파싱하여 이름 배열을 추출합니다.
 * @param text AI가 생성한 전체 응답 문자열
 * @returns 카드 이름 배열 또는 null
 */
export function parseCardNames(text: string): string[] | null {
    // CARD_NAME::["이름1", "이름2"] 형식의 문자열을 찾습니다.
    const match = text.match(/CARD_NAME::(\[.*?\])/);
    if (match && match[1]) {
        try {
            const cardNames = JSON.parse(match[1]);
            if (
                Array.isArray(cardNames) &&
                cardNames.every((item) => typeof item === 'string')
            ) {
                return cardNames;
            }
        } catch (e) {
            console.error('Failed to parse card names:', e);
            return null;
        }
    }
    return null;
}

/**
 * AI 응답 텍스트에서 카드 이름 식별자 부분을 제거하여 순수한 답변만 남깁니다.
 * @param text AI가 생성한 전체 응답 문자열
 * @returns 카드 이름 식별자가 제거된 문자열
 */
export function cleanUpResponseText(text: string): string {
    return text.replace(/CARD_NAME::(\[.*?\])/, '').trim();
}
