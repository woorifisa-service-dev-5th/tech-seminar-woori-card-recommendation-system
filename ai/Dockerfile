
FROM python:3.10-slim AS builder

WORKDIR /app

# 빌드용 의존성 설치
COPY requirements-build.txt .
RUN pip install --no-cache-dir -r requirements-build.txt

COPY ./create_vector_db.py .
COPY ./data ./data

# /root/.cache/huggingface 폴더에 저장(캐싱)
RUN python create_vector_db.py


FROM python:3.10-slim

WORKDIR /app

# 런타임용 의존성만 설치 (훨씬 가벼움)
COPY requirements-run.txt .
RUN pip install --no-cache-dir -r requirements-run.txt

# 애플리케이션 코드 복사
COPY ./app ./app

# 빌더에서 생성된 Vector DB만 복사
COPY --from=builder /app/vector_store ./vector_store

# 2빌더에서 다운로드한 임베딩 모델 캐시만 복사
COPY --from=builder /root/.cache/huggingface /root/.cache/huggingface

# HuggingFace가 캐시된 모델을 찾을 수 있도록 경로를 환경변수로 지정
ENV HF_HOME=/root/.cache/huggingface

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]