import os
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import Runnable, RunnablePassthrough
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

load_dotenv()

# --- 1. Retriever 로드 (기존과 동일) ---
embeddings = HuggingFaceEmbeddings(
    model_name="jhgan/ko-sroberta-multitask",
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': True}
)
vectorstore = FAISS.load_local("vector_store", embeddings, allow_dangerous_deserialization=True)
retriever = vectorstore.as_retriever()

# --- 2. [핵심] 프롬프트를 2개로 분리 ---

# 템플릿 1: 상세 설명을 생성하는 프롬프트 (스트리밍용)
prose_template = """
당신은 사용자의 질문 의도를 파악하고 그에 맞춰 행동하는 최상급 AI 금융 전문가입니다. 당신의 임무는 다음과 같습니다.

- 만약 사용자의 질문이 '신용카드 추천' 또는 '카드 혜택'과 관련 없다면, 다른 어떤 말도 하지 말고 반드시 다음 문장만으로 답변해야 합니다: '죄송합니다, 저는 우리카드 추천에 대해서만 답변할 수 있습니다.'
- 만약 질문이 관련 있다면, 주어진 카드 정보(context)만을 활용하여 아래 단계에 따라 상세하고 전문적인 추천을 제공해야 합니다.
    1. 사용자의 질문에서 핵심적인 소비 패턴이나 원하는 혜택을 정확히 파악합니다.
    2. context에서 해당 키워드와 가장 밀접하게 관련된 최적의 카드 1~3개를 선정합니다.
    3. 선정한 카드가 왜 사용자의 요구사항에 가장 부합하는지, 카드의 특정 혜택과 사용자의 소비 패턴을 직접적으로 연결하여 논리적이고 상세하게 설명해주세요. 단순한 혜택 나열이 아닌, 사용자가 얻을 수 있는 실질적인 이득을 중심으로 설명해야 합니다.
    4. 마크다운 형식인 문법은 쓰지 말아주세요.
[카드 정보]
{context}

[사용자 질문]
{question}
"""
prose_prompt = ChatPromptTemplate.from_template(prose_template)

# 템플릿 2: 추천된 카드 이름만 JSON 형식으로 추출하는 프롬프트 (Non-streaming용)
name_extractor_template = """
주어진 카드 정보(context)와 사용자 질문(question)을 바탕으로, 추천할 만한 최적의 카드 이름을 1~3개 선정하여 다음 형식으로만 응답해 주십시오. 다른 설명이나 줄바꿈은 절대 추가하지 마십시오. 만약 사용자의 질문이 '신용카드 추천' 또는 '카드 혜택'과 관련 없다면, 이 프롬프트에는 절대 답변하지 마세요.

CARD_NAME::["추천 카드 이름", "추천 카드 이름", "추천 카드 이름"]

[카드 정보]
{context}

[사용자 질문]
{question}
"""
name_extractor_prompt = ChatPromptTemplate.from_template(name_extractor_template)


def get_rag_chains(model_name: str) -> dict:
    """
    클라이언트가 요청한 모델 이름에 따라 LLM을 선택하고,
    '설명 생성 체인'과 '이름 추출 체인' 두 개를 딕셔너리로 반환합니다.
    """
    if "gemini" in model_name:
        print(f"INFO: Using Google Gemini model: {model_name}")
        llm = ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=os.getenv("GEMINI_API_KEY")
        )
    else: # 기본적으로 Groq 모델로 fallback
        print(f"INFO: Using Groq Llama model: {model_name}")
        llm = ChatGroq(
            model=model_name, # 예: llama3-8b-8192
            groq_api_key=os.getenv("GROQ_API_KEY")
        )

    # 체인 1: 설명을 스트리밍하기 위한 체인
    prose_chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prose_prompt
        | llm
        | StrOutputParser()
    )

    # 체인 2: 카드 이름만 안정적으로 추출하기 위한 체인
    name_extractor_chain = (
         {"context": retriever, "question": RunnablePassthrough()}
        | name_extractor_prompt
        | llm
        | StrOutputParser()
    )
    
    return {"prose": prose_chain, "names": name_extractor_chain}

print("✅ RAG components (Retriever, Embeddings) successfully initialized.")

