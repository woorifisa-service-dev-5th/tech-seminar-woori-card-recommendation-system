import Image from 'next/image';
import type { CardData } from '@/types/type';
import { LuCreditCard } from 'react-icons/lu';
import CheckIcon from './CheckIcon';

interface CardProps {
    card: CardData;
    index: number;
}

export default function Card({ card, index }: CardProps) {
    // Spring 서버로부터 받은 혜택(단일 문자열)을 쉼표 기준으로 분리하여 배열로 만듭니다.
    const benefitsArray = card.benefits
        ? card.benefits.split(',').map((b) => b.trim())
        : [];

    return (
        <div
            className='flex flex-col overflow-hidden rounded-xl border border-blue-300/30 bg-blue-700/40 hover:bg-blue-700/60 transition-all duration-300 group/card animate-in slide-in-from-bottom-2'
            style={{ animationDelay: `${index * 150}ms` }}
        >
            <div className='relative overflow-hidden flex-shrink-0 h-56'>
                <Image
                    src={card.imageUrl || '/placeholder.svg'}
                    alt={card.cardName}
                    fill
                    style={{
                        objectFit: 'contain', // ✨ [수정] 'cover'에서 'contain'으로 변경하여 이미지가 잘리지 않도록 합니다.
                    }}
                    className='group-hover/card:scale-105 transition-transform duration-500 p-2' // 패딩 추가로 이미지 주변 여백 확보
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent opacity-50'></div>
            </div>
            <div className='p-3 flex-1 flex flex-col'>
                <div className='flex items-center gap-2 mb-2'>
                    <LuCreditCard className='h-4 w-4 text-blue-200' />
                    <h3 className='text-sm font-bold text-white line-clamp-1'>
                        {card.cardName}
                    </h3>
                </div>
                <ul className='space-y-1 text-xs text-blue-100 mb-3 flex-1'>
                    {benefitsArray.slice(0, 2).map((benefit, benefitIndex) => (
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
