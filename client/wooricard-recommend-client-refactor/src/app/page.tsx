import PrismBackground from '@/components/bits/Prism/PrismBackground';
import SearchBar from '@/components/home/SearchBar';
import TextType from '@/components/bits/TextType/TextType';

export default function Home() {
    return (
        <main className='relative h-screen w-screen overflow-hidden bg-black'>
            <PrismBackground />

            <div className='absolute inset-0 flex flex-col items-center justify-center p-4'>
                <TextType
                    as='h1'
                    text={[
                        '우리카드 AI 추천',
                        '원하는 카드를 추천받아보세요',
                        '원하는 혜택을 입력해보세요',
                    ]}
                    typingSpeed={100}
                    deletingSpeed={50}
                    pauseDuration={2000}
                    className='h-24 text-5xl font-extrabold text-center md:h-32 md:text-6xl mb-10 font-woori'
                    // textColors={['#ffffff', '#a7f3d0', '#fef08a']}
                />

                <SearchBar />
            </div>
        </main>
    );
}
