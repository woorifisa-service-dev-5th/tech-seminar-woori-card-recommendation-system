import os
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_groq import ChatGroq
# DeprecationWarning을 해결하기 위해 최신 라이브러리를 사용합니다.
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# .env 파일에서 환경 변수 로드
load_dotenv()

# 1. LLM 및 임베딩 모델 초기화
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    groq_api_key=os.getenv("GROQ_API_KEY")
)

# 생성 스크립트와 동일한 임베딩 모델 사용
embeddings = HuggingFaceEmbeddings(
    model_name="jhgan/ko-sroberta-multitask",
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': True}
)

# 2. 로컬에 저장된 Vector DB 로드
vectorstore = FAISS.load_local("vector_store", embeddings, allow_dangerous_deserialization=True)
retriever = vectorstore.as_retriever()

# 3. RAG 프롬프트 템플릿 정의 (모든 로직이 포함된 강화된 프롬프트)
template = """
당신은 사용자의 질문 의도를 파악하고 그에 맞춰 행동하는 최상급 AI 카드 금융 전문가입니다. 당신의 임무는 다음과 같습니다.

먼저, 사용자의 질문이 '카드 추천' 또는 '카드 혜택'과 관련이 있는지 판단합니다.
사용자의 상황과 맥락을 파악하여, 어떤 카드의 어떤 혜택이 정말 필요할 지 판단합니다.
- 만약 질문이 관련 없다면, 다른 어떤 말도 하지 말고 반드시 다음 문장만으로 답변해야 합니다: '죄송합니다, 저는 신용카드 추천에 대해서만 답변할 수 있습니다.'

- 만약 질문이 관련 있다면, 주어진 카드 정보(context)만을 활용하여 아래 단계에 따라 상세하고 전문적인 추천을 제공해야 합니다.
    1. 사용자의 질문에서 핵심적인 소비 패턴이나 원하는 혜택(예: 해외여행, 커피, 통신비)을 정확히 파악합니다.
    2. context에서 해당 키워드와 가장 밀접하게 관련된 최적의 카드 1~3개를 선정합니다.
    3. 선정한 카드가 왜 사용자의 요구사항에 가장 부합하는지, 카드의 특정 혜택과 사용자의 소비 및 생활 패턴을 직접적으로 연결하여 논리적이고 상세하게 설명해주세요. 단순한 혜택 나열이 아닌, 사용자가 얻을 수 있는 실질적인 이득을 중심으로 설명해야 합니다.
    4. (중요!)모든 추천 설명 이전, 답변 첫줄에 추천한 카드의 id를 모두 다음 형식으로 정확하게 추가해야 합니다:
    CARD_ID::[id, id, id]

[카드 정보]
{context}

[사용자 질문]
{question}
"""
prompt = ChatPromptTemplate.from_template(template)

# 4. LangChain Expression Language (LCEL)로 RAG 체인 구성 (기존 구조 유지)
rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

print("RAG 체인이 성공적으로 초기화되었습니다. (강화된 프롬프트 버전)")
