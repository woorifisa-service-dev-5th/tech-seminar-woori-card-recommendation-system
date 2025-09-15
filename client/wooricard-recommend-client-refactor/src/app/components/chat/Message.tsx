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
            {!isUser && (
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-700/50 border border-blue-300/20'>
                    <LuSparkles className='h-5 w-5 text-blue-200' />
                </div>
            )}

            <div
                className={`flex max-w-[85%] flex-col gap-3  rounded-2xl p-4 sm:max-w-2xl lg:max-w-4xl border transition-all duration-300 ${
                    isUser
                        ? 'bg-blue-600 text-white border-blue-400/30 shadow-lg'
                        : 'bg-blue-800/60 text-white border-blue-300/20 shadow-lg'
                }`}
            >
                <p className='text-base leading-relaxed whitespace-pre-wrap'>
                    {message.text}
                </p>

                {message.isLoadingCards && (
                    <div className='mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {[...Array(3)].map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                )}

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

            {isUser && (
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-700/50 border border-slate-300/20'>
                    <LuUser className='h-5 w-5 text-slate-200' />
                </div>
            )}
        </div>
    );
}
