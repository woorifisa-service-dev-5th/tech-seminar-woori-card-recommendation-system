import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import http from 'k6/http';
import { check, sleep, group } from 'k6';

// --- 테스트 환경 설정 ---
export const options = {
    scenarios: {
        contacts: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '20s', target: 15 }, // 1단계: 20초 동안 가상 사용자를 15명까지
                { duration: '30s', target: 15 }, // 2단계: 15명의 사용자로 30초 동안 부하를 유지
                { duration: '10s', target: 0 }, // 3단계: 10초 동안 사용자를 0명으로 줄임
            ],
            gracefulRampDown: '10s',
        },
    },
    // 테스트 성공/실패 기준 정의
    thresholds: {
        http_req_failed: ['rate<0.01'], // http 에러 발생률이 1% 미만
        http_req_duration: ['p(95)<800'], // 요청의 95%는 800ms 안에 처리
        checks: ['rate>0.99'], // check 성공률이 99% 이상
    },
};

const BASE_URL = 'http://localhost:8080';

const queryScenarios = [
    ['카드의정석 TEN'],
    ['트래블월렛 우리카드'],
    ['D4카드의정석Ⅱ'],
    ['SKT 우리카드'],

    ['카드의정석 EVERY MILE SKYPASS', '카드의정석 EVERY POINT'],
    ['카드의정석 SHOPPING+', '우리카드 7CORE'],
    ['카드의정석 TEN', 'D4카드의정석Ⅱ'],

    ['카드의정석 EVERY DISCOUNT', '카드의정석2', 'DA카드의정석Ⅱ'],
    [
        '로얄블루1000카드 [SKYPASS]',
        '카드의정석 PREMIUM MILEAGE(SKYPASS)',
        'ALL 우리카드 Infinite',
    ],

    // 잘못된 요청 (Edge Case)
    ['없는카드이름'],
    ['카드의정석 TEN', '잘못된카드이름'],
];

export default function () {
    group('API Endpoint: /api/cards (Request-Response)', function () {
        // 매 반복마다 queryScenarios에서 무작위로 하나를 선택
        const randomQuery =
            queryScenarios[Math.floor(Math.random() * queryScenarios.length)];
        const cardNames = randomQuery.join(','); // 배열을 콤마로 구분된 문자열로 변환

        const url = `${BASE_URL}/api/cards?names=${encodeURIComponent(
            cardNames
        )}`;

        const res = http.get(url, { tags: { name: 'GetCardInfo' } });

        const checkResult = check(res, {
            '[Status is 200]': (r) => r.status === 200,
            '[Response is valid JSON]': (r) => {
                try {
                    return r.body ? Array.isArray(JSON.parse(r.body)) : true;
                } catch (e) {
                    console.error(
                        `Invalid JSON response for query: ${cardNames}`
                    );
                    return false;
                }
            },
        });

        sleep(1); // 다음 요청 전에 1초 대기
    });
}

export function handleSummary(data) {
    return {
        'spring-mvc-cards-performance.html': htmlReport(data),
    };
}
