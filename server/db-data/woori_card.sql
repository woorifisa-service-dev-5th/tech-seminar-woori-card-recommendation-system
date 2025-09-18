CREATE DATABASE IF NOT EXISTS woori_card;

USE woori_card;

-- card 테이블 생성
CREATE TABLE IF NOT EXISTS card (
                                    id INT PRIMARY KEY,
                                    card_name VARCHAR(255),
    benefits TEXT,
    card_url VARCHAR(255)
    );

INSERT INTO card (id, card_name, benefits, card_url) VALUES
                                                         (1, '카드의정석 EVERY DISCOUNT', '국내외 가맹점 0.8% 청구할인, 국내 온라인 간편결제 2% 청구할인', 'https://www.card-gorilla.com/card/detail/2719'),
                                                         (2, '카드의정석 EVERY MILE SKYPASS', 'SKYPASS 최대 2마일리지 적립, 해외이용수수료 0.3% 면제, 국내 공항라운지 동반 1인 동시 이용', 'https://www.card-gorilla.com/card/detail/2553'),
                                                         (3, '카드의정석 SHOPPING+', '온라인 쇼핑 10% 청구할인, 백화점?대형할인점?슈퍼마켓 등 10% 청구할인', 'https://www.card-gorilla.com/card/detail/2687'),
                                                         (4, '카드의정석2', '국내외 가맹점 1.2% 할인, 분기별 이용실적에 따라 최대 15,000원 청구할인', 'https://www.card-gorilla.com/card/detail/2848'),
                                                         (5, '카드의정석 TEN', '커피 10% 할인, 편의점 10% 할인, 음식점/주점 1% 할인', 'https://www.card-gorilla.com/card/detail/2699'),
                                                         (6, '카드의정석 EVERY POINT', '국내외 가맹점 0.8% 적립, 간편결제 2% 추가 적립', 'https://www.card-gorilla.com/card/detail/2689'),
                                                         (7, '우리카드 7CORE', '온라인쇼핑, 대형마트, 커피 10% 청구 할인, 배달앱 10% 청구 할인, 교육, 병원, 주유 10% 청구 할인', 'https://www.card-gorilla.com/card/detail/2851'),
                                                         (8, '카드의정석 I&U+', '국내가맹점 1.0~0.7% 청구할인, 주유 60~100원/L 청구할인, 대중교통 10% 청구할인', 'https://www.card-gorilla.com/card/detail/2688'),
                                                         (9, 'DA카드의정석Ⅱ', '모든가맹점 0.8% 할인, 생활업종 1.3% 할인, 국내 공항라운지 무료이용', 'https://www.card-gorilla.com/card/detail/2686'),
                                                         (10, 'ALL 우리카드 Infinite', 'ALL 리워드 포인트 14,000 적립, 아코르플러스 유료 멤버십 자동가입, 3,000원 당 최대 5 ALL 리워드 포인트 적립', 'https://www.card-gorilla.com/card/detail/2613'),
                                                         (11, '로얄블루1000카드 [SKYPASS]', '기프트바우처 100만원 상당 제공, 해외/면세점/항공사 2마일리지 적립, 본인 및 동반 1인 PP카드 제공', 'https://www.card-gorilla.com/card/detail/1731'),
                                                         (12, '트래블월렛 우리카드', '트래블 포인트 최대 2.0% 적립, 해외 이용수수료 면제 서비스', 'https://www.card-gorilla.com/card/detail/2569'),
                                                         (13, '카드의정석 PREMIUM MILEAGE(SKYPASS)', '1,000원당 1~2마일 적립, 국내외 공항라운지 무료이용 서비스, 연 1회 프리미엄 기프트 제공', 'https://www.card-gorilla.com/card/detail/92'),
                                                         (14, 'ALL 우리카드 Premium', 'ALL 리워드 포인트 4,000 적립, ALL 회원 SILVER 등급 제공, 3,000원 당 최대 3 ALL 리워드 포인트 적립', 'https://www.card-gorilla.com/card/detail/2612'),
                                                         (15, 'D4카드의정석Ⅱ', '커피 4대 브랜드 55% 청구할인, 시내버스?지하철?택시 33% 청구할인, 편의점 11% 청구할인', 'https://www.card-gorilla.com/card/detail/2686'),
                                                         (16, '카드의정석 MILEAGE SKYPASS', '국내외가맹점 1,000원당 1마일 적립, 해외일시불 1,000원당 1마일 추가적립, 전세계 공항라운지 무료이용 서비스', 'https://www.card-gorilla.com/card/detail/548'),
                                                         (17, 'NU 후불하이패스', '카드의정석 후불하이패스 기능, 평일 출퇴근 통행료 20~50% 할인', 'https://www.card-gorilla.com/card/detail/1787'),
                                                         (18, 'SKT 우리카드', 'SKT통신기기/서비스 T라이트할부 제공, SKT통신요금 1만~2만원 청구할인, 커피전문점 20% 청구할인', 'https://www.card-gorilla.com/card/detail/1555'),
                                                         (19, 'Diners Club POINT', '국내 가맹점 1~2.3% 적립, 해외, 면세점 2% 적립, 전세계 공항라운지 연 20회 무료이용', 'https://www.card-gorilla.com/card/detail/2396'),
                                                         (20, 'ROYAL BLUE POINT', '연 1회 프리미엄 기프트 제공, 모아포인트 1% ~ 2% 적립, 국내외공항라운지 무료이용', 'https://www.card-gorilla.com/card/detail/1741');