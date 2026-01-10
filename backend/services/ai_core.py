import os
import google.generativeai as genai
from dotenv import load_dotenv
import time
import random

load_dotenv()

def configurar_gemini():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("ERRO: API Key não encontrada.")
    
    genai.configure(api_key=api_key)
    
    # TÁTICA 1: Usar o modelo 'Experimental'.
    # Geralmente tem menos tráfego que o 'Lite' ou 'Pro'.
    return genai.GenerativeModel('models/gemini-2.0-flash-exp')

def gerar_resposta_ia(historico):
    model = configurar_gemini()
    
    # Prepara o histórico
    chat_history = []
    last_user_msg = ""
    
    for msg in historico:
        role = 'user' if msg['role'] == 'user' else 'model'
        text = msg['parts'][0]
        if msg == historico[-1] and role == 'user':
            last_user_msg = text
            continue
        chat_history.append({"role": role, "parts": [text]})
    
    if not last_user_msg and historico:
        last_user_msg = historico[-1]['parts'][0]

    # TÁTICA 2: RETENTATIVA AUTOMÁTICA (Backoff)
    # Tenta 3 vezes antes de desistir
    max_tentativas = 3
    
    for tentativa in range(max_tentativas):
        try:
            chat = model.start_chat(history=chat_history)
            response = chat.send_message(last_user_msg)
            return response.text

        except Exception as e:
            erro = str(e)
            
            # Se for erro de Cota (429) e não for a última tentativa...
            if "429" in erro and tentativa < max_tentativas - 1:
                tempo_espera = (tentativa + 1) * 5 + random.uniform(0, 2) # Espera 5s, 10s...
                print(f"⚠️ Tráfego alto. Tentativa {tentativa+1}/{max_tentativas}. Esperando {tempo_espera:.1f}s...")
                time.sleep(tempo_espera)
                continue # Tenta de novo loop
            
            # Se falhar todas ou for outro erro:
            if "429" in erro:
                return "⚠️ **SISTEMA OCUPADO:** O servidor da IA está superlotado no momento. Tente novamente em 1 minuto."
            elif "404" in erro:
                 return f"⚠️ **ERRO DE MODELO:** O modelo experimental não está acessível. Detalhe: {erro}"
            else:
                return f"⚠️ **ERRO TÉCNICO:** {erro}"