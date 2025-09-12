import logging
import asyncio
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from .schemas import ChatRequest
from .rag_chain import get_rag_chains

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = FastAPI(
    title="RAG-based LLM Streaming Server",
    description="LangChain과 FastAPI를 사용하여 카드 정보를 기반으로 추천하는 안정화된 스트리밍 서버",
    version="5.0.0"
)

async def stream_prose_then_names(chains: dict, query: str):
    """
    [안정화된 스트리밍 로직]
    1. 설명(prose) 부분은 실시간 스트리밍으로 먼저 전송합니다.
    2. 스트리밍이 끝나면, 카드 이름(names)을 별도로 조회하여 마지막에 단일 데이터로 확실하게 전송합니다.
    """
    try:
        # --- 1. 설명 스트리밍 (Prose) ---
        prose_chain = chains["prose"]
        async for chunk in prose_chain.astream(query):
            if chunk:  # 빈 데이터 조각은 보내지 않음
                yield f"data: {chunk}\n\n"
        
        logging.info(f"'{query}'에 대한 설명(prose) 스트림 완료.")

        # --- 2. 카드 이름 추출 및 전송 (CARD_NAME) ---
        name_extractor_chain = chains["names"]
        # ainvoke를 사용하여 non-streaming으로 한번에 결과를 받음
        final_chunk = await name_extractor_chain.ainvoke(query)
        
        if final_chunk:
            logging.info(f"추출된 카드 이름 데이터: {final_chunk}")
            # 약간의 딜레이 후 마지막 메시지로 전송하여 클라이언트가 확실히 받도록 보장
            yield f"data: {final_chunk}\n\n"
        
    except Exception as e:
        logging.error(f"스트리밍 처리 중 심각한 오류 발생: {e}", exc_info=True)
        error_message = f"죄송합니다, 답변 생성 중 오류가 발생했습니다: {e}"
        yield f"data: {error_message}\n\n"
    finally:
        logging.info(f"'{query}'에 대한 전체 스트림 전송 완료.")


@app.post("/chat")
async def stream_chat(request: ChatRequest):
    logging.info(f"수신된 요청: query='{request.query}', model='{request.model}'")
    try:
        # get_rag_chains는 이제 체인 딕셔너리를 반환합니다.
        chains = get_rag_chains(model_name=request.model)
        
        return StreamingResponse(
            stream_prose_then_names(chains, request.query), 
            media_type="text/event-stream"
        )
    except Exception as e:
        logging.error(f"RAG 체인 초기화 중 오류 발생: {e}", exc_info=True)
        async def error_generator():
            yield f"data: 서버에서 RAG 체인을 초기화하는 데 실패했습니다: {e}\n\n"
        return StreamingResponse(error_generator(), media_type="text/event-stream", status_code=500)

@app.get("/")
def read_root():
    return {"message": "RAG 카드 추천 서버가 실행 중입니다."}

