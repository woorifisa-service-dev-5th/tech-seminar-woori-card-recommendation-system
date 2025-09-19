export interface CardData {
    id: number;
    cardName: string;
    benefits: string;
    imageUrl: string;
    cardUrl: string;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    cards?: CardData[];
    isLoadingCards?: boolean;
}
