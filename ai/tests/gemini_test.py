import google.generativeai as genai
import os
#.env 파일을 읽어오기 위한 라이브러리 import
from dotenv import load_dotenv

# .env 파일에서 환경 변수를 로드합니다.
load_dotenv()

# 이제 os.environ.get()이 .env 파일에 저장된 키를 찾을 수 있습니다.
api_key = os.environ.get("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY를 .env 파일에 설정해주세요!")

genai.configure(api_key=api_key)

# --- (이하 코드는 동일합니다) ---

model = genai.GenerativeModel('gemini-2.5-flash')
prompt = "스프링부트의 폴더 구조에대해 설명해봐"

print(f"🤖 Gemini에게 '{prompt}' 라고 물어봤어요!")
print("-" * 30)

response = model.generate_content(prompt, stream=True)

for chunk in response:
    print(chunk.text, end="", flush=True)

print("\n" + "-" * 30)
print("✅ 답변 생성이 완료되었습니다.")