'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Message, CardData } from '@/types/type';
import { parseCardNames, cleanUpResponseText } from '@/lib/chat-utils';

/**
 * 채팅 기능과 관련된 모든 상태와 로직을 관리하는 커스텀 훅입니다.
 * 메시지 목록, 로딩 상태, 메시지 전송 및 카드 정보 조회 기능을 포함합니다.
 */
export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const hasFetchedInitial = useRef(false);

    /**
     * 카드 이름 배열을 받아 API를 통해 상세 정보를 비동기적으로 조회하고,
     * 해당 메시지의 상태를 업데이트하는 함수입니다.
     */
    const fetchCardDetails = useCallback(
        async (messageId: string, cardNames: string[]) => {
            try {
                const response = await fetch(
                    `/api/cards?names=${encodeURIComponent(
                        cardNames.join(',')
                    )}`
                );
                if (!response.ok)
                    throw new Error('Failed to fetch card details');
                const cards: CardData[] = await response.json();

                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === messageId
                            ? { ...msg, cards: cards, isLoadingCards: false }
                            : msg
                    )
                );
            } catch (error: unknown) {
                console.error('Failed to fetch card details:', error);
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === messageId
                            ? {
                                  ...msg,
                                  isLoadingCards: false,
                                  text:
                                      msg.text +
                                      '\n\n(카드 정보를 불러오는데 실패했습니다.)',
                              }
                            : msg
                    )
                );
            }
        },
        []
    );

    const sendMessage = useCallback(
        async (input: string) => {
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
            setIsLoading(true);

            const assistantMessageId = crypto.randomUUID();
            const assistantPlaceholder: Message = {
                id: assistantMessageId,
                role: 'assistant',
                text: '',
            };
            setMessages((prev) => [...prev, assistantPlaceholder]);

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: input,
                        model: 'gemini-2.5-flash',
                    }),
                    signal: newAbortController.signal,
                });
                console.log(response);
                if (!response.body) throw new Error('Response body is null');

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                let fullResponseText = '';
                let isFirstChunk = true;

                while (true) {
                    const { done, value } = await reader.read();

                    if (isFirstChunk && value) {
                        setIsLoading(false);
                        isFirstChunk = false;
                    }

                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const parts = buffer.split('\n\n');
                    buffer = parts.pop() || '';

                    for (const part of parts) {
                        if (part.startsWith('data: ')) {
                            fullResponseText += part.substring(6);
                        }
                    }

                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === assistantMessageId
                                ? { ...msg, text: fullResponseText }
                                : msg
                        )
                    );
                }

                if (buffer.startsWith('data: ')) {
                    fullResponseText += buffer.substring(6);
                }

                const cardNames = parseCardNames(fullResponseText);
                const cleanedText = cleanUpResponseText(fullResponseText);

                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantMessageId
                            ? {
                                  ...msg,
                                  text: cleanedText,
                                  isLoadingCards:
                                      !!cardNames && cardNames.length > 0,
                              }
                            : msg
                    )
                );

                if (cardNames && cardNames.length > 0) {
                    fetchCardDetails(assistantMessageId, cardNames);
                }
            } catch (error: unknown) {
                if (error instanceof Error && error.name === 'AbortError') {
                    console.log('Stream aborted by user action.');
                } else {
                    console.error('Streaming failed:', error);
                    const errorMessage: Message = {
                        id: assistantMessageId,
                        role: 'assistant',
                        text: '죄송합니다. 답변 생성 중 오류가 발생했습니다.',
                    };
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === assistantMessageId ? errorMessage : m
                        )
                    );
                }
            } finally {
                setIsLoading(false);
                abortControllerRef.current = null;
            }
        },
        [fetchCardDetails]
    );

    // URL 쿼리 파라미터로부터 초기 메시지를 전송하는 효과
    useEffect(() => {
        if (typeof window !== 'undefined' && !hasFetchedInitial.current) {
            const query = new URLSearchParams(window.location.search).get('q');
            if (query) {
                hasFetchedInitial.current = true;
                // 수정: URLSearchParams.get()이 이미 값을 디코딩하므로 decodeURIComponent()를 제거합니다.
                sendMessage(query);
            }
        }
    }, [sendMessage]);

    return { messages, isLoading, sendMessage };
}