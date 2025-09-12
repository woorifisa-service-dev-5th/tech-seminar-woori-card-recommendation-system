import { NextRequest } from 'next/server';

// Spring Webflux 서버의 주소
const SPRING_SERVER_URL = 'http://localhost:8080/api/chat/stream';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('Next API (/api/chat) received query:', body.query);

        // Spring 서버에 model 필드를 포함하여 요청을 보냅니다.
        const springResponse = await fetch(SPRING_SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: body.query,
                model: 'gemini-2.5-flash', // 사용할 모델을 명시합니다.
            }),
        });

        if (!springResponse.ok || !springResponse.body) {
            const errorText = await springResponse.text();
            console.error('Error from Spring server:', errorText);
            return new Response(`Error from Spring server: ${errorText}`, {
                status: springResponse.status,
            });
        }

        // ✨ [핵심 수정] 스트림을 수동으로 읽고 쓰는 방식으로 변경
        const reader = springResponse.body.getReader();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            break; // 스트림이 끝나면 루프 종료
                        }
                        controller.enqueue(value); // 받은 데이터 조각을 클라이언트로 즉시 전달
                    }
                } catch (error) {
                    console.error(
                        'Error while reading stream from Spring:',
                        error
                    );
                    controller.error(error);
                } finally {
                    controller.close(); // 스트림 컨트롤러 종료
                    reader.releaseLock(); // 리더 잠금 해제
                    console.log('Next API stream to client finished.');
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream; charset=utf-8',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Error in Next.js API route (/api/chat):', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
