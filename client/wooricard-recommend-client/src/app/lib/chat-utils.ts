/**
 * AI 응답 텍스트에서 카드 이름 식별자를 파싱하여 이름 배열을 추출합니다.
 * JSON.parse 대신 수동 파싱을 사용하여 안정성을 높였습니다.
 * @param text AI가 생성한 전체 응답 문자열
 * @returns 카드 이름 배열 또는 null
 */
export function parseCardNames(text: string): string[] | null {
    // CARD_NAME::["이름1", "이름2"] 형식의 문자열을 찾습니다.
    const match = text.match(/CARD_NAME::\s*(\[.*?\])/);

    if (match && match[1]) {
        try {
            // 1. 대괄호 안의 내용만 추출합니다. 예: '"카드1", "카드2"'
            const content = match[1].slice(1, -1);

            // 2. 내용이 비어있으면 빈 배열을 반환합니다.
            if (content.trim() === '') {
                return [];
            }

            // 3. 쉼표를 기준으로 분리하여 배열을 만듭니다.
            const cardNames = content.split(',').map(name => {
                // 4. 각 이름의 앞뒤 공백과 따옴표(단일/이중)를 모두 제거합니다.
                return name.trim().replace(/^['"]|['"]$/g, '');
            });
            
            // 5. 모든 요소가 유효한 문자열인지 최종 확인합니다.
            if (Array.isArray(cardNames) && cardNames.every(item => typeof item === 'string')) {
                return cardNames;
            }
            return null;

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
    // 이 함수는 정규식으로 매칭되는 부분을 제거하므로 수정할 필요가 없습니다.
    return text.replace(/CARD_NAME::\s*(\[.*?\])/, '').trim();
}
