export default function CardSkeleton() {
    return (
        <div className='flex flex-col overflow-hidden rounded-xl border border-blue-300/20 bg-blue-700/50 p-3 animate-pulse'>
            {/* 이미지 영역 */}
            <div className='h-24 w-full bg-blue-600/50 rounded-lg mb-3'></div>
            {/* 카드 이름 */}
            <div className='h-4 w-3/4 bg-blue-600/50 rounded mb-2'></div>
            {/* 혜택 정보 */}
            <div className='space-y-1 text-xs text-blue-100 mb-3 flex-1'>
                <div className='h-3 w-full bg-blue-600/50 rounded'></div>
                <div className='h-3 w-5/6 bg-blue-600/50 rounded'></div>
            </div>
            {/* 버튼 */}
            <div className='h-8 w-full bg-blue-600 rounded-lg'></div>
        </div>
    );
}
