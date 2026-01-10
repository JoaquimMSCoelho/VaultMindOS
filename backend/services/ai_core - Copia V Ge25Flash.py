import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def configurar_gemini():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("ERRO: API Key nao encontrada")
    
    genai.configure(api_key=api_key)
    # Modelo rapido e eficiente
    return genai.GenerativeModel('models/gemini-flash-latest')

def gerar_resposta_ia(historico):
    """
    Recebe uma LISTA de mensagens (historico) e gera a resposta.
    Formato esperado: [{'role': 'user', 'parts': ['texto']}, ...]
    """
    try:
        model = configurar_gemini()
        
        # Inicia um chat com o historico que o Frontend mandou
        chat = model.start_chat(history=historico)
        
        # Pega a ultima mensagem do usuario (que esta no fim da lista)
        # Nota: O SDK do Google gerencia o historico se usarmos chat.send_message
        # Mas aqui, como somos Stateless (API), precisamos reconstruir o chat a cada request.
        
        last_msg = historico[-1]['parts'][0]
        
        # Remove a ultima msg do historico 'oficial' do chat para nao duplicar no envio
        # (Truque tecnico: start_chat ja carrega o passado, send_message envia o novo)
        chat_session = model.start_chat(history=historico[:-1])
        
        response = chat_session.send_message(last_msg)
        return response.text
    except Exception as e:
        return f"Erro na Memória: {str(e)}"
