'use client';

import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useChat } from '@/hooks/useChat';

/**
 * 채팅 UI의 메인 컨테이너 컴포넌트입니다.
 * useChat 훅을 통해 채팅의 상태와 로직을 관리하고,
 * MessageList와 ChatInput 컴포넌트를 렌더링합니다.
 */
export default function ChatWindow() {
    // ✨ useChat 훅을 호출하여 채팅 관련 상태와 함수를 가져옵니다.
    const { messages, isLoading, sendMessage } = useChat();

    return (
        <div className='flex flex-1 flex-col min-h-0'>
            <MessageList messages={messages} isLoading={isLoading} />
            <ChatInput
                onSendMessage={sendMessage} // 훅에서 받은 sendMessage 함수를 전달합니다.
                isLoading={isLoading}
            />
        </div>
    );
}
