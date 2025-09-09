export interface Message {
    id: string;
    text: string;
    role: 'user' | 'assistant';
    card?: CardData; // 단일 카드 (기존 호환성)
    cards?: CardData[]; // Added support for multiple cards (1-3)
}

export interface CardData {
    name: string;
    image: string;
    benefits: string[];
}
