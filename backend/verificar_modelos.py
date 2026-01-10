Set-Content -Path "verificar_modelos.py" -Value @"
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

print("--------------------------------------------------")
print("🔍 CONSULTANDO O GOOGLE SOBRE SUA CONTA...")
print("--------------------------------------------------")

try:
    # Lista todos os modelos disponiveis para esta chave
    modelos = genai.list_models()
    
    encontrou = False
    for m in modelos:
        # Filtra apenas os modelos que servem para Chat (generateContent)
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ DISPONÍVEL: {m.name}")
            encontrou = True
            
    if not encontrou:
        print("⚠️ NENHUM modelo de chat encontrado. Verifique se a API Key é válida.")

except Exception as e:
    print(f"❌ ERRO AO CONECTAR: {e}")

print("--------------------------------------------------")
"@ -Encoding UTF8