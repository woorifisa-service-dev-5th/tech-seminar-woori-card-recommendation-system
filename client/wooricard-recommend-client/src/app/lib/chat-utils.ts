/**
 * AI 응답 텍스트에서 카드 이름 식별자를 파싱하여 이름 배열을 추출
 */
export function parseCardNames(text: string): string[] | null {
    // CARD_NAME::[...] 부분을 찾습니다.
    const match = text.match(/CARD_NAME::(\[.*?\])/s);

    if (match && match[1]) {
        try {
            // 예: `["이름1", "이름2"]` -> `"이름1", "이름2"`
            const content = match[1].slice(1, -1);

            if (!content.trim()) {
                return [];
            }

            // 쉼표(,)를 기준으로 각 카드 이름을 분리
            const cardNames = content.split(',').map((name) => {
                //  이름의 양 끝에 있는 공백과 따옴표(' 또는 ")를 깨끗하게 제거
                return name.trim().replace(/^['"]|['"]$/g, '');
            });

            // 최종 결과로 돌려줍니다.
            return cardNames;
        } catch (e) {
            console.error('카드 이름 파싱 실패:', e);
            return null;
        }
    }
    return null;
}

/**
 * AI 응답 텍스트에서 카드 이름 식별자 부분을 제거하여 순수한 답변만 남김.
 * @param text AI가 생성한 전체 응답 문자열
 * @returns 카드 이름 식별자가 제거된 문자열
 */
export function cleanUpResponseText(text: string): string {
    // 1. CARD_NAME::[...] 부분을 제거합니다. 's' 플래그는 여러 줄에 걸쳐 있어도 찾도록
    let cleanedText = text.replace(/CARD_NAME::\[.*?\]/s, '');

    // 2. 스트림 마지막에 오는 카드 상세 정보 JSON 배열 `[{...}]` 부분을 제거
    cleanedText = cleanedText.replace(/\[\s*\{.*\}\s*\]$/s, '');

    // 3. 양 끝의 공백을 제거하여 최종적으로 깔끔한 텍스트를 반환
    return cleanedText.trim();
}
