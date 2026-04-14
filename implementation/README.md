# Implementação - Estado e Ferramentas

## Índice

Este diretório contém ferramentas de automação e estado atual da implementação.

## Estrutura

### 📂 scripts/ - Automação
Scripts para gerenciar o desenvolvimento.

- **[save_context.py](scripts/save_context.py)** - Gestão de contexto
  - Salva progresso entre conversas
  - Gera comandos de restore
  - Mantém histórico completo

#### Como Usar:
```bash
# Setup inicial
chmod +x scripts/save_context.py

# Salvar arquivo criado
python scripts/save_context.py --action "created" --path "app/models.py" --phase "2"

# Salvar teste executado
python scripts/save_context.py --action "tested" --path "backend" --phase "3"

# Pausar antes do /clear
python scripts/save_context.py --action "paused" --path "implementation"
```

### 📂 state/ - Estado da Implementação
Arquivos gerados automaticamente para manter o contexto.

- **.CONTEXT.json** - Estado completo em JSON
- **.DEVELOPMENT.md** - Log cronológico das atividades
- **.RESTORE** - Comando pronto para retomar após /clear

#### Flu

```bash
# Antes do /clear
python scripts/save_context.py --action "paused"

# Após /clear
cat state/.RESTORE
# Colar na conversa
```

## Workflow Completo

### 1. Preparação
```bash
# Criar estrutura
mkdir -p implementation/{scripts,state}

# Tornar script executável
chmod +x scripts/save_context.py
```

### 2. Durante Implementação
```bash
# A cada arquivo
python scripts/save_context.py --action "created" --path "arquivo.py" --phase "X"

# A cada teste
python scripts/save_context.py --action "tested" --path "test_suite" --phase "Y"

# Em caso de erro
python scripts/save_context.py --action "error" --error "descrição do erro"
```

### 3. Pausa e Retorno
```bash
# Antes de pausar
python scripts/save_context.py --action "paused" --path "ponto de parada"

# Após retomar (após /clear)
cat state/.RESTORE | pbcopy
# Colar na nova conversa
```

## Arquivos de Estado

### .CONTEXT.json
```json
{
  "project": "Plataforma de Gestão SH",
  "current_phase": 2,
  "progress": 22.2,
  "last_action": "created",
  "completed_files": ["app/models.py", "app/serializers.py"],
  "decisions": ["Usar JWT com refresh"],
  "test_results": {"models": "pass"},
  "next_step": "Implement views.py"
}
```

### .DEVELOPMENT.md
```markdown
# Development Log

## 2026-04-14 15:30 - Phase 1: Backend Setup
- [✓] Django project created
- [✓] Settings configured

## 2026-04-14 16:00 - Phase 2: Models
- [✓] User model created
- [✓] Member model created
- [ ] Next: Implement views
```

### .RESTORE
```markdown
# CONTEXTO DO PROJETO - RESTAURAR

## Projeto: Plataforma de Gestão SH
**Fase Atual**: 2/9 (22.2%)
**Última Ação**: created app/models.py

## Próximo Passo
Implement views.py

## Para Continuar:
"Confirmo contexto. Implementando views.py seguindo patterns."
```

## Integração com SDD

O sistema de contexto suporta perfeitamente a metodologia Spec-Driven Development:

1. **Research → Clear** - Salva pesquisa, limpa contexto
2. **Spec → Clear** - Salva spec, limpa contexto  
3. **Guidelines → Clear** - Salva diretrizes, limpa contexto
4. **Implement** - Usa restore para continuar

## Troubleshooting

### Se .CONTEXT.json corromper:
```bash
rm state/.CONTEXT.json
python scripts/save_context.py --action "reset" --path "fresh_start"
```

### Se .RESTORE não atualizar:
```bash
python scripts/save_context.py --action "force_generate"
```

## Manutenção

- **Daily**: Commit dos arquivos de state se necessário
- **Weekly**: Limpar logs antigos do .DEVELOPMENT.md
- **Monthly**: Revisar e otimizar scripts

---
*Gerado em: 2026-04-14*
*Finalidade: Gerenciar estado da implementação*