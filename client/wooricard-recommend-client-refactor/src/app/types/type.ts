/**
 * Spring 서버로부터 받는 카드 상세 정보의 타입
 */
export interface CardData {
    id: number;
    cardName: string;
    benefits: string; // 혜택을 쉼표로 구분된 단일 문자열로 받습니다.
    imageUrl: string;
    cardUrl: string;
}

/**
 * 채팅 메시지 객체의 타입
 */
export interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    cards?: CardData[];
    isLoadingCards?: boolean; // 카드 정보 로딩 상태 표시를 위한 플래그
}
