#!/bin/bash
# Script de setup para o projeto SH
# Uso: ./implementation/scripts/setup.sh

echo "🚀 Setup do Projeto SH - Plataforma de Gestão"

# Criar estrutura se não existir
mkdir -p implementation/state

# Tornar scripts executáveis
echo "📋 Preparando scripts..."
chmod +x implementation/scripts/save_context.py
chmod +x implementation/scripts/setup.sh

# Criar estado inicial se não existir
if [ ! -f implementation/state/.CONTEXT.json ]; then
    echo "📊 Criando estado inicial..."
    python implementation/scripts/save_context.py --action "setup" --path "project_initialized" --phase "0"
fi

# Verificar se está tudo ok
echo "✅ Verificando estrutura..."

files=(
    "docs/1-research/PRD.md"
    "docs/2-specification/Spec.md"
    "docs/3-guidelines/REGRAS_DESENVOLVIMENTO.md"
    "docs/3-guidelines/MENSAGEM_IA.md"
    "implementation/scripts/save_context.py"
    "implementation/state/.CONTEXT.json"
    "project-knowledge/vision/VISAO.md"
)

missing=()
for file in "${files[@]}"; do
    if [ ! -f "$file" ]; then
        missing+=("$file")
    fi
done

if [ ${#missing[@]} -eq 0 ]; then
    echo "✅ Todos os arquivos essenciais estão presentes!"
    echo ""
    echo "🎯 Próximos Passos:"
    echo "1. Leia a visão do projeto:"
    echo "   cat project-knowledge/vision/VISAO.md"
    echo ""
    echo "2. Entenda a metodologia:"
    echo "   cat docs/README.md"
    echo ""
    echo "3. Inicie a implementação:"
    echo "   cat docs/3-guidelines/MENSAGEM_IA.md"
    echo ""
    echo "💡 Lembrete: Sempre salve o contexto antes de usar /clear!"
else
    echo "❌ Arquivos faltando:"
    printf '%s\n' "${missing[@]}"
    echo ""
    echo "🔧 Execute novamente ou verifique a instalação."
fi

# Symlink para scripts se não existir
if [ ! -L scripts ]; then
    echo "🔗 Criando symlink para scripts..."
    ln -s implementation/scripts scripts
fi

echo ""
echo "📊 Status atual:"
if [ -f implementation/state/.CONTEXT.json ]; then
    python -c "import json; ctx=json.load(open('implementation/state/.CONTEXT.json')); print(f'Fase: {ctx.get(\"current_phase\", \"?\")}/{ctx.get(\"total_phases\", \"?\")}'); print(f'Progresso: {ctx.get(\"progress\", 0)}%'); print(f'Última ação: {ctx.get(\"last_action\", \"Nenhuma\")}')"
fi

echo ""
echo "🎉 Setup concluído!"