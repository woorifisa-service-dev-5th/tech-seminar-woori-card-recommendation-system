# test_full_chain.py

# rag_chain 파일에서 rag_chain 객체를 직접 가져옵니다.
from app.rag_chain import rag_chain

def test_chain_streaming():
    """
    RAG 체인 전체가 스트리밍 응답을 제대로 생성하는지 테스트합니다.
    """
    print("\n--- [디버깅 모드] RAG 체인 전체 테스트 시작 ---")

    test_query = "커피랑 편의점 할인을 자주 받는데 어떤 카드가 좋을까요?"
    print(f"\n[질문] {test_query}\n")
    print("[LLM 응답 스트림]:")

    # rag_chain의 stream 메서드를 호출하고 결과를 스트리밍으로 출력
    full_response = ""
    # stream()은 제너레이터를 반환하므로 for 루프로 순회
    for chunk in rag_chain.stream(test_query):
        print(chunk, end="", flush=True) # 각 토큰을 줄바꿈 없이 바로 출력
        full_response += chunk

    if not full_response:
        print("\n--> LLM으로부터 아무런 응답이 없습니다. API 키 또는 네트워크 연결을 확인하세요.")

    print("\n\n--- RAG 체인 전체 테스트 종료 ---\n")

if __name__ == "__main__":
    test_chain_streaming()