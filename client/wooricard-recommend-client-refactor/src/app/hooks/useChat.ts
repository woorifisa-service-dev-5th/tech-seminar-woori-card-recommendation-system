'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Message, CardData } from '@/types/type';
import { cleanUpResponseText } from '@/lib/chat-utils';

const SPRING_SERVER_BASE_URL = 'http://localhost:8082';

/**
 * 채팅 기능과 관련된 모든 상태와 로직을 관리하는 커스텀 훅입니다.
 */
export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const hasFetchedInitial = useRef(false);

    const sendMessage = useCallback(async (input: string) => {
        if (!input.trim()) return;

        abortControllerRef.current?.abort();
        const newAbortController = new AbortController();
        abortControllerRef.current = newAbortController;

        const newUserMessage: Message = {
            id: crypto.randomUUID(),
            text: input,
            role: 'user',
        };
        setMessages((prev) => [...prev, newUserMessage]);
        setIsLoading(true); // 1. 로딩 시작 -> TypingIndicator 표시

        const assistantMessageId = crypto.randomUUID();
        const assistantPlaceholder: Message = {
            id: assistantMessageId,
            role: 'assistant',
            text: '',
            cards: [],
            isLoadingCards: false, // 2. 카드 스켈레톤은 아직 표시하지 않음
        };
        setMessages((prev) => [...prev, assistantPlaceholder]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: input }),
                signal: newAbortController.signal,
            });

            if (!response.body) throw new Error('Response body is null');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let fullResponseText = '';
            let isFirstChunk = true;

            while (true) {
                const { done, value } = await reader.read();

                // 3. AI로부터 첫 응답을 받으면 로딩 상태 전환
                if (isFirstChunk && value) {
                    setIsLoading(false); // TypingIndicator 숨김
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === assistantMessageId
                                ? { ...msg, isLoadingCards: true }
                                : msg
                        )
                    ); // CardSkeleton 표시
                    isFirstChunk = false;
                }

                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split('\n\n');
                buffer = parts.pop() || '';

                for (const part of parts) {
                    if (part.startsWith('data: ')) {
                        const dataContent = part.substring(6);

                        if (
                            dataContent.trim().startsWith('[') &&
                            dataContent.trim().endsWith(']')
                        ) {
                            try {
                                const cards: CardData[] =
                                    JSON.parse(dataContent);
                                // 4. 카드 데이터의 imageUrl에 서버 주소를 붙여 완전한 URL로 만듦
                                const cardsWithFullUrl = cards.map((card) => ({
                                    ...card,
                                    imageUrl: card.imageUrl
                                        ? `${SPRING_SERVER_BASE_URL}${card.imageUrl}`
                                        : '',
                                }));

                                setMessages((prev) =>
                                    prev.map((msg) =>
                                        msg.id === assistantMessageId
                                            ? {
                                                  ...msg,
                                                  cards: cardsWithFullUrl,
                                                  isLoadingCards: false,
                                              }
                                            : msg
                                    )
                                );
                            } catch (e) {
                                console.error(
                                    'Failed to parse card JSON array:',
                                    e
                                );
                                fullResponseText += dataContent;
                            }
                        } else {
                            fullResponseText += dataContent;
                        }
                    }
                }

                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantMessageId
                            ? {
                                  ...msg,
                                  text: cleanUpResponseText(fullResponseText),
                              }
                            : msg
                    )
                );
            }

            // 5. 스트림이 끝났을 때, 만약 카드 정보가 오지 않았다면 스켈레톤을 숨김
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === assistantMessageId && msg.isLoadingCards
                        ? { ...msg, isLoadingCards: false }
                        : msg
                )
            );
        } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
                console.error('Streaming failed:', error);
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantMessageId
                            ? {
                                  ...m,
                                  text: '죄송합니다. 답변 생성 중 오류가 발생했습니다.',
                                  isLoadingCards: false,
                              }
                            : m
                    )
                );
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && !hasFetchedInitial.current) {
            const query = new URLSearchParams(window.location.search).get('q');
            if (query) {
                hasFetchedInitial.current = true;
                sendMessage(query);
            }
        }
    }, [sendMessage]);

    return { messages, isLoading, sendMessage };
}
