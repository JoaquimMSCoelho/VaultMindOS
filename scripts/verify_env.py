import sys
import subprocess
import re
import shutil
import platform

# --- CONFIGURAÇÃO DE GOVERNANÇA (CORES E ESTILO) ---
class Style:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_banner():
    print(f"{Style.HEADER}{Style.BOLD}")
    print("=" * 70)
    print("   🛡️  CyberTreinaIA - VERIFICADOR DE AMBIENTE (SVA) v3.1 (NATIVE)")
    print("   PROJETO: VAULTMINDOS | GOVERNANÇA: ATIVA")
    print("=" * 70)
    print(f"{Style.ENDC}")

def normalize_version(v_str):
    """
    Converte string de versão '1.2.3' para tupla (1, 2, 3) usando apenas RegEx nativo.
    Remove sufixos não numéricos para comparação segura.
    """
    try:
        # Pega apenas números e pontos
        clean_v = re.sub(r'[^0-9.]', '', v_str)
        # Divide por ponto e converte para inteiro
        return tuple(map(int, clean_v.split('.')))
    except ValueError:
        return (0, 0, 0)

def check_version(current, required):
    """Compara versões semânticas sem dependências externas."""
    return normalize_version(current) >= normalize_version(required)

def get_binary_version(command, regex_pattern):
    """Executa um comando e extrai a versão usando Regex."""
    try:
        result = subprocess.run(
            command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True
        )
        if result.returncode != 0:
            return None
        
        output = result.stdout.strip()
        # Se stdout estiver vazio, tenta stderr (algumas ferramentas jogam versão no stderr)
        if not output:
            output = result.stderr.strip()

        match = re.search(regex_pattern, output)
        if match:
            return match.group(1)
        return None
    except Exception:
        return None

def audit_tool(name, check_cmd, regex, min_version=None):
    """Audita uma ferramenta específica."""
    print(f"Auditando {name.ljust(20, '.')} ", end="")
    
    # 1. Verifica se existe no PATH
    cmd_base = check_cmd.split()[0]
    if not shutil.which(cmd_base):
        print(f"{Style.FAIL}[CRÍTICO - NÃO ENCONTRADO]{Style.ENDC}")
        return False

    # 2. Verifica Versão
    detected_ver = get_binary_version(check_cmd, regex)
    
    if not detected_ver:
        print(f"{Style.FAIL}[ERRO DE LEITURA]{Style.ENDC}")
        return False

    # 3. Valida Versão Mínima
    if min_version:
        if check_version(detected_ver, min_version):
            print(f"{Style.GREEN}[OK] v{detected_ver}{Style.ENDC}")
            return True
        else:
            print(f"{Style.FAIL}[OBSOLETO]{Style.ENDC} (Atual: {detected_ver} | Req: {min_version}+)")
            return False
    else:
        print(f"{Style.GREEN}[OK] v{detected_ver}{Style.ENDC}")
        return True

def main():
    print_banner()
    
    # Sistema Operacional
    print(f"Sistema Operacional: {Style.CYAN}{platform.system()} {platform.release()}{Style.ENDC}\n")
    print(f"{Style.BOLD}--- 1. ARSENAL TECNOLÓGICO (VALIDAÇÃO DE BINÁRIOS) ---{Style.ENDC}")

    global_status = True

    # 1. PYTHON (3.10+)
    py_ver = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    print(f"Auditando Python................ ", end="")
    if sys.version_info >= (3, 10):
        print(f"{Style.GREEN}[OK] v{py_ver}{Style.ENDC}")
    else:
        print(f"{Style.FAIL}[ERRO] v{py_ver} (Requer 3.10+){Style.ENDC}")
        global_status = False

    # 2. NODE.JS (18+)
    if not audit_tool("Node.js", "node --version", r"v(\d+\.\d+\.\d+)", "18.0.0"):
        global_status = False

    # 3. NPM
    if not audit_tool("Npm", "npm --version", r"(\d+\.\d+\.\d+)", None):
        global_status = False

    # 4. GIT
    if not audit_tool("Git", "git --version", r"version (\d+\.\d+\.\d+)", None):
        global_status = False

    # 5. DOCKER (CRÍTICO)
    print(f"Auditando Docker................ ", end="")
    docker_ver = get_binary_version("docker --version", r"version (\d+\.\d+\.\d+)")
    
    if docker_ver:
        # Tenta verificar se o Docker está rodando (Engine)
        try:
            subprocess.run("docker ps", stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, shell=True)
            print(f"{Style.GREEN}[OK] v{docker_ver} (Engine Ativo){Style.ENDC}")
        except subprocess.CalledProcessError:
            print(f"{Style.WARNING}[ALERTA]{Style.ENDC} Instalado v{docker_ver}, mas o Docker Desktop parece fechado.")
            print(f"    {Style.CYAN}Ação:{Style.ENDC} Inicie o Docker Desktop para habilitar containers.")
            # Alerta, mas não bloqueia hard se instalado
    else:
        print(f"{Style.FAIL}[NÃO INSTALADO]{Style.ENDC}")
        print(f"    {Style.CYAN}Ação:{Style.ENDC} Instale Docker Desktop imediatamente.")
        global_status = False

    print("\n" + "="*70)
    if global_status:
        print(f"{Style.GREEN}✅ STATUS VERDE: AMBIENTE VALIDADO. AUTORIZADO A PROSSEGUIR.{Style.ENDC}")
        sys.exit(0)
    else:
        print(f"{Style.FAIL}🛑 STATUS VERMELHO: AMBIENTE CORROMPIDO OU INCOMPLETO.{Style.ENDC}")
        print("   AÇÃO NECESSÁRIA: Corrija as dependências listadas acima.")
        sys.exit(1)

if __name__ == "__main__":
    main()