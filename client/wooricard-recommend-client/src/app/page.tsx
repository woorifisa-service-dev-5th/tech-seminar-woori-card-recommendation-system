import PrismBackground from '@/components/bits/Prism/PrismBackground';

export default function Home() {
    return (
        <main className='relative h-screen w-screen overflow-hidden bg-black'>
            <PrismBackground />

            <div className='absolute inset-0 flex items-center justify-center'>
                <h1 className='text-5xl font-bold text-white'>
                    Wooricard Recommender
                </h1>
            </div>
        </main>
    );
}
