import type { CardData } from '@/types/type';
import { LuCreditCard } from 'react-icons/lu';
import CheckIcon from './CheckIcon';
import TiltedCard from '@/components/bits/TitledCard/TitledCard';

interface CardProps {
    card: CardData;
    index: number;
}

export default function Card({ card, index }: CardProps) {
    const benefitsArray = card.benefits
        ? card.benefits.split(',').map((b) => b.trim())
        : [];

    return (
        <div
            className='flex flex-col overflow-hidden rounded-xl border border-blue-300/30 bg-blue-700/40 transition-all duration-300 group/card animate-in slide-in-from-bottom-2'
            style={{ animationDelay: `${index * 150}ms` }}
        >
            <TiltedCard
                imageSrc={card.imageUrl}
                altText={card.cardName}
                captionText={card.cardName}
                containerHeight='300px' 
                imageWidth='100%'
                imageHeight='93%'
                scaleOnHover={1.1}
                rotateAmplitude={15}
                showTooltip={true}
                displayOverlayContent={true} 
            />

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
                <a
                    href={card.cardUrl}
                    target='_blank' // 새 탭에서 열리도록 설정
                    rel='noopener noreferrer' 
                    className='w-full text-center rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-2 text-xs font-semibold text-white transition-all duration-300 active:scale-95 border border-blue-400/30'
                >
                    상세보기
                </a>
            </div>
        </div>
    );
}
