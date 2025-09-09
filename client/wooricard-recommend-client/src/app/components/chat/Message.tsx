import type { Message as MessageType } from '@/types/chat';
import { LuSparkles, LuUser } from 'react-icons/lu';
import Card from './Card';

export default function Message({ message }: { message: MessageType }) {
    const isUser = message.role === 'user';

    const cards = (message.cards || (message.card ? [message.card] : [])).slice(
        0,
        3
    );

    // 1. 레이아웃 상태를 관리하던 변수들을 모두 삭제합니다.

    return (
        <div
            className={`flex items-start gap-4 ${
                isUser ? 'justify-end' : ''
            } group`}
        >
            {/* 봇 아이콘 */}
            {!isUser && (
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-700/50 border border-blue-300/20'>
                    <LuSparkles className='h-5 w-5 text-blue-200' />
                </div>
            )}

            {/* 메시지 및 카드 컨테이너 */}
            <div
                className={`flex max-w-[85%] flex-col gap-3 rounded-2xl p-4 sm:max-w-xl border transition-all duration-300 ${
                    isUser
                        ? 'rounded-br-none bg-blue-600 text-white border-blue-400/30 shadow-lg'
                        : 'rounded-bl-none bg-blue-800/60 text-white border-blue-300/20 shadow-lg'
                }`}
            >
                {/* 2. 텍스트 답변을 항상 최상단에 표시합니다. */}
                <p className='text-base leading-relaxed'>{message.text}</p>

                {/* 3. 카드가 1개 이상일 때 항상 3열 그리드 컨테이너를 렌더링합니다. */}
                {cards.length > 0 && (
                    <div className='mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                        {cards.map((card, index) => (
                            // 4. Card 컴포넌트에서 layout prop을 제거합니다.
                            <Card key={index} card={card} index={index} />
                        ))}
                    </div>
                )}
            </div>

            {/* 사용자 아이콘 */}
            {isUser && (
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 border border-blue-400/30'>
                    <LuUser className='h-5 w-5 text-white' />
                </div>
            )}
        </div>
    );
}
