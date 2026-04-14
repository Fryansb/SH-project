# Mensagem Otimizada para IA - Com Sistema de Contexto

## Mensagem Principal:

```
# Implementação MVP - Plataforma de Gestão SH

## Setup Inicial
Antes de começar, execute:
```bash
chmod +x scripts/save_context.py
```

## Contexto
Implementando plataforma de gestão para Software House usando metodologia SDD. Fases de pesquisa e espec concluídas.

## Arquivos de Referência
- Leia: docs/1-research/PRD.md
- Leia: docs/2-specification/Spec.md  
- Leia: docs/3-guidelines/REGRAS_DESENVOLVIMENTO.md
- Execute: cat docs/2-specification/PROMPT_IMPLEMENTACAO.md
- **IMPORTANTE**: Leia ANTES de implementar:
  - project-knowledge/technical/libraries/django-rest-framework.md
  - project-knowledge/technical/libraries/jwt-authentication.md
  - project-knowledge/technical/libraries/react-material-ui.md
  - E outras bibliotecas relevantes

## Sistema de Contexto
IMPORTANTE: Use o sistema de contexto para não perder progresso:

### A cada arquivo criado:
```bash
python scripts/save_context.py --action "created" --path "caminho/do/arquivo.py" --phase "2"
```

### Antes de usar /clear:
```bash
python scripts/save_context.py --action "paused" --path "implementation"
```

### Para restaurar após /clear:
```bash
cat /home/ryan/SH/.RESTORE
```

## Execução
1. Confirme leitura dos arquivos
2. Leia TODAS as docs de bibliotecas relevantes
3. Execute Phase 1 do prompt
4. Use comandos de contexto a cada passo
5. Não avance sem confirmação

## Comece com:
"Li toda documentação. Entendido sistema de contexto. Iniciando Phase 1: Setup do backend Django conforme PROMPT_IMPLEMENTACAO.md"
```

## Mensagem de Restore (para colar após /clear):

```
# RESTAURAR CONTEXTO

## Projeto: Plataforma de Gestão SH
**Fase Atual**: 1/9 (11.1%)
**Última Ação**: paused (2026-04-14T17:30:00)

## Próximo Passo
Setup backend Django

## Arquivos Criados (recentes):
- Nenhum arquivo ainda

## Decisões Importantes:
- Nenhuma decisão registrada

## Erros Encontrados:
- Nenhum erro ainda

## Status dos Testes:
- Nenhum teste executado ainda

## Para Continuar:
"Confirmo contexto. Implementando Setup backend Django seguindo patterns estabelecidos."
```

## Quick Commands:

### 1. Iniciar Nova Implementação:
```bash
chmod +x scripts/save_context.py
```
Mandar mensagem principal para IA

### 2. Pausar para usar /clear:
```bash
python scripts/save_context.py --action "paused" --path "implementation"
```
Usar /clear

### 3. Restaurar Contexto:
```bash
cat implementation/state/.RESTORE | pbcopy
# Colar na nova conversa
```

### 4. Registrar Progresso:
```bash
# Arquivo criado
python scripts/save_context.py --action "created" --path "app/models.py" --phase "2"

# Teste executado
python scripts/save_context.py --action "tested" --path "backend" --phase "3"

# Erro encontrado
python scripts/save_context.py --action "error" --error "ValidationError: missing field"
```

## Vantagens:

1. **Contexto Persistente**: Não perde nada com /clear
2. **Histórico Completo**: Todo progresso registrado
3. **Recuperação Rápida**: 1 comando para restaurar
4. **Debugging**: Histórico de erros e soluções
5. **Flexibilidade**: Pode parar e retomar quando quiser

## Workflow Completo:

1. **Setup**: Executar chmod no script
2. **Iniciar**: Mandar mensagem completa
3. **Progresso**: Salvar a cada arquivo/teste
4. **Pausa**: Salvar antes do /clear
5. **Restore**: Colar conteúdo do .RESTORE
6. **Continuar**: Confirmar e prosseguir

Este sistema garante que você possa usar /clear para otimizar o contexto sem perder nenhuma informação importante sobre o progresso do desenvolvimento.