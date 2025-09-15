import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import http from 'k6/http';
import { check, group } from 'k6';

// --- 테스트 환경 설정 (WebFlux 부하 테스트용) ---
export const options = {
    scenarios: {
        contacts: {
            executor: 'ramping-vus', // 점진적으로 사용자를 늘리는 시나리오
            startVUs: 0,
            stages: [
                // 1단계: 1분 동안 가상 사용자를 500명까지 대폭 늘립니다.
                { duration: '1m', target: 500 }, 
                // 2단계: 500명의 사용자로 2분 동안 최대 부하를 유지합니다.
                { duration: '2m', target: 500 }, 
                // 3단계: 30초 동안 사용자를 0명으로 줄입니다.
                { duration: '30s', target: 0 },  
            ],
            gracefulRampDown: '10s',
        },
    },
    // 테스트 성공/실패 기준 (부하가 매우 높으므로 실패율 기준을 약간 완화)
    thresholds: {
        'http_req_failed': ['rate<0.02'],     // http 에러 발생률이 2% 미만
        'http_req_duration': ['p(95)<1500'], // 요청의 95%는 1500ms 안에 처리
        'checks': ['rate>0.98'],             // check 성공률이 98% 이상
    },
};

const BASE_URL = 'http://localhost:8081';

// --- 테스트에 사용할 쿼리 (기존과 동일) ---
const queryScenarios = [
    ['카드의정석 TEN'],
    ['트래블월렛 우리카드'],
    ['D4카드의정석Ⅱ'],
    ['SKT 우리카드'],
    ['카드의정석 EVERY MILE SKYPASS', '카드의정석 EVERY POINT'],
    ['카드의정석 SHOPPING+', '우리카드 7CORE'],
    ['카드의정석 TEN', 'D4카드의정석Ⅱ'],
    ['카드의정석 EVERY DISCOUNT', '카드의정석2', 'DA카드의정석Ⅱ'],
    ['로얄블루1000카드 [SKYPASS]', '카드의정석 PREMIUM MILEAGE(SKYPASS)', 'ALL 우리카드 Infinite'],
    ['없는카드이름'],
    ['카드의정석 TEN', '잘못된카드이름'],
];

// --- 테스트 시나리오 ---
export default function () {
    group('API Endpoint: /api/cards (High-Concurrency)', function () {
        
        const randomQuery = queryScenarios[Math.floor(Math.random() * queryScenarios.length)];
        const cardNames = randomQuery.join(',');
        const url = `${BASE_URL}/api/cards?names=${encodeURIComponent(cardNames)}`;

        const res = http.get(url, { tags: { name: 'GetCardInfo' } });

        check(res, {
            '[Status is 200]': (r) => r.status === 200,
            '[Response is valid JSON]': (r) => {
                try {
                    return r.body ? Array.isArray(JSON.parse(r.body)) : true;
                } catch (e) {
                    console.error(`Invalid JSON response for query: ${cardNames}`);
                    return false;
                }
            },
        });
        
    });
}

// --- 테스트 결과 리포트 생성 ---
export function handleSummary(data) {
    return {
        "mvc-highest-load-report.html": htmlReport(data), // 결과 파일 이름을 다르게 지정
    };
}