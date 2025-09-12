from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    """클라이언트로부터 받을 요청 DTO"""
    query: str = Field(..., description="사용자의 카드 추천 질문", example="온라인 쇼핑에 좋은 카드 찾아줘")
    # LLM 모델을 선택할 수 있도록 model 필드를 다시 추가합니다.
    model: str = Field("gemini-2.5-flash", description="사용할 LLM 모델 (예: gemini-2.5-flash, llama-3.1-8b-instant)")

