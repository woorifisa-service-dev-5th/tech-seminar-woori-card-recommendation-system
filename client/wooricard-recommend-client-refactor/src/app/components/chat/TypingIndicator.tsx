import { LuSparkles } from 'react-icons/lu';

export default function TypingIndicator() {
    return (
        <div className='flex items-start gap-4 animate-in slide-in-from-bottom-4 duration-500'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10'>
                <LuSparkles className='h-5 w-5 text-blue-400 animate-pulse' />
            </div>
            <div className='max-w-[80%] space-y-3 rounded-2xl rounded-bl-none bg-white/10 backdrop-blur-xl border border-white/10 p-4 text-slate-200'>
                <div className='flex items-center space-x-2'>
                    <span className='h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]'></span>
                    <span className='h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.15s]'></span>
                    <span className='h-2 w-2 animate-bounce rounded-full bg-cyan-400'></span>
                </div>
            </div>
        </div>
    );
}
