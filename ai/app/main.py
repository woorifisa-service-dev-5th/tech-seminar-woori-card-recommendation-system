from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from .schemas import ChatRequest
# rag_chain 객체 대신 get_rag_chain 함수를 import 합니다.
from .rag_chain import get_rag_chain

app = FastAPI(
    title="RAG-based LLM Streaming Server with Dynamic Models",
    description="LangChain과 FastAPI를 사용하여 카드 정보를 기반으로 추천하고, 요청에 따라 LLM을 동적으로 선택하여 스트리밍하는 서버",
    version="3.0.0"
)

@app.post("/chat")
async def stream_chat(request: ChatRequest):
    """
    요청받은 모델로 RAG 체인을 동적으로 생성하고,
    비동기 스트리밍으로 결과를 응답합니다.
    """
    try:
        # 1. 요청된 모델 이름으로 RAG 체인을 가져옵니다.
        rag_chain = get_rag_chain(model_name=request.model)
        
        # 2. 해당 체인을 사용하여 비동기 스트림을 생성합니다.
        async_generator = rag_chain.astream(request.query)

        return StreamingResponse(async_generator, media_type="text/event-stream")
    except Exception as e:
        print(f"Error occurred: {e}")
        # 오류 발생 시 클라이언트에게 오류 메시지를 스트리밍할 수도 있습니다.
        async def error_generator():
            yield f"서버에서 오류가 발생했습니다: {e}"
        return StreamingResponse(error_generator(), media_type="text/event-stream", status_code=500)


@app.get("/")
def read_root():
    return {"message": "RAG 카드 추천 서버가 실행 중입니다. /chat 엔드포인트로 POST 요청을 보내주세요."}