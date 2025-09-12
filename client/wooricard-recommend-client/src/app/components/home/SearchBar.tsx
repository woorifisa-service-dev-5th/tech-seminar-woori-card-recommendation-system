'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LuSearch, LuMic, LuSparkles } from 'react-icons/lu';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();

    const placeholderText =
        '어떤 카드를 추천해 드릴까요? 예: 20대 여자가 주말에 영화를 자주보는데, 혜택이 좋은 카드를 추천해줘';

    const triggerSearch = () => {
        if (query.trim()) {
            router.push(`/chat?q=${encodeURIComponent(query)}`);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        triggerSearch();
    };

    return (
        <div className='relative w-full max-w-4xl'>
            {/* Background glow effect */}
            <div className='absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

            <form
                onSubmit={handleFormSubmit}
                className={`
                    group relative flex items-center w-full 
                    bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90
                    backdrop-blur-xl border border-slate-700/50
                    rounded-2xl shadow-2xl p-1.5
                    transition-all duration-500 ease-out
                    hover:border-slate-600/70 hover:shadow-blue-500/10
                    ${
                        isFocused
                            ? 'border-blue-500/50 shadow-blue-500/20 shadow-2xl'
                            : ''
                    }
                `}
            >
                {/* Inner container with glassmorphism */}
                <div className='flex items-center w-full bg-slate-800/30 rounded-xl p-3'>
                    <button
                        type='button'
                        onClick={triggerSearch}
                        className='relative p-2'
                        aria-label='검색'
                    >
                        <LuSearch
                            className={`
                            text-xl transition-all duration-300
                            ${
                                isFocused
                                    ? 'text-blue-400 scale-110'
                                    : 'text-slate-400'
                            }
                        `}
                        />
                        {isFocused && (
                            <div className='absolute inset-0 -m-2 bg-blue-400/20 rounded-full animate-ping' />
                        )}
                    </button>

                    <div className='relative flex-grow'>
                        <input
                            type='text'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder=''
                            className={`
                              w-full bg-transparent text-white 
                              focus:outline-none text-lg py-3 px-4 font-medium
                              transition-all duration-300
                            `}
                        />

                        {!query && !isFocused && (
                            <div className='absolute inset-0 flex items-center px-4 pointer-events-none overflow-hidden'>
                                <div className='whitespace-nowrap text-lg font-medium text-slate-400 animate-scroll-text'>
                                    {placeholderText}
                                </div>
                            </div>
                        )}

                        {!query && isFocused && (
                            <div className='absolute inset-0 flex items-center px-4 pointer-events-none'>
                                <div className='text-lg font-medium text-slate-300 truncate'>
                                    {'어떤 카드를 추천해드릴까요?'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AI sparkles indicator */}
                    <div className='flex items-center space-x-3'>
                        <button
                            type='button'
                            onClick={triggerSearch}
                            className='hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20 transition-colors hover:border-blue-500/40'
                        >
                            <LuSparkles className='text-blue-400 text-sm animate-pulse' />
                            <span className='text-xs font-medium text-blue-300'>
                                AI 추천
                            </span>
                        </button>

                        {/* Voice search button */}
                        <button
                            type='button'
                            className={`
                                p-3 rounded-xl transition-all duration-300
                                hover:bg-slate-700/50 hover:scale-105
                                active:scale-95 group/mic
                                ${isFocused ? 'bg-slate-700/30' : ''}
                            `}
                            aria-label='음성 검색'
                        >
                            <LuMic
                                className={`
                                text-xl transition-all duration-300
                                group-hover/mic:text-red-400
                                ${
                                    isFocused
                                        ? 'text-slate-300'
                                        : 'text-slate-400'
                                }
                            `}
                            />
                        </button>
                    </div>
                </div>

                <button type='submit' className='hidden' aria-hidden='true' />
            </form>

            {isFocused && (
                <div className='absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden z-50'>
                    <div className='p-2 space-y-1'>
                        <div className='px-3 py-2 text-xs font-medium text-slate-400 uppercase tracking-wider'>
                            추천 검색어
                        </div>
                        {[
                            '올리브영에서 화장품을 자주 사는데, 혜택이 좋은 카드 추천해줘',
                            '스타벅스같은 카페 할인 신용카드 추천해줘',
                            '편의점 할인 신용카드 추천해줘',
                        ].map((suggestion, index) => (
                            <button
                                key={index}
                                className='w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-700/50 rounded-lg transition-colors duration-200'
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    router.push(
                                        `/chat?q=${encodeURIComponent(
                                            suggestion
                                        )}`
                                    );
                                }}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
