import type { Message as MessageType } from '@/types/type';
import { LuSparkles, LuUser } from 'react-icons/lu';
import Card from './Card';
import CardSkeleton from './CardSkeleton';

export default function Message({ message }: { message: MessageType }) {
    const isUser = message.role === 'user';
    const cards = message.cards || [];

    if (
        !isUser &&
        !message.text &&
        !message.isLoadingCards &&
        cards.length === 0
    ) {
        return null;
    }

    return (
        <div
            className={`flex items-start gap-4 ${
                isUser ? 'justify-end' : ''
            } group focus:outline-none`}
        >
            {/* 봇 아이콘 */}
            {!isUser && (
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-700/50 border border-blue-300/20'>
                    <LuSparkles className='h-5 w-5 text-blue-200' />
                </div>
            )}

            {/* 메시지 및 카드 컨테이너 */}
            <div
                className={`flex max-w-[85%] flex-col gap-3  rounded-2xl p-4 sm:max-w-2xl lg:max-w-4xl border transition-all duration-300 ${
                    isUser
                        ? 'bg-blue-600 text-white border-blue-400/30 shadow-lg'
                        : 'bg-blue-800/60 text-white border-blue-300/20 shadow-lg'
                }`}
            >
                {/* 텍스트 답변 (줄바꿈 유지) */}
                <p className='text-base leading-relaxed whitespace-pre-wrap'>
                    {message.text}
                </p>

                {/* 카드 로딩 중 스켈레톤 UI 표시 */}
                {message.isLoadingCards && (
                    <div className='mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {[...Array(3)].map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* 카드 데이터 수신 후 렌더링 */}
                {cards.length > 0 && (
                    <div className='mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {cards.map((card, index) => (
                            <Card
                                key={card.id || index}
                                card={card}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* 사용자 아이콘 */}
            {isUser && (
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-700/50 border border-slate-300/20'>
                    <LuUser className='h-5 w-5 text-slate-200' />
                </div>
            )}
        </div>
    );
}
