# Documentação do Projeto - Plataforma de Gestão SH

## Ponto de Entrada Para IA

Se você for usar esta documentação com uma IA, comece por [LEIA_PRIMEIRO.md](LEIA_PRIMEIRO.md).

## Índice

Este diretório contém toda a documentação organizada segundo a metodologia Spec-Driven Development (SDD).

## Estrutura

### 📂 1-research/ - Fase de Pesquisa
Documentação resultante da pesquisa inicial sobre o projeto.

- **[PRD.md](1-research/PRD.md)** - Product Requirements Document
  - Resumo do modelo de negócio
  - Requisitos funcionais e não funcionais
  - Stakeholders e user stories
  
- **[PESQUISA_PROMPTS.md](1-research/PESQUISA_PROMPTS.md)** - Pesquisa sobre prompts
  - Melhores práticas para prompts de implementação
  - Padrões identificados
  - Erros comuns a evitar
  
- **[PESQUISA_CONTEXT.md](1-research/PESQUISA_CONTEXT_MANAGEMENT.md)** - Pesquisa sobre gerenciamento de contexto
  - Estratégias para persistir estado entre conversas
  - Scripts de automação
  - Sistema de recovery

### 📂 2-specification/ - Fase de Especificação
Especificações técnicas detalhadas baseadas na pesquisa.

- **[Spec.md](2-specification/Spec.md)** - Especificação técnica completa
  - Arquitetura do sistema
  - Models e estruturas de dados
  - API endpoints
  - Stack tecnológica
  
- **[PROMPT_IMPLEMENTACAO.md](2-specification/PROMPT_IMPLEMENTACAO.md)** - Prompt principal de implementação
  - Tarefa específica a ser implementada
  - Escopo exato com checkboxes
  - Critérios de sucesso
  - Padrões e convenções

### 📂 3-guidelines/ - Fase de Diretrizes
Regras e mensagens para guiar a IA durante a implementação.

- **[REGRAS_DESENVOLVIMENTO.md](3-guidelines/REGRAS_DESENVOLVIMENTO.md)** - Regras fundamentais
  - Metodologia SDD passo a passo
  - Como evitar os 5 problemas comuns
  - Padrões de código e Git
  
- **[MENSAGEM_IA.md](3-guidelines/MENSAGEM_IA.md)** - Mensagem otimizada para IA
  - Prompt completo pronto para usar
  - Comandos de contexto
  - Fluxo completo de trabalho

## Como Usar

### Para Iniciar uma Nova Implementação:

1. **Leia a pesquisa**:
   ```bash
   cat docs/1-research/PRD.md
   ```

2. **Entenda a especificação**:
   ```bash
   cat docs/2-specification/Spec.md
   ```

3. **Use as diretrizes**:
   ```bash
   cat docs/3-guidelines/MENSAGEM_IA.md
   ```

### Método SDD Completo:

1. **Research** → Estudo em `1-research/`
2. **Spec** → Detalhes em `2-specification/`
3. **Guidelines** → Regras em `3-guidelines/`
4. **Clear** → Limpe contexto entre fases
5. **Implement** → Execute conforme prompts

## Fluxo de Trabalho

```mermaid
graph LR
    A[1-research] --> B[/clear]
    B --> C[2-specification]
    C --> D[/clear]
    D --> E[3-guidelines]
    E --> F[/clear]
    F --> G[Implementation]
```

## Manutenção

- **Pesquisa**: Atualize PRD.md se requisitos mudarem
- **Spec**: Refine Spec.md com base em feedback
- **Guidelines**: Evolua REGRAS_DESENVOLVIMENTO.md conforme aprendizados

## Conexões

- **Knowledge Base**: Ver `../project-knowledge/`
- **Implementation**: Ver `../implementation/`
- **Planning**: Ver `../planning/`

---
*Gerado em: 2026-04-14*
*Metodologia: Spec-Driven Development*