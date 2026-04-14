# Processos da Agência

Fluxo de trabalho, do primeiro contato à entrega e suporte contínuo.

## Canais de Captação
- Inbound (portfólio/landing page)
- Prospecção ativa (vendas)
- Plataformas de freela (Workana, Upwork, etc.)
- Indicação/networking

## Fluxo de Projeto

### 1. Recebimento do Lead
- Lead chega por qualquer canal.
- Admin classifica: tamanho, urgência, stack necessária.

### 2. Briefing e Orçamento
- Briefing preenchido com escopo, prazo e stack (ver [CLIENTES.md](./CLIENTES.md)).
- Orçamento sob medida — cada projeto é avaliado individualmente.

### 3. Contrato
- Contrato gerado via módulo do dashboard (PDF automático).
- Membro responsável assina + cliente assina.
- Status do projeto muda para "Em andamento" após assinatura.

### 4. Alocação — Fila de Prioridade Inteligente
- Sistema define quem pega o projeto com base em:
  - Quem trabalhou por último (menos recente = mais prioridade).
  - Filtro por stack: projeto exige Django → busca primeiro da fila que domine Django.
- Veja regras completas em [MEMBROS.md](./MEMBROS.md).

### 5. Desenvolvimento
- Repositório GitHub obrigatório e vinculado ao projeto.
- Commits e PRs rastreáveis.
- Código acessível por qualquer admin ou membro designado (Seguro do Código).

### 6. Entrega
- Release/deploy conforme escopo.
- Aprovação do cliente.
- Repasse financeiro: transferência direta ao membro responsável.

### 7. Suporte e Assinatura
- Após entrega, cliente pode contratar:
  - Retainer de manutenção mensal.
  - Infra como serviço (hospedagem, domínio, SSL, monitoramento).
  - Suporte técnico + melhorias recorrentes.
- Gerenciado pelo dashboard.

## Seguro do Código
- Todo projeto DEVE ter repositório GitHub vinculado.
- Em caso de imprevisto com um membro, outro pode assumir o projeto sem perda de contexto.
- Protege a reputação do perfil principal da agência perante o cliente.

## Gestão de Carga de Trabalho
- Cada membro tem horas semanais disponíveis cadastradas.
- Dashboard calcula: horas disponíveis vs horas estimadas dos projetos ativos.
- Indicador visual (termômetro): Verde (disponível), Amarelo (quase cheio), Vermelho (sobrecarga).