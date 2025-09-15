import logging
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from .schemas import ChatRequest
from .rag_chain import get_rag_chains, REFUSAL_MESSAGE # 정의한 상수 import

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = FastAPI(
    title="RAG-based LLM Streaming Server",
    description="LangChain과 FastAPI를 사용하여 카드 정보를 기반으로 추천하는 안정화된 스트리밍 서버",
    version="3.0.0" 
)

async def stream_prose_then_names(chains: dict, query: str):
    """
    [수정된 스트리밍 로직]
    1. 설명(prose)을 스트리밍하며 전체 내용을 변수에 저장합니다.
    2. 스트리밍이 끝난 후, 전체 내용이 거절 메시지가 아닐 경우에만 카드 이름(names)을 조회하여 전송합니다.
    """
    full_prose_response = ""
    prose_chain = chains["prose"]

    try:
        async for chunk in prose_chain.astream(query):
            if chunk:
                full_prose_response += chunk
                yield f"data: {chunk}\n\n"
        
        logging.info(f"'{query}'에 대한 설명(prose) 스트림 완료.")

        # --- 결과 확인 후 조건부로 카드 이름 전송 ---
        # strip()으로 앞뒤 공백을 제거하여 정확하게 비교합니다.
        if full_prose_response.strip() != REFUSAL_MESSAGE:
            name_extractor_chain = chains["names"]
            final_chunk = await name_extractor_chain.ainvoke(query)
            
            if final_chunk:
                logging.info(f"추출된 카드 이름 데이터: {final_chunk}")
                yield f"data: {final_chunk}\n\n"
        else:
            logging.info("거절 메시지가 반환되어 카드 이름 추출을 건너뜁니다.")

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
