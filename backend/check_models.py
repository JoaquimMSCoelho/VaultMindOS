import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

print(f"🔑 Testando chave: {api_key[:5]}... (Oculto)")

try:
    print("🔎 Buscando modelos disponiveis para esta chave...")
    models = genai.list_models()
    found = False
    for m in models:
        if 'generateContent' in m.supported_generation_methods:
            print(f" ✅ Disponivel: {m.name}")
            found = True
    
    if not found:
        print("❌ Nenhum modelo de texto encontrado. Verifique se a API Generative Language está ativa no Google Cloud.")

except Exception as e:
    print(f"❌ ERRO GRAVE: {e}")
