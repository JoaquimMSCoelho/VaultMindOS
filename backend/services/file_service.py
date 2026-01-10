import os
from pypdf import PdfReader
from docx import Document

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def salvar_arquivo(arquivo):
    caminho_completo = os.path.join(UPLOAD_FOLDER, arquivo.filename)
    arquivo.save(caminho_completo)
    return caminho_completo

def ler_arquivo(caminho_arquivo):
    """Identifica a extensão e usa a ferramenta certa"""
    extensao = os.path.splitext(caminho_arquivo)[1].lower()
    
    try:
        if extensao == '.pdf':
            return _ler_pdf(caminho_arquivo)
        elif extensao == '.docx':
            return _ler_docx(caminho_arquivo)
        elif extensao == '.txt' or extensao == '.md':
            return _ler_txt(caminho_arquivo)
        else:
            return "Formato não suportado ainda. Envie PDF, DOCX ou TXT."
    except Exception as e:
        return f"Erro ao ler arquivo: {str(e)}"

# --- Funções Internas ---

def _ler_pdf(path):
    texto = ""
    reader = PdfReader(path)
    for page in reader.pages:
        texto += page.extract_text() + "\n"
    return texto

def _ler_docx(path):
    doc = Document(path)
    texto = ""
    for para in doc.paragraphs:
        texto += para.text + "\n"
    return texto

def _ler_txt(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()