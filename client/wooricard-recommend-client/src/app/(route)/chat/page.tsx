import type React from 'react';
import Link from 'next/link'; // 1. next/link에서 Link를 import 합니다.
import ChatWindow from '@/components/chat/ChatWindow';
import AuroraBackground from '@/components/bits/Aurora/AuroraBackground';
import Image from 'next/image';

// 2. public 폴더의 이미지는 import 대신 절대 경로 문자열로 사용하는 것이 좋습니다.
const logoSrc = '/images/wooricard_logo.png';

export default function ChatPage() {
    return (
        <div className='relative flex h-screen w-full flex-col bg-black'>
            <div className='absolute inset-0 overflow-hidden'>
                <AuroraBackground />
            </div>

            <header className='relative z-10 flex h-16 shrink-0 items-center justify-center border-b border-blue-300/20 bg-blue-800/80 px-4 md:px-6'>
                <div className='flex items-center gap-3'>
                    {/* 3. 로고 전체를 Link 컴포넌트로 감싸고, href="/"를 설정합니다. */}
                    <Link href='/'>
                        <div className='p-1 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center'>
                            <Image
                                src={logoSrc}
                                alt='우리카드 로고'
                                width={32}
                                height={32}
                                className='rounded-full'
                            />
                        </div>
                    </Link>
                    <h1 className='text-xl font-bold text-white font-woori'>
                        우리카드 AI 챗봇
                    </h1>
                </div>
            </header>
            <ChatWindow />
        </div>
    );
}
