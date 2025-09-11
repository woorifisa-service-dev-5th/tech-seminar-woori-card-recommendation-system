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

# --- 1. Retriever와 같이 비용이 큰 컴포넌트는 미리 한 번만 로드합니다. ---
embeddings = HuggingFaceEmbeddings(
    model_name="jhgan/ko-sroberta-multitask",
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': True}
)
vectorstore = FAISS.load_local("vector_store", embeddings, allow_dangerous_deserialization=True)
retriever = vectorstore.as_retriever()

# --- 2. 모든 로직이 포함된 강화된 프롬프트 템플릿입니다. ---
template = """
당신은 사용자의 질문 의도를 파악하고 그에 맞춰 행동하는 최상급 AI 금융 전문가입니다. 당신의 임무는 다음과 같습니다.

먼저, 사용자의 질문이 '신용카드 추천' 또는 '카드 혜택'과 관련이 있는지 판단합니다.
- 만약 질문이 관련 없다면, 다른 어떤 말도 하지 말고 반드시 다음 문장만으로 답변해야 합니다: '죄송합니다, 저는 우리카드 신용카드 추천에 대해서만 답변할 수 있습니다.'

- 만약 질문이 관련 있다면, 주어진 카드 정보(context)만을 활용하여 아래 단계에 따라 상세하고 전문적인 추천을 제공해야 합니다.
    1. 사용자의 질문에서 핵심적인 소비 패턴이나 원하는 혜택(예: 해외여행, 커피, 통신비)을 정확히 파악합니다.
    2. context에서 해당 키워드와 가장 밀접하게 관련된 최적의 카드 1~3개를 선정합니다.
    3. 선정한 카드가 왜 사용자의 요구사항에 가장 부합하는지, 카드의 특정 혜택과 사용자의 소비 패턴을 직접적으로 연결하여 논리적이고 상세하게 설명해주세요. 단순한 혜택 나열이 아닌, 사용자가 얻을 수 있는 실질적인 이득을 중심으로 설명해야 합니다. 이때, 마크다운 문법은 절대 사용하지 마세요(** **와 같은 문법)
    4. 모든 추천 설명이 끝난 후, 답변의 가장 마지막 줄에 추천한 카드의 이름을 모두 다음 형식으로 정확하게 추가해야 합니다:
    CARD_NAME::["추천 카드 이름", "추천 카드 이름", "추천 카드 이름"]

[카드 정보]
{context}

[사용자 질문]
{question}
"""
prompt = ChatPromptTemplate.from_template(template)


def get_rag_chain(model_name: str) -> Runnable:
    """
    클라이언트가 요청한 모델 이름에 따라 적절한 LLM을 선택하고,
    전체 RAG 체인을 생성하여 반환하는 함수입니다.
    """
    if "gemini" in model_name:
        print(f"INFO: Using Google Gemini model: {model_name}")
        llm = ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=os.getenv("GEMINI_API_KEY"),
            convert_system_message_to_human=True
        )
    else: # 기본적으로 Groq 또는 다른 모델로 fallback
        print(f"INFO: Using Groq Llama model: {model_name}")
        llm = ChatGroq(
            model=model_name,
            groq_api_key=os.getenv("GROQ_API_KEY")
        )

    # LangChain Expression Language (LCEL)로 RAG 체인 구성
    rag_chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    return rag_chain

print("✅ RAG components (Retriever, Embeddings) successfully initialized.")

