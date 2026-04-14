# Base de Conhecimento - Projeto SH

## Índice

Este diretório contém toda informação permanente sobre o projeto, separada por área de conhecimento.

## Estrutura

### 📂 vision/ - Visão e Negócio
Conceitos fundamentais do modelo de negócio.

- **[VISAO.md](vision/VISAO.md)** - Missão, visão e valores
  - Modelo de negócio da agência
  - Cofundadores e estrutura
  - Produtos e público-alvo

- **[MEMBROS.md](vision/MEMBROS.md)** - Gestão de membros
  - Hierarquia (cofundadores, admins, membros)
  - Processo seletivo (3 etapas)
  - Avaliação de desempenho
  - Fila de prioridade inteligente

- **[CLIENTES.md](vision/CLIENTES.md)** - Gestão de clientes
  - Canais de captação
  - Modelo de briefing
  - Contratos e pagamentos
  - Propriedade intelectual

- **[PROCESSO.md](vision/PROCESSO.md)** - Fluxos de trabalho
  - Pipeline completo do lead à entrega
  - Alocação inteligente
  - Seguro do código
  - Gestão de carga

### 📂 technical/ - Aspectos Técnicos
Padrões e decisões técnicas.

- **[PADROES.md](technical/PADROES.md)** - Stack e convenções
  - Stack principal (Django + React + Next)
  - Banco de dados e infra
  - Convenções de código
  - Padrão de documentação

- **[DECISOES.md](technical/DECISOES.md)** - Log de decisões
  - ADRs (Architecture Decision Records)
  - Status de cada decisão
  - Contexto e justificativas

### 📂 platform/ - Especificações da Plataforma
Requisitos específicos da solução.

- **[PLATAFORMA_GESTAO.md](platform/PLATAFORMA_GESTAO.md)** - Plataforma de gestão
  - Objetivos e usuários-alvo
  - Funcionalidades principais
  - Integrações futuras
  - Resumo completo

## Relações Cruzadas

### Documentação ↔ Conhecimento

| Documentação | Conhecimento Relacionado |
|--------------|-------------------------|
| PRD.md | VISÃO.md + MEMBROS.md + CLIENTES.md |
| Spec.md | PADROES.md + DECISOES.md |
| PLATAFORMA_GESTAO.md | PROCESSO.md |

### Fluxo de Informação

```
Visão (negócio) 
    ↓
Requisitos (plataforma)
    ↓
Padrões (técnicos)
    ↓
Implementação (código)
```

## Como Usar

### Para Entender o Negócio:
1. Comece com `vision/VISAO.md`
2. Continue com `vision/MEMBROS.md`
3. Termine com `vision/PROCESSO.md`

### Para Desenvolver:
1. Veja `technical/PADROES.md` para stack
2. Consulte `technical/DECISOES.md` para decisões
3. Use `platform/PLATAFORMA_GESTAO.md` para requisitos

### Para Referência Rápida:
- **Modelo de negócio** → `vision/`
- **Padrões técnicos** → `technical/`
- **Requisitos específicos** → `platform/`

## Manutenção

- **vision/**: Atualizar quando modelo de negócio mudar
- **technical/**: Evoluir conforme stack evoluir
- **platform/**: Ajustar baseado em feedback dos usuários

---
*Gerado em: 2026-04-14*
*Conteúdo: Conhecimento permanente do projeto*