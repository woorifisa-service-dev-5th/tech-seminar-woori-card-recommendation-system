'use client'; // 클라이언트 컴포넌트로 지정

import Aurora from './Aurora';

export default function AuroraBackground() {
    return (
        // Aurora 컴포넌트에 제공해주신 props를 적용합니다.
        <Aurora
            colorStops={['#3A29FF', '#FF94B4', '#FF3232']}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
        />
    );
}
