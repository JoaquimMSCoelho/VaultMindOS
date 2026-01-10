import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from services.ai_core import gerar_resposta_ia
from services.file_service import salvar_arquivo, ler_arquivo

load_dotenv()

app = Flask(__name__)
CORS(app)

# Memória RAM Global
conhecimento_atual = ""
nome_arquivo_atual = ""

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ONLINE", "file_loaded": nome_arquivo_atual}), 200

@app.route('/api/upload', methods=['POST'])
def upload_file():
    global conhecimento_atual, nome_arquivo_atual
    
    if 'file' not in request.files:
        return jsonify({"error": "Nenhum arquivo enviado"}), 400
    
    arquivo = request.files['file']
    if arquivo.filename == '':
        return jsonify({"error": "Nome inválido"}), 400

    try:
        caminho = salvar_arquivo(arquivo)
        # USA A NOVA FUNÇÃO GENÉRICA (PDF, DOCX, TXT)
        texto_extraido = ler_arquivo(caminho)
        
        conhecimento_atual = texto_extraido
        nome_arquivo_atual = arquivo.filename
        
        print(f"📂 Leitura concluída: {nome_arquivo_atual} ({len(texto_extraido)} chars)")
        
        return jsonify({
            "message": "Arquivo processado!",
            "preview": texto_extraido[:200]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    global conhecimento_atual, nome_arquivo_atual
    data = request.json
    raw_history = data.get('history', []) 
    user_msg = data.get('message', '')

    if not user_msg: return jsonify({"error": "Mensagem vazia"}), 400

    gemini_history = []
    
    # --- INJEÇÃO DE CONTEXTO ---
    if conhecimento_atual:
        # Criamos um "Sistema" autoritário
        prompt_sistema = (
            f"SISTEMA: O usuário carregou um arquivo chamado '{nome_arquivo_atual}'. "
            f"O conteúdo extraído do arquivo é:\n"
            f"--- INICIO DO ARQUIVO ---\n{conhecimento_atual}\n--- FIM DO ARQUIVO ---\n"
            f"Instrução: Responda as perguntas do usuário baseando-se EXCLUSIVAMENTE ou PRINCIPALMENTE neste conteúdo."
        )
        
        gemini_history.append({"role": "user", "parts": [prompt_sistema]})
        gemini_history.append({"role": "model", "parts": ["Entendido. Analisei o arquivo e usarei suas informações."]})

    # Adiciona o resto da conversa
    for msg in raw_history:
        if msg['sender'] == 'system': continue # Ignora mensagens de sistema do frontend
        role = 'user' if msg['sender'] == 'user' else 'model'
        gemini_history.append({"role": role, "parts": [msg['text']]})
    
    gemini_history.append({"role": 'user', "parts": [user_msg]})

    resposta_ia = gerar_resposta_ia(gemini_history)
    return jsonify({"reply": resposta_ia})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)