import type { CardData } from '@/types/chat';
import { LuCreditCard } from 'react-icons/lu';
import CheckIcon from './CheckIcon';

interface CardProps {
    card: CardData;
    index: number;
    // 'layout' prop을 제거합니다.
}

// props에서 layout을 제거합니다.
export default function Card({ card, index }: CardProps) {
    return (
        // 1. 동적인 className 로직을 제거하여 항상 동일한 스타일을 유지합니다.
        <div
            className='flex flex-col overflow-hidden rounded-xl border border-blue-300/30 bg-blue-700/40 hover:bg-blue-700/60 transition-all duration-300 group/card animate-in slide-in-from-bottom-2'
            style={{ animationDelay: `${index * 150}ms` }}
        >
            <div className='relative overflow-hidden flex-shrink-0'>
                <img
                    src={card.image || '/placeholder.svg'}
                    alt={card.name}
                    className='w-full object-cover group-hover/card:scale-105 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent'></div>
            </div>
            <div className='p-3 flex-1 flex flex-col'>
                <div className='flex items-center gap-2 mb-2'>
                    <LuCreditCard className='h-4 w-4 text-blue-200' />
                    <h3 className='text-sm font-bold text-white line-clamp-1'>
                        {card.name}
                    </h3>
                </div>
                <ul className='space-y-1 text-xs text-blue-100 mb-3 flex-1'>
                    {card.benefits.slice(0, 2).map((benefit, benefitIndex) => (
                        <li
                            key={benefitIndex}
                            className='flex items-start animate-in slide-in-from-left-2 duration-300 line-clamp-2'
                            style={{
                                animationDelay: `${
                                    index * 150 + benefitIndex * 50
                                }ms`,
                            }}
                        >
                            <CheckIcon />
                            <span className='text-xs leading-tight'>
                                {benefit}
                            </span>
                        </li>
                    ))}
                </ul>
                <button className='w-full rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-2 text-xs font-semibold text-white transition-all duration-300 active:scale-95 border border-blue-400/30'>
                    상세보기
                </button>
            </div>
        </div>
    );
}
