// MongoDB Shell에서 실행되는 스크립트입니다.
// 먼저 'woori_card'로 데이터 베이스를 생성하고, 'card'로 collection을 생성한 후 아래 코드를 입력합니다.

db.card.insertMany([
    {
        "id": 1,
        "card_name": "카드의정석 EVERY DISCOUNT",
        "benefits": "국내외 가맹점 0.8% 청구할인, 국내 온라인 간편결제 2% 청구할인",
        "card_url": "https://www.card-gorilla.com/card/detail/2719"
    },
    {
        "id": 2,
        "card_name": "카드의정석 EVERY MILE SKYPASS",
        "benefits": "SKYPASS 최대 2마일리지 적립, 해외이용수수료 0.3% 면제, 국내 공항라운지 동반 1인 동시 이용",
        "card_url": "https://www.card-gorilla.com/card/detail/2553"
    },
    {
        "id": 3,
        "card_name": "카드의정석 SHOPPING+",
        "benefits": "온라인 쇼핑 10% 청구할인, 백화점?대형할인점?슈퍼마켓 등 10% 청구할인",
        "card_url": "https://www.card-gorilla.com/card/detail/2687"
    },
    {
        "id": 4,
        "card_name": "카드의정석2",
        "benefits": "국내외 가맹점 1.2% 할인, 분기별 이용실적에 따라 최대 15,000원 청구할인",
        "card_url": "https://www.card-gorilla.com/card/detail/2848"
    },
    {
        "id": 5,
        "card_name": "카드의정석 TEN",
        "benefits": "커피 10% 할인, 편의점 10% 할인, 음식점/주점 1% 할인",
        "card_url": "https://www.card-gorilla.com/card/detail/2699"
    },
    {
        "id": 6,
        "card_name": "카드의정석 EVERY POINT",
        "benefits": "국내외 가맹점 0.8% 적립, 간편결제 2% 추가 적립",
        "card_url": "https://www.card-gorilla.com/card/detail/2689"
    },
    {
        "id": 7,
        "card_name": "우리카드 7CORE",
        "benefits": "온라인쇼핑, 대형마트, 커피 10% 청구 할인, 배달앱 10% 청구 할인, 교육, 병원, 주유 10% 청구 할인",
        "card_url": "https://www.card-gorilla.com/card/detail/2851"
    },
    {
        "id": 8,
        "card_name": "카드의정석 I&U+",
        "benefits": "국내가맹점 1.0~0.7% 청구할인, 주유 60~100원/L 청구할인, 대중교통 10% 청구할인",
        "card_url": "https://www.card-gorilla.com/card/detail/2688"
    },
    {
        "id": 9,
        "card_name": "DA카드의정석Ⅱ",
        "benefits": "모든가맹점 0.8% 할인, 생활업종 1.3% 할인, 국내 공항라운지 무료이용",
        "card_url": "https://www.card-gorilla.com/card/detail/2686"
    },
    {
        "id": 10,
        "card_name": "ALL 우리카드 Infinite",
        "benefits": "ALL 리워드 포인트 14,000 적립, 아코르플러스 유료 멤버십 자동가입, 3,000원 당 최대 5 ALL 리워드 포인트 적립",
        "card_url": "https://www.card-gorilla.com/card/detail/2613"
    },
    {
        "id": 11,
        "card_name": "로얄블루1000카드 [SKYPASS]",
        "benefits": "기프트바우처 100만원 상당 제공, 해외/면세점/항공사 2마일리지 적립, 본인 및 동반 1인 PP카드 제공",
        "card_url": "https://www.card-gorilla.com/card/detail/1731"
    },
    {
        "id": 12,
        "card_name": "트래블월렛 우리카드",
        "benefits": "트래블 포인트 최대 2.0% 적립, 해외 이용수수료 면제 서비스",
        "card_url": "https://www.card-gorilla.com/card/detail/2569"
    },
    {
        "id": 13,
        "card_name": "카드의정석 PREMIUM MILEAGE(SKYPASS)",
        "benefits": "1,000원당 1~2마일 적립, 국내외 공항라운지 무료이용 서비스, 연 1회 프리미엄 기프트 제공",
        "card_url": "https://www.card-gorilla.com/card/detail/92"
    },
    {
        "id": 14,
        "card_name": "ALL 우리카드 Premium",
        "benefits": "ALL 리워드 포인트 4,000 적립, ALL 회원 SILVER 등급 제공, 3,000원 당 최대 3 ALL 리워드 포인트 적립",
        "card_url": "https://www.card-gorilla.com/card/detail/2612"
    },
    {
        "id": 15,
        "card_name": "D4카드의정석Ⅱ",
        "benefits": "커피 4대 브랜드 55% 청구할인, 시내버스?지하철?택시 33% 청구할인, 편의점 11% 청구할인",
        "card_url": "https://www.card-gorilla.com/card/detail/2686"
    },
    {
        "id": 16,
        "card_name": "카드의정석 MILEAGE SKYPASS",
        "benefits": "국내외가맹점 1,000원당 1마일 적립, 해외일시불 1,000원당 1마일 추가적립, 전세계 공항라운지 무료이용 서비스",
        "card_url": "https://www.card-gorilla.com/card/detail/548"
    },
    {
        "id": 17,
        "card_name": "NU 후불하이패스",
        "benefits": "카드의정석 후불하이패스 기능, 평일 출퇴근 통행료 20~50% 할인",
        "card_url": "https://www.card-gorilla.com/card/detail/1787"
    },
    {
        "id": 18,
        "card_name": "SKT 우리카드",
        "benefits": "SKT통신기기/서비스 T라이트할부 제공, SKT통신요금 1만~2만원 청구할인, 커피전문점 20% 청구할인",
        "card_url": "https://www.card-gorilla.com/card/detail/1555"
    },
    {
        "id": 19,
        "card_name": "Diners Club POINT",
        "benefits": "국내 가맹점 1~2.3% 적립, 해외, 면세점 2% 적립, 전세계 공항라운지 연 20회 무료이용",
        "card_url": "https://www.card-gorilla.com/card/detail/2396"
    },
    {
        "id": 20,
        "card_name": "ROYAL BLUE POINT",
        "benefits": "연 1회 프리미엄 기프트 제공, 모아포인트 1% ~ 2% 적립, 국내외공항라운지 무료이용",
        "card_url": "https://www.card-gorilla.com/card/detail/1741"
    }
]);