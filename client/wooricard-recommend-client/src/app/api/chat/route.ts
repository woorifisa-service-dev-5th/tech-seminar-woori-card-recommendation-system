import { NextResponse } from 'next/server';
import type { Message, CardData } from '@/types/chat';

// 카드 데이터와 이미지 경로를 실제 카드에 맞게 수정합니다.
const mockCardData: CardData[] = [
    {
        name: '카드의정석 EVERY DISCOUNT',
        image: '/images/card_1.jpg', // 초록색 EVERY DISCOUNT 카드
        benefits: [
            '국내 온라인 간편결제 최대 2.8% 할인',
            '전월실적 해당없음(온라인 간편결제 2% 할인: 40만원 이상)',
        ],
    },
    {
        name: '카드의정석 EVERY POINT',
        image: '/images/card_1.jpg', // 이미지가 없어 유사한 카드로 대체
        benefits: [
            '국내 온라인 간편결제 최대 2.8% 적립',
            '전월실적 해당없음(온라인 간편결제 2% 적립: 40만원 이상)',
        ],
    },
    {
        name: '카드의정석 TEN',
        image: '/images/card_3.png', // 갈색 DA 카드
        benefits: [
            '5대 일상영역 10%할인·음식점/주점 1%할인',
            '전월실적 40만원 이상',
        ],
    },
    {
        name: '카드의정석 I&U+',
        image: '/images/card_2.png', // 보라색 I&U 카드
        benefits: [
            '대중교통 10% 할인, 커피 10% 할인, 주유할인',
            '전월실적 30만원 이상',
        ],
    },
    {
        name: '카드의정석 SHOPPING+',
        image: '/images/card_1.jpg', // 이미지가 없어 유사한 카드로 대체
        benefits: [
            '온·오프라인 쇼핑 10% 할인, 온라인 간편결제 5% 추가할인',
            '전월실적 30만원 이상',
        ],
    },
    {
        name: '우리카드 7CORE',
        image: '/images/card_3.png', // 이미지가 없어 유사한 카드로 대체
        benefits: [
            '라이프스타일 7대 영역, 10% 할인을 쏘다!',
            '전월실적: 50만원 이상',
        ],
    },
    {
        name: '카드의정석2',
        image: '/images/card_3.png', // 이미지가 없어 유사한 카드로 대체
        benefits: [
            '믿고 쓰는 카드의 정석, 시즌2는 1.2% 할인이 기본!',
            '전월실적: 50만원 이상',
        ],
    },
];

export async function POST(req: Request) {
    const numberOfCards = Math.floor(Math.random() * 3) + 1; // 1-3 cards
    const shuffledCards = [...mockCardData].sort(() => Math.random() - 0.5);
    const selectedCards = shuffledCards.slice(0, numberOfCards);

    const aiResponse: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: `고객님의 요청에 맞는 ${numberOfCards}개의 우리카드 상품을 추천해 드립니다. 이 카드들은 특히 영화 관람 혜택이 뛰어나며, 고객님의 라이프스타일에 최적화되어 있습니다. 자세한 내용은 아래 카드 정보를 확인해 주세요!`,
        cards: selectedCards,
    };

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return NextResponse.json(aiResponse);
}
