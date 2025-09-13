import { NextRequest, NextResponse } from 'next/server';
import type { CardData } from '@/types/type'; // CardData 타입을 import합니다.

const SPRING_SERVER_URL = 'http://localhost:8081/api/cards';
const SPRING_SERVER_BASE_URL = 'http://localhost:8081'; // 이미지 경로를 위한 기본 URL

/**
 * 카드 이름 목록을 받아 Spring 서버에 상세 정보를 요청하고,
 * 이미지 URL을 프론트엔드에서 바로 사용할 수 있는 전체 경로로 변환하여 반환하는 프록시 API
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const names = searchParams.get('names');

        if (!names) {
            return NextResponse.json(
                { error: 'Card names are required' },
                { status: 400 }
            );
        }

        const springResponse = await fetch(
            `${SPRING_SERVER_URL}?names=${encodeURIComponent(names)}`
        );

        if (!springResponse.ok) {
            const errorText = await springResponse.text();
            return NextResponse.json(
                { error: `Error from Spring server: ${errorText}` },
                { status: springResponse.status }
            );
        }

        const cardData: CardData[] = await springResponse.json();

        const cardDataWithFullUrl = cardData.map((card) => ({
            ...card,
            imageUrl: card.imageUrl
                ? `${SPRING_SERVER_BASE_URL}${card.imageUrl}`
                : '',
        }));

        return NextResponse.json(cardDataWithFullUrl);
    } catch (error) {
        console.error('Error fetching card details:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
