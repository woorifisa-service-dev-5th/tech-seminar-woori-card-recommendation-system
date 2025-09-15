import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import http from 'k6/http';
import { check, sleep, group } from 'k6';

// --- 테스트 환경 설정 ---
export const options = {
    scenarios: {
        // 'ramping-vus' 시나리오: 점진적으로 사용자를 늘리고 줄이며 부하를 조절합니다.
        contacts: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '20s', target: 15 }, // 1단계: 20초 동안 가상 사용자를 15명까지 늘립니다.
                { duration: '30s', target: 15 }, // 2단계: 15명의 사용자로 30초 동안 부하를 유지합니다.
                { duration: '10s', target: 0 },  // 3단계: 10초 동안 사용자를 0명으로 줄입니다.
            ],
            gracefulRampDown: '10s',
        },
    },
    // 테스트 성공/실패 기준 정의
    thresholds: {
        'http_req_failed': ['rate<0.01'],      // http 에러 발생률이 1% 미만
        'http_req_duration': ['p(95)<800'],   // 요청의 95%는 800ms 안에 처리
        'checks': ['rate>0.99'],              // check 성공률이 99% 이상
    },
};

// 환경 변수(BASE_URL)를 통해 테스트할 서버를 선택합니다.
const BASE_URL = 'http://localhost:8080';

// --- 테스트에 사용할 다양한 카드 이름 쿼리 ---
// 제공된 SQL 데이터를 기반으로 현실적인 쿼리 시나리오 구성
const queryScenarios = [
    // 1. 단일 카드 조회 (가장 빈번한 케이스)
    ['카드의정석 TEN'],
    ['트래블월렛 우리카드'],
    ['D4카드의정석Ⅱ'],
    ['SKT 우리카드'],

    // 2. 인기 조합 비교 (2개 카드)
    ['카드의정석 EVERY MILE SKYPASS', '카드의정석 EVERY POINT'], // 마일리지 vs 포인트
    ['카드의정석 SHOPPING+', '우리카드 7CORE'], // 쇼핑 vs 생활
    ['카드의정석 TEN', 'D4카드의정석Ⅱ'], // 커피/편의점 혜택 비교

    // 3. 다중 카드 비교 (3개 이상)
    ['카드의정석 EVERY DISCOUNT', '카드의정석2', 'DA카드의정석Ⅱ'], // 할인 카드 비교
    ['로얄블루1000카드 [SKYPASS]', '카드의정석 PREMIUM MILEAGE(SKYPASS)', 'ALL 우리카드 Infinite'], // 프리미엄/마일리지 카드 비교

    // 4. 잘못된 요청 (Edge Case)
    ['없는카드이름'],
    ['카드의정석 TEN', '잘못된카드이름'],
];


// --- 테스트 시나리오 ---
export default function () {
    // group을 사용하면 테스트 결과를 깔끔하게 분리해서 볼 수 있습니다.
    group('API Endpoint: /api/cards (Request-Response)', function () {
        
        // 매 반복마다 queryScenarios에서 무작위로 하나를 선택
        const randomQuery = queryScenarios[Math.floor(Math.random() * queryScenarios.length)];
        const cardNames = randomQuery.join(','); // 배열을 콤마로 구분된 문자열로 변환

        const url = `${BASE_URL}/api/cards?names=${encodeURIComponent(cardNames)}`;

        const res = http.get(url, { tags: { name: 'GetCardInfo' } });

        const checkResult = check(res, {
            '[Status is 200]': (r) => r.status === 200,
            '[Response is valid JSON]': (r) => {
                try {
                    // 응답이 비어있을 수도 있으므로, 비어있지 않은 경우에만 JSON 파싱 시도
                    return r.body ? Array.isArray(JSON.parse(r.body)) : true;
                } catch (e) {
                    console.error(`Invalid JSON response for query: ${cardNames}`);
                    return false;
                }
            },
        });
        
        sleep(1); // 다음 요청 전에 1초 대기
    });
}

// --- 테스트 결과 리포트 생성 ---
export function handleSummary(data) {
    return {
        "spring-mvc-cards-performance.html": htmlReport(data),
    };
}