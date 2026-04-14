# Plataforma de Gestão - Software House

## Visão Geral

Plataforma de gestão interna para organizar desenvolvedores e designers autônomos em uma estrutura colaborativa de Software House.

## Documentação

Este projeto segue a metodologia **Spec-Driven Development (SDD)**.

### 📋 Rápido Acesso

| Diretório | Conteúdo | Para Quem? |
|-----------|----------|-------------|
| [`docs/`](docs/) | Metodologia SDD completa | Desenvolvedores, IA |
| [`project-knowledge/`](project-knowledge/) | Conhecimento do negócio | Todos |
| [`implementation/`](implementation/) | Scripts e estado | Implementação |
| [`planning/`](planning/) | Planejamento estratégico | Gestores |

### 🚂 Para Começar

1. **Entender o Projeto**:
   ```bash
   cat project-knowledge/vision/VISAO.md
   ```

2. **Preparar Desenvolvimento**:
   ```bash
   chmod +x implementation/scripts/save_context.py
   ```

3. **Iniciar Implementação**:
   ```bash
   cat docs/3-guidelines/MENSAGEM_IA.md
   ```

## Arquitetura

### Metodologia SDD

```
Research → Spec → Guidelines → Clear → Implement
    ↓         ↓          ↓         ↓         ↓
 docs/1-   docs/2-   docs/3-   /clear  Código
 research/ spec/    guidelines/            funcional
```

### Estrutura de Documentação

```
docs/                          # Processo SDD
├── 1-research/                # Pesquisa (PRD)
├── 2-specification/           # Especificação (Spec)
├── 3-guidelines/              # Regras (Prompts)
└── README.md                  # Índice

project-knowledge/             # Conhecimento Permanente
├── vision/                    # Negócio e Modelo
├── technical/                 # Stack e Padrões
├── platform/                  # Requisitos
└── README.md                  # Índice

implementation/                # Estado Atual
├── scripts/                   # Automação
├── state/                     # .CONTEXT.json
└── README.md                  # Guia
```

## Fluxo de Trabalho

### 1. Pesquisa (Research Phase)
```bash
# Ler requisitos do negócio
cat docs/1-research/PRD.md
```

### 2. Especificação (Spec Phase)
```bash
# Entender arquitetura
cat docs/2-specification/Spec.md
```

### 3. Diretrizes (Guidelines Phase)
```bash
# Usar regras de desenvolvimento
cat docs/3-guidelines/REGRAS_DESENVOLVIMENTO.md
```

### 4. Limpeza (/clear)
```bash
# Salvar antes de limpar
python implementation/scripts/save_context.py --action "paused"
```

### 5. Implementação (Implementation)
```bash
# Restaurar contexto
cat implementation/state/.RESTORE
```

## Stack Técnica

- **Backend**: Django REST Framework
- **Frontend**: React + TypeScript
- **Landing**: Next.js
- **Database**: PostgreSQL
- **Auth**: JWT com refresh

## Modelo de Negócio

- Membros: Parceiros autônomos (não empregados)
- House: Organiza, capta, gerencia (10% fee)
- Transparência: Dados públicos internamente
- Prioridade: Sistema inteligente de alocação

## Comandos Úteis

```bash
# Salvar progresso
python implementation/scripts/save_context.py --action "created" --path "arquivo.py" --phase "2"

# Ver estado atual
cat implementation/state/.CONTEXT.json

# Ver histórico
cat implementation/state/.DEVELOPMENT.md

# Restaurar contexto
cat implementation/state/.RESTORE
```

## MVP Features

1. Autenticação com roles (admin/member)
2. Gestão de membros
3. Controle de horas
4. Fila de prioridade
5. Dashboard básico

## Contribuição

1. Siga os padrões em [`docs/3-guidelines/REGRAS_DESENVOLVIMENTO.md`](docs/3-guidelines/REGRAS_DESENVOLVIMENTO.md)
2. Use o sistema de contexto religiosamente
3. Documente decisões em [`project-knowledge/technical/DECISOES.md`](project-knowledge/technical/DECISOES.md)
4. Nunca faça `/clear` sem salvar contexto

## Licença

Privado - Software House

---

*Gerado em: 2026-04-14*
*Metodologia: Spec-Driven Development*
*Context: Plataforma de gestão SH*