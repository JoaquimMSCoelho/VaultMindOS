# services/ai_core.py

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def configurar_gemini():
    """Configura a conexao com a Google AI"""
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("ERRO: API Key do Google nao encontrada no .env")
    
    genai.configure(api_key=api_key)
    
    # MUDANÇA CRÍTICA: 
    # Saímos do 'latest' (que está apontando para o 2.5 limitado)
    # E fixamos no 'gemini-1.5-flash' que tem cota alta (1500 req/dia)
    return genai.GenerativeModel('models/gemini-1.5-flash')

def gerar_resposta_ia(historico):
    """Recebe o histórico formatado e gera resposta"""
    try:
        model = configurar_gemini()
        
        # O SDK do Google espera histórico no formato chat
        # Precisamos separar a ultima mensagem para usar no send_message
        
        # Se for apenas uma mensagem (sem historico anterior)
        if len(historico) == 1:
            chat = model.start_chat(history=[])
            response = chat.send_message(historico[0]['parts'][0])
            return response.text

        # Se tiver histórico
        msgs_anteriores = historico[:-1]
        ultima_msg = historico[-1]['parts'][0]
        
        chat = model.start_chat(history=msgs_anteriores)
        response = chat.send_message(ultima_msg)
        return response.text

    except Exception as e:
        return f"Erro na IA: {str(e)}"