'use client';

import { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import type { Message, CardData } from '@/types/type';
import { parseCardNames, cleanUpResponseText } from '@/lib/chat-utils';

export default function ChatWindow() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const hasFetchedInitial = useRef(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && !hasFetchedInitial.current) {
            const query = new URLSearchParams(window.location.search).get('q');
            if (query) {
                hasFetchedInitial.current = true;
                handleSendMessage(decodeURIComponent(query));
            }
        }
    }, []);

    const handleSendMessage = async (input: string) => {
        if (!input.trim() || isLoading) return;

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

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // ✨ [수정] model 필드를 body에 포함하여 전송합니다.
                body: JSON.stringify({
                    query: input,
                    model: 'gemini-1.5-flash',
                }),
                signal: newAbortController.signal,
            });

            if (!response.body) throw new Error('Response body is null');

            // ✨ [수정] 스트림이 시작되기 전에 로딩 상태를 변경하지 않도록 아래 두 줄을 이동/변경합니다.
            const assistantPlaceholder: Message = {
                id: assistantMessageId,
                role: 'assistant',
                text: '',
            };
            setMessages((prev) => [...prev, assistantPlaceholder]);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let fullResponseText = '';
            let isFirstChunk = true; // 첫 번째 데이터 조각인지 확인하는 플래그

            while (true) {
                const { done, value } = await reader.read();

                // ✨ [수정] 첫 번째 데이터 조각을 받으면 로딩 인디케이터를 숨깁니다.
                if (isFirstChunk && value) {
                    setIsLoading(false);
                    isFirstChunk = false;
                }

                if (done) {
                    break;
                }

                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split('\n\n');
                buffer = parts.pop() || '';

                for (const part of parts) {
                    if (part.startsWith('data: ')) {
                        const content = part.substring(6);
                        fullResponseText += content;
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
                const content = buffer.substring(6);
                fullResponseText += content;
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
                console.log('LOG: Stream aborted by user action.');
            } else {
                console.error('Streaming failed:', error);
                const errorMessage: Message = {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    text: '죄송합니다. 답변 생성 중 오류가 발생했습니다.',
                };
                // 기존의 비어있는 assistant 메시지를 에러 메시지로 교체
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantMessageId ? errorMessage : m
                    )
                );
            }
        } finally {
            // ✨ [수정] 스트림이 완전히 끝나거나 오류 발생 시 최종적으로 로딩 상태를 false로 설정합니다.
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    };

    const fetchCardDetails = async (messageId: string, cardNames: string[]) => {
        try {
            const response = await fetch(
                `/api/cards?names=${encodeURIComponent(cardNames.join(','))}`
            );
            if (!response.ok) throw new Error('Failed to fetch card details');
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
    };

    return (
        <div className='flex flex-1 flex-col min-h-0'>
            <MessageList messages={messages} isLoading={isLoading} />
            <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
            />
        </div>
    );
}
