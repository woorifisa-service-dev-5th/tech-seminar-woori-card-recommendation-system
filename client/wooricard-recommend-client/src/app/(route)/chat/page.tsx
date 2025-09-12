import type React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ChatWindow from '@/components/chat/ChatWindow';
import AuroraBackground from '@/components/bits/Aurora/AuroraBackground';

const logoSrc = '/images/wooricard_logo.png';

export default function ChatPage() {
    return (
        <div className='relative flex h-screen w-full flex-col bg-black'>
            {/* 배경 효과 */}
            <div className='absolute inset-0 overflow-hidden'>
                <AuroraBackground />
            </div>

            {/* 헤더 */}
            <header className='relative z-10 flex h-16 shrink-0 items-center justify-between border-b border-blue-300/20 bg-black/50 backdrop-blur-lg px-4 md:px-6'>
                <Link href='/' className='flex items-center gap-3'>
                    <div className='p-1 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center'>
                        <Image
                            src={logoSrc}
                            alt='우리카드 로고'
                            width={32}
                            height={32}
                            className='rounded-lg'
                        />
                    </div>
                    <h1 className='text-xl font-bold text-white font-woori'>
                        우리카드 AI 챗봇
                    </h1>
                </Link>
            </header>

            {/* 채팅창 컴포넌트 */}
            <ChatWindow />
        </div>
    );
}
