'use client';

import { useEffect, useState, useRef } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import type { Message as MessageType } from '@/types/chat';

export default function ChatWindow() {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const hasFetchedInitial = useRef(false);

    const fetchResponse = async (currentMessages: MessageType[]) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: currentMessages }),
            });
            if (!res.ok) {
                throw new Error('API request failed');
            }
            const aiResponse = await res.json();

            // ✨ FIX: Validate the API response before setting state
            if (aiResponse && aiResponse.id && aiResponse.role) {
                setMessages((prev) => [...prev, aiResponse]);
            } else {
                throw new Error('Invalid response structure from API');
            }
        } catch (error) {
            console.error(error);
            const errorMessage: MessageType = {
                id: crypto.randomUUID(),
                role: 'assistant',
                text: '죄송합니다, 답변을 생성하는 중 오류가 발생했습니다.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && !hasFetchedInitial.current) {
            const query = new URLSearchParams(window.location.search).get('q');
            if (query) {
                const initialUserMessage: MessageType = {
                    id: 'initial',
                    text: decodeURIComponent(query),
                    role: 'user',
                };
                setMessages([initialUserMessage]);
                fetchResponse([initialUserMessage]);
                hasFetchedInitial.current = true;
            }
        }
    }, []);

    const handleSendMessage = (input: string) => {
        if (!input.trim() || isLoading) return;
        const newUserMessage: MessageType = {
            id: crypto.randomUUID(),
            text: input,
            role: 'user',
        };
        const newMessages = [...messages, newUserMessage];
        setMessages(newMessages);
        fetchResponse(newMessages);
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
