import subprocess
import sys
import os

# CABEÇALHO PADRÃO PGT-01
# PROJETO: VAULTMIND OS (ENTERPRISE EDITION)
# ARQUITETURA: PYTHON SCRIPT
# GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)

def print_header(text):
    print(f"\n\033[1;36m{text}\033[0m")

def check_command(command):
    try:
        cmd_run = command
        if command == "npm":
            cmd_run = "npm.cmd" 
            
        if command == "python":
            cmd_list = ["python", "--version"]
        else:
            cmd_list = [cmd_run, "--version"]
            
        result = subprocess.run(cmd_list, capture_output=True, text=True, check=True)
        version = result.stdout.strip()
        print(f"[OK] {command.upper()}: Detectado ({version})")
        return True
    except Exception as e:
        print(f"\033[1;31m[ERRO] {command.upper()} nao encontrado. ({e})\033[0m")
        return False

def check_file(filepath):
    if os.path.exists(filepath):
        print(f"[OK] Arquivo: {filepath}")
        return True
    else:
        print(f"\033[1;31m[ERRO] Arquivo Ausente: {filepath}\033[0m")
        return False

def main():
    print("\033[1;34m---------------------------------------------------------")
    print(" SVA v1.1 - VAULTMIND OS | VERIFICACAO DE AMBIENTE")
    print(" Governanca: Extremo Zero")
    print("---------------------------------------------------------\033[0m")
    
    all_systems_go = True

    print_header("1. CHECKLIST DE FERRAMENTAS BASE")
    tools = ["python", "node", "git", "npm"]
    for tool in tools:
        if not check_command(tool):
            all_systems_go = False

    print_header("2. INTEGRIDADE DOS ARQUIVOS (Restaurados)")
    critical_files = [
        "package.json",
        "next.config.ts",
        "src/app/layout.tsx",
        "src/app/page.tsx",
        "src/middleware.ts"
    ]
    
    for f in critical_files:
        if not check_file(f):
            all_systems_go = False

    print("\n---------------------------------------------------------")
    if all_systems_go:
        print("\033[1;32m✅ STATUS VERDE: AMBIENTE RESTAURADO E SEGURO.\033[0m")
        sys.exit(0)
    else:
        print("\033[1;31m🛑 STATUS VERMELHO: FALHA NA RESTAURAÇÃO.\033[0m")
        sys.exit(1)

if __name__ == "__main__":
    main()
