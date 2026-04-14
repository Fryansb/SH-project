# PRD - Plataforma de Gestão da Software House

**Data**: 14/04/2026
**Status**: Pesquisa Concluída

## Visão Geral

Este documento resume a pesquisa realizada sobre os requisitos da plataforma de gestão interna da agência de programadores, baseada na análise completa da documentação existente.

## Modelo de Negócio

A agência funciona como uma rede de desenvolvedores e designers autônomos que se organizam através de uma governança compartilhada. Características principais:

- Membros são parceiros autônomos (não empregados)
- Cada membro é dono do seu tempo
- A agência organiza, não emprega
- Repasse financeiro direto (a house não centraliza pagamentos)
- Membros podem trabalhar fora sem conflito de clientes

## Stack Técnica Definida

- **Backend**: Django REST Framework
- **Frontend Admin (Dashboard)**: React + TypeScript
- **Frontend Vendas (Landing Page)**: Next.js (React + SSR/SSG)
- **Banco de Dados**: A definir (PostgreSQL recomendado)
- **Infra**: A definir (Vercel/Railway/AWS)
- **Comunicação**: Discord
- **Versionamento**: GitHub (organização da agência)

## Funcionalidades Principais

### 1. Gestão de Prioridade
- Automatizar ordem de prioridade dos membros para projetos
- Critérios: tempo sem projeto + stack necessária
-Admin pode ajustar manualmente se necessário
- Gestão de carga: indicador visual de disponibilidade

### 2. Controle de Horas
- Sistema de "bater ponto" por projeto
- Dashboard com horas trabalhadas
- Relatórios automáticos

### 3. Transparência e Insights
- Insights públicos sobre a agência e projetos
- Acesso para todos os membros (menos dados sensíveis de clientes)
- Relatórios de desempenho

### 4. Documentação
- Armazenamento de documentos por projeto
- Controle de permissões
- Histórico de projetos

### 5. Gestão de Membros
- Cadastro com stacks e níveis de proficiência
- Horas semanais disponíveis
- Status na fila de prioridade
- Avaliação de desempenho por rubrica

### 6. Gestão de Projetos
- Acompanhamento do status dos projetos
- Repositório GitHub obrigatório vinculado
- Contratos gerados automaticamente

### 7. Financeiro
- Registro de 10% da house
- Distribuição para membros
- Caixa da House (fundo trancado)

## Hierarquia e Permissões

### Cofundadores (2)
- Dev + Designer
-Decisões finais
- Acesso full ao dashboard

### Administradores (até 5)
- 2 cofundadores + 3 futuros
- Escolhidos por qualificação técnica
- Acesso full ao dashboard

### Membros
- Acesso limitado (seus projetos e dados)
- Podem trabalhar fora sem conflito

## Processo Seletivo

Duração: 1 semana
1. Revisão de portfólio GitHub
2. Desafio prático (qualidade > velocidade)
3. Entrevista técnica

## Avaliação de Desempenho

Rubrica com 5 critérios:
- Qualidade de Código (30%)
- Cumprimento de Prazo (25%)
- Comunicação (20%)
- Satisfação do Cliente (15%)
- Proatividade (10%)

Consequências:
- 4.0-5.0: Membro destaque
- 3.0-3.9: Membro sólido
- 2.0-2.9: Membro em alerta
- 1.0-1.9: Membro em risco

## Fluxo de Projeto

1. Recebimento do lead
2. Briefing e orçamento
3. Contrato gerado pelo dashboard
4. Alocação por fila de prioridade
5. Desenvolvimento (repositório GitHub)
6. Entrega
7. Suporte e assinatura contínua

## Contratos e Pagamentos

### Termos de Pagamento Cliente
- 30% na assinatura
- 30% no meio do projeto
- 40% na entrega final

### Divisão Financeira
- 10% da house para custos operacionais
- 90% distribuídos aos membros do projeto
- Sobras vão para Caixa da House (acesso restrito)

## Documentação Relevante

- VISAO.md: Missão, visão, valores e modelo de negócio
- PROCESSO.md: Fluxo de trabalho completo
- PADROES.md: Stack técnica e convenções
- MEMBROS.md: Hierarquia, processo seletivo, avaliação
- CLIENTES.md: Captação, contratos, relacionamento
- DECISOES.md: Log de decisões arquiteturais

## Padrões de Código

- Repositórios na organização da agência
- Commits rastreáveis
- Código acessível por admins e membros designados
- Seguro do Código: proteção contra perda de contexto

## Propriedade Intelectual

- Cliente tem livre uso do código
- Código pertence aos devs que escreveram
- House detém conhecimento e pode reaplicar soluções

## Requisitos Não Funcionais

- Interface simples para membros
- Funcionalidades avançadas para admins
- Responsiva (sem necessidade de app móvel)
- Foco em transparência
- Segurança: never tokens em repositórios