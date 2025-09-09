'use client';

import { useEffect, useRef } from 'react';
import type { Message as MessageType } from '@/types/chat';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
    messages: MessageType[];
    isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div className='flex-1 overflow-y-auto p-4 md:p-6 relative z-10 min-h-0'>
            <div className='mx-auto max-w-4xl space-y-6'>
                {messages.map((msg, index) => (
                    <div
                        key={msg.id}
                        className='animate-in slide-in-from-bottom-4 duration-500'
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <Message message={msg} />
                    </div>
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
