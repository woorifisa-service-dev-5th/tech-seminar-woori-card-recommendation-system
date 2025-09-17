# 🤖 AI 기반 우리카드 추천 챗봇 시스템

LLM(거대 언어 모델)과 RAG(Retrieval-Augmented Generation)를 활용한 **실시간 카드 추천 시스템**입니다.

Spring MVC(Blocking I/O)와 Spring WebFlux(Non-blocking I/O)의 성능을 비교하기 위해, 동일한 비즈니스 로직을 가진 두 종류의 백엔드 서버를 구축하였습니다.
사용자의 자연어 질문을 이해하여 가장 적합한 우리카드를 **실시간 스트리밍 방식**으로 추천합니다.

---

## 📂 프로젝트 폴더 구조

```
woori-card-recommendation-system/
├── ai/ # Python FastAPI AI 서버
├── server/
│ ├── wooricard-recommend-server-webflux/ # Spring WebFlux 비동기 서버 (MongoDB)
│ └── wooricard-recommend-server-mvc/ # Spring MVC 동기 서버 (MySQL)
└─└── wooricard-recommend-server-webflux-refactor/# Spring WebFlux refactor 서버(MongoDB)
└── client/
└── wooricard-recommend-client/ # Next.js 프론트엔드
└── wooricard-recommend-client-refactor/ # 통합api를 연결한 client
```

---

## 🏗️ 시스템 아키텍처

본 프로젝트는 성능 비교를 위해 **두 개의 독립적인 백엔드 서버**를 운영하는 **마이크로서비스 아키텍처**로 설계되었습니다.

---

-   **Next.js Client**: 사용자와의 상호작용을 담당하는 UI 계층. 백엔드 서버(MVC or WebFlux) 선택 가능
-   **Spring MVC Backend**: 동기/블로킹 방식 서버 (RestTemplate + MySQL)
-   **Spring WebFlux Backend**: 비동기/논블로킹 방식 서버 (WebClient + Reactive MongoDB)
-   **FastAPI AI Server**: LangChain RAG 체인을 실행하는 AI 전문 서버
-   **Databases**: MySQL, MongoDB, Vector Store(FAISS)

---

## 🛠️ 기술 스택

### Client (wooricard-recommend-client)

-   **Framework**: Next.js (React)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS

### AI Server (ai)

-   **Framework**: FastAPI
-   **LLM Orchestration**: LangChain
-   **AI Models**: Google Gemini / Groq Llama3
-   **Embedding**: HuggingFace (jhgan/ko-sroberta-multitask)
-   **Vector Store**: FAISS

### Backend (wooricard-recommend-server-webflux)

-   **Framework**: Spring Boot, Spring WebFlux
-   **Language**: Java 17
-   **Database**: Spring Data Reactive MongoDB
-   **HTTP Client**: WebClient

### Backend (wooricard-recommend-server-mvc)

-   **Framework**: Spring Boot, Spring MVC
-   **Language**: Java 17
-   **Database**: Spring Data JPA, MySQL
-   **HTTP Client**: RestTemplate

---

## 🏁 시작하기

### 📌 사전 준비

-   Java 17+ (JDK)
-   Node.js 18+
-   Python 3.9+
-   MySQL Server
-   MongoDB Community Server

---

### 1️⃣ AI 서버 (FastAPI) 설정

```bash
# 디렉토리 이동
cd ai

# 가상환경 생성 및 활성화, 라이브러리 설치
pip install -r requirements.txt

# .env 파일 생성 및 API 키 입력 (GEMINI_API_KEY, GROQ_API_KEY)

# Vector Store 생성 (최초 1회 실행)
python create_vectorstore.py

# AI 서버 실행
uvicorn app.main:app --reload
```

---

### 2️⃣ 백엔드 서버 설정

```bash
### (1) MVC 서버 (MySQL)

IntelliJ 등 IDE로 server/wooricard-recommend-server-mvc 프로젝트 열기

MySQL에 woori_card 데이터베이스 생성 및 쿼리 입력(.sql은 추후 추가 예정)


src/main/resources/application.yml 에 DB 연결 정보 설정

애플리케이션 실행 (기본 포트: 8081)

(2) WebFlux 서버 (MongoDB)

IntelliJ 등 IDE로 server/wooricard-recommend-server-webflux-refactor 프로젝트 열기

MongoDB에 woori_card 데이터베이스와 card 컬렉션 생성 후 데이터 입력

src/main/resources/application.yml 에 DB 연결 정보 설정

애플리케이션 실행 (기본 포트: 8082)
```

---

### 3️⃣ Client 서버 설정

```bash
# 디렉토리 이동
cd client/wooricard-recommend-client

# 패키지 설치 및 개발 서버 실행
npm install
npm run dev
```

---

### 🚀 성능 테스트

본 프로젝트의 목표는 동일한 로직을 수행하는 MVC(Blocking) 서버와 WebFlux(Non-Blocking) 서버의 로직 개선과 성능 비교입니다.
