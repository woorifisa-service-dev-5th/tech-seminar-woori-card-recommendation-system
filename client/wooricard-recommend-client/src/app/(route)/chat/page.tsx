// src/app/chat/page.tsx
import type React from 'react';
import ChatWindow from '@/components/chat/ChatWindow';
import AuroraBackground from '@/components/bits/Aurora/AuroraBackground'; // Aurora 배경 컴포넌트 import
import Image from 'next/image'; // Next.js Image 컴포넌트 import
import logo from '../../../../public/images/wooricard_logo.png';
export default function ChatPage() {
    return (
        // flex-col과 h-screen을 유지하여 레이아웃을 잡고, 배경색을 bg-black으로 설정
        <div className='relative flex h-screen w-full flex-col bg-black'>
            {/* Aurora 배경 컴포넌트 배치 */}
            <div className='absolute inset-0 overflow-hidden'>
                <AuroraBackground />
            </div>

            <header className='relative z-10 flex h-16 shrink-0 items-center justify-center border-b border-blue-300/20 bg-blue-800/80 px-4 md:px-6'>
                <div className='flex items-center gap-3'>
                    {/* LuSparkles 대신 우리카드 로고 이미지 배치 */}
                    <div className='p-1 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center'>
                        <Image
                            src={logo} // public 폴더 기준 경로
                            alt='우리카드 로고'
                            width={32} // 적절한 크기로 조절
                            height={32} // 적절한 크기로 조절
                            className='rounded-full' // 필요하면 둥근 테두리 적용
                        />
                    </div>
                    <h1 className='text-xl font-bold text-white font-woori'>
                        우리카드 AI 챗봇
                    </h1>
                </div>
            </header>
            <ChatWindow />
        </div>
    );
}
