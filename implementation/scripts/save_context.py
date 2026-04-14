#!/usr/bin/env python3
"""
Script para salvar contexto de desenvolvimento entre conversas com IA
Uso: python scripts/save_context.py --action "created" --path "accounts/models.py" --phase "2"
"""

import json
import sys
from datetime import datetime
from pathlib import Path

CONTEXT_FILE = Path.home() / "SH" / "implementation" / "state" / ".CONTEXT.json"
DEVLOG_FILE = Path.home() / "SH" / "implementation" / "state" / ".DEVELOPMENT.md"
RESTORE_FILE = Path.home() / "SH" / "implementation" / "state" / ".RESTORE"

def load_context():
    """Carrega contexto existente ou cria novo"""
    if CONTEXT_FILE.exists():
        with open(CONTEXT_FILE, 'r') as f:
            return json.load(f)
    
    # Contexto inicial padrão
    return {
        "project": "Plataforma de Gestão SH",
        "current_phase": 1,
        "total_phases": 9,
        "progress": 0,
        "last_action": "",
        "last_action_time": "",
        "next_step": "Setup backend Django",
        "completed_files": [],
        "decisions": [],
        "errors": [],
        "test_results": {},
        "pending_tests": [],
        "history": []
    }

def save_context(action, path="", phase="", error=""):
    """Salva estado atual do desenvolvimento"""
    ctx = load_context()
    
    # Atualizar campos principais
    ctx["last_action"] = action
    ctx["last_action_time"] = datetime.now().isoformat()
    
    # Adicionar arquivo aos completos se for criação/moficação
    if path and action in ["created", "modified"]:
        if path not in ctx["completed_files"]:
            ctx["completed_files"].append(path)
    
    # Atualizar fase se especificada
    if phase:
        ctx["current_phase"] = int(phase)
        ctx["progress"] = round((int(phase) / ctx["total_phases"]) * 100, 1)
    
    # Adicionar erro se especificado
    if error:
        ctx["errors"].append({
            "error": error,
            "time": datetime.now().isoformat(),
            "phase": ctx["current_phase"]
        })
    
    # Adicionar ao histórico
    ctx["history"].append({
        "action": action,
        "path": path,
        "phase": ctx["current_phase"],
        "time": datetime.now().isoformat()
    })
    
    # Salvar arquivo
    CONTEXT_FILE.parent.mkdir(exist_ok=True)
    with open(CONTEXT_FILE, 'w') as f:
        json.dump(ctx, f, indent=2)
    
    # Atualizar log
    update_devlog(action, path, phase)
    
    # Gerar arquivo de restore
    generate_restore(ctx)
    
    print(f"✓ Contexto salvo: {action} {path}")

def update_devlog(action, path, phase):
    """Atualiza log de desenvolvimento em markdown"""
    today = datetime.now().strftime("%Y-%m-%d")
    time = datetime.now().strftime("%H:%M")
    
    log_entry = f"\n## {today} {time} - Phase {phase}: {action}\n"
    if path:
        log_entry += f"- {path}\n"
    
    # Criar arquivo se não existe
    if not DEVLOG_FILE.exists():
        with open(DEVLOG_FILE, 'w') as f:
            f.write("# Development Log\n\n")
    
    # Adicionar entrada
    with open(DEVLOG_FILE, 'a') as f:
        f.write(log_entry)

def generate_restore(ctx):
    """Gera comando de restore em uma linha"""
    files_list = "\n".join([f"- {f}" for f in ctx["completed_files"][-10:]])  # Últimos 10 arquivos
    decisions_list = "\n".join([f"- {d}" for d in ctx["decisions"][-5:]])  # Últimas 5 decisões
    errors_list = "\n".join([f"- {e['error']}" for e in ctx["errors"][-3:]])  # Últimos 3 erros
    
    restore_content = f"""# CONTEXTO DO PROJETO - RESTAURAR

## Projeto: {ctx['project']}
**Fase Atual**: {ctx['current_phase']}/{ctx['total_phases']} ({ctx['progress']}%)
**Última Ação**: {ctx['last_action']} ({ctx['last_action_time']})

## Próximo Passo
{ctx['next_step']}

## Arquivos Criados (recentes):
{files_list if files_list else "- Nenhum arquivo ainda"}

## Decisões Importantes:
{decisions_list if decisions_list else "- Nenhuma decisão registrada"}

## Erros Encontrados:
{errors_list if errors_list else "- Nenhum erro ainda"}

## Status dos Testes:
{format_test_status(ctx['test_results'])}

## Para Continuar:
"Confirmo contexto. Implementando {ctx['next_step']} seguindo patterns estabelecidos."

---
*Gerado em: {datetime.now().isoformat()}*
"""
    
    with open(RESTORE_FILE, 'w') as f:
        f.write(restore_content)

def format_test_status(test_results):
    """Formata status dos testes para display"""
    if not test_results:
        return "- Nenhum teste executado ainda"
    
    status = []
    for test, result in test_results.items():
        icon = "✓" if result == "pass" else "✗" if result == "fail" else "⏳"
        status.append(f"- {icon} {test}: {result}")
    
    return "\n".join(status)

def main():
    """Função principal parse de args"""
    if len(sys.argv) < 2:
        print("Uso: python save_context.py --action <action> [--path <path>] [--phase <phase>] [--error <error>]")
        print("\nActions comuns:")
        print("  created      - Arquivo criado")
        print("  modified     - Arquivo modificado")
        print("  tested       - Teste executado")
        print("  phase_change - Mudou de fase")
        print("  error        - Ocorreu um erro")
        sys.exit(1)
    
    # Parse arguments
    action = ""
    path = ""
    phase = ""
    error = ""
    
    for i, arg in enumerate(sys.argv):
        if arg == "--action" and i+1 < len(sys.argv):
            action = sys.argv[i+1]
        elif arg == "--path" and i+1 < len(sys.argv):
            path = sys.argv[i+1]
        elif arg == "--phase" and i+1 < len(sys.argv):
            phase = sys.argv[i+1]
        elif arg == "--error" and i+1 < len(sys.argv):
            error = sys.argv[i+1]
    
    if not action:
        print("Erro: --action é obrigatório")
        sys.exit(1)
    
    # Salvar contexto
    save_context(action, path, phase, error)

if __name__ == "__main__":
    main()