'use client';

import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useChat } from '@/hooks/useChat';

/**
 * useChat 훅을 통해 채팅의 상태와 로직을 관리하고,
 * MessageList와 ChatInput 컴포넌트를 렌더링
 */
export default function ChatWindow() {
    const { messages, isLoading, sendMessage } = useChat();

    return (
        <div className='flex flex-1 flex-col min-h-0'>
            <MessageList messages={messages} isLoading={isLoading} />
            <ChatInput
                onSendMessage={sendMessage} 
                isLoading={isLoading}
            />
        </div>
    );
}
