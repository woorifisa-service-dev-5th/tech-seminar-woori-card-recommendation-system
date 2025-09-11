# test_retriever.py

# rag_chain 파일에서 retriever 객체를 직접 가져옵니다.
from app.rag_chain import retriever

def test_retrieval():
    """
    Retriever가 문서를 제대로 검색하는지 테스트합니다.
    """
    print("\n--- [디버깅 모드] Retriever 테스트 시작 ---")

    test_query = "커피랑 편의점 할인을 자주 받는데 어떤 카드가 좋을까요?"
    
    retrieved_docs = retriever.invoke(test_query)
    
    print(f"\n[질문] {test_query}")
    print("\n[검색된 문서]:")
    
    if not retrieved_docs:
        print("--> 아무 문서도 찾지 못했습니다! Vector DB나 임베딩 모델을 확인해야 합니다.")
    else:
        for i, doc in enumerate(retrieved_docs):
            print(f"--- 문서 {i+1} ---")
            print(doc.page_content)
            
    print("\n--- Retriever 테스트 종료 ---\n")

if __name__ == "__main__":
    test_retrieval()