#!/usr/bin/env python3
"""
Script para gerar documentação de bibliotecas usando IA
Uso: python scripts/generate_lib_docs.py --lib "PostgreSQL" [--all]
"""

import argparse
import sys
from datetime import datetime
from pathlib import Path

PROMPT_BASE = """
# Gerar Documentação Técnica - {lib_name}

## Contexto
Você é especialista técnico com experiência profunda em stacks web modernas. Siga as instruções em docs/prompts/Gerar_Doc_Bibliotecas.md para criar documentação completa da biblioteca {lib_name}.

## Requisitos Específicos:
- Criar arquivo: project-knowledge/technical/libraries/{lib_file_name}.md
- Seguir template exato das libs existentes no projeto
- Customizar para stack Django + React + TypeScript da Software House
- Incluir exemplos funcionais e testes
- Focar em patterns práticos para implementação imediata

## Bibliotecas de Referência:
- Ver django-rest-framework.md para padrão backend
- Ver react-material-ui.md para padrão frontend
- Ver jwt-authentication.md para padrão de autenticação

## Entregar:
1. Documentação markdown completa
2. Código exemplo funcional
3. Integração com stack atual
4. Tests obrigatórios
5. Links oficiais

## Comece com:
"Vou gerar documentação completa para {lib_name} seguindo padrão técnico do projeto SH. Primeiro, vou analisar a biblioteca..."
"""

LIBRARY_LIST = [
    ("PostgreSQL", "postgresql"),
    ("Docker", "docker"),
    ("Redux Toolkit", "redux-toolkit"),
    ("Jest", "jest"),
    ("Vercel", "vercel"),
    ("GitHub Actions", "github-actions"),
    ("ESLint", "eslint"),
]

def generate_prompt_for_lib(lib_name, lib_file_name):
    """Gera prompt específico para uma biblioteca"""
    return PROMPT_BASE.format(
        lib_name=lib_name,
        lib_file_name=lib_file_name
    )

def show_main_command():
    """Mostra comando principal"""
    print("🚀 Comando Principal para Copiar:")
    print("=" * 50)
    print(generate_prompt_for_lib("[NOME_DA_BIBLIOTECA]", "[nome-arquivo]"))
    print("=" * 50)

def show_lib_commands():
    """Mostra comandos específicos por biblioteca"""
    print("\n📚 Comandos por Biblioteca:")
    for lib_name, lib_file in LIBRARY_LIST:
        print(f"\n### {lib_name}:")
        print("Copiar e colar:")
        print(generate_prompt_for_lib(lib_name, lib_file))
        print("-" * 50)

def show_all_command():
    """Mostra comando para gerar todas"""
    all_command = f"""
# Gerar Documentação - Múltiplas Bibliotecas

## Tarefa
Gerar documentação completa para TODAS as bibliotecas da lista abaixo: {', '.join([lib for lib, _ in LIBRARY_LIST])}

## Processo:
1. Gerar doc da primeira biblioteca
2. Aguardar confirmação
3. Continuar para próxima
4. Até completar todas

## Arquivos:
- project-knowledge/technical/libraries/[nome].md para cada uma

## Comece:
"Vou gerar documentação para PostgreSQL primeiro..."
"""
    print("\n📋 Comando Para Gerar TODAS:")
    print(all_command)

def main():
    parser = argparse.ArgumentParser(description="Gerar prompts para documentação de bibliotecas")
    parser.add_argument("--lib", help="Nome específico da biblioteca")
    parser.add_argument("--main", action="store_true", help="Mostrar comando principal")
    parser.add_argument("--list", action="store_true", help="Listar bibliotecas disponíveis")
    parser.add_argument("--all", action="store_true", help="Mostrar comando para todas")
    
    args = parser.parse_args()
    
    if args.main:
        show_main_command()
    elif args.list:
        print("📚 Bibliotecas disponíveis:")
        for lib_name, lib_file in LIBRARY_LIST:
            print(f"  - {lib_name} -> {lib_file}.md")
    elif args.all:
        show_all_command()
        show_lib_commands()
    elif args.lib:
        # Encontrar nome do arquivo
        lib_file = None
        for name, file in LIBRARY_LIST:
            if name.lower() == args.lib.lower():
                lib_file = file
                break
        
        if not lib_file:
            print(f"❌ Biblioteca não encontrada. Use --list para ver disponíveis.")
            sys.exit(1)
        
        print(f"📝 Prompt para {args.lib}:")
        print("-" * 50)
        print(generate_prompt_for_lib(args.lib, lib_file))
    else:
        print("Use --main para comando principal ou --lib <nome> para biblioteca específica.")

if __name__ == "__main__":
    main()