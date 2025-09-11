# create_vector_db.py

import pandas as pd
from langchain_community.document_loaders import DataFrameLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

def create_and_save_vector_db():
    """
    CSV 파일에서 카드 데이터를 로드하여 FAISS Vector DB를 생성하고 로컬에 저장합니다.
    """
    # 1. 임베딩 모델 설정
    print("임베딩 모델을 로드합니다... (ko-sroberta-multitask)")
    model_name = "jhgan/ko-sroberta-multitask"
    model_kwargs = {'device': 'cpu'}
    encode_kwargs = {'normalize_embeddings': True}
    embeddings = HuggingFaceEmbeddings(
        model_name=model_name,
        model_kwargs=model_kwargs,
        encode_kwargs=encode_kwargs
    )

    # 2. 데이터 로드
    print("data/card_data.csv 파일에서 데이터를 로드합니다...")
    df = pd.read_csv("data/card_data.csv")
    loader = DataFrameLoader(df, page_content_column="content")
    documents = loader.load()
    print(f"총 {len(documents)}개의 카드 정보를 문서로 변환했습니다.")

    # 3. Vector DB 생성 및 저장
    print("FAISS Vector DB를 생성합니다...")
    db = FAISS.from_documents(documents, embeddings)
    
    db.save_local("vector_store")
    print("✅ Vector DB 생성 완료! 'vector_store' 폴더에 저장되었습니다.")

if __name__ == "__main__":
    create_and_save_vector_db()