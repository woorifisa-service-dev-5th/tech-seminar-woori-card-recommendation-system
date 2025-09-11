export interface Message {
    id: string;
    text: string;
    role: 'user' | 'assistant';
    card?: CardData; 
    cards?: CardData[]; 
}

export interface CardData {
    name: string;
    image: string;
    benefits: string[];
}
