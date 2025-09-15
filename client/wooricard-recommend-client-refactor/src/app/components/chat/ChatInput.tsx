'use client';

import type React from 'react';

import { useState } from 'react';
import { LuSend, LuMic } from 'react-icons/lu';

interface ChatInputProps {
    onSendMessage: (input: string) => void;
    isLoading: boolean;
}

export default function ChatInput({
    onSendMessage,
    isLoading,
}: ChatInputProps) {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        onSendMessage(input);
        setInput('');
    };

    return (
        <div className='border-t border-white/10 bg-white/5 backdrop-blur-xl p-4 relative z-10'>
            <form
                onSubmit={handleSubmit}
                className='mx-auto flex w-full max-w-4xl items-center gap-3'
            >
                <div className='relative flex-1'>
                    <input
                        type='text'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='메시지를 입력하세요...'
                        disabled={isLoading}
                        className='w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm px-6 py-4 pr-14 text-white placeholder-slate-300 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20 disabled:opacity-50 transition-all duration-300'
                    />
                    <button
                        type='button'
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-200'
                        aria-label='음성 입력'
                    >
                        <LuMic className='h-4 w-4 text-slate-300' />
                    </button>
                </div>
                <button
                    type='submit'
                    disabled={isLoading || !input.trim()}
                    className='flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all duration-300 hover:from-blue-500 hover:to-purple-500 hover:shadow-lg hover:shadow-blue-500/25 disabled:from-slate-600 disabled:to-slate-600 disabled:opacity-50 active:scale-95 backdrop-blur-sm border border-white/10'
                    aria-label='메시지 전송'
                >
                    <LuSend
                        className={`h-6 w-6 transition-transform duration-300 ${
                            isLoading ? 'animate-pulse' : ''
                        }`}
                    />
                </button>
            </form>
        </div>
    );
}
