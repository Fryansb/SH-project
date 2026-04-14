# Membros

Hierarquia, processo seletivo, onboarding, offboarding, portfólio e regras de administração.

## Hierarquia

### Cofundadores (2)
- Você (Dev) + Designer.
- Decisões finais sobre direção, clientes e membros.
- Acesso full ao dashboard.

### Administradores (até 5 no total)
- 2 cofundadores + 3 futuros admins.
- Os 3 extras serão escolhidos por qualificação técnica quando o time crescer.
- Quanto melhor programador/designer, maior a chance de ocupar o cargo.
- Acesso full ao dashboard.

### Membros
- Parceiros autônomos, não empregados.
- Acesso limitado ao dashboard (só seus projetos e dados).
- Podem pegar projetos fora da agência, desde que sem conflito de cliente.

## Processo Seletivo
Duração total: **1 semana**.

### Etapa 1 — Revisão de Portfólio
- Analisar repositórios GitHub do candidato.
- Avaliar: qualidade de código, variedade de projetos, atividade recente.

### Etapa 2 — Desafio Prático
- Projeto pequeno simulado (ex: CRUD simples, landing page, API).
- Prazo definido pelo desafio (geralmente 2-3 dias).
- Critério principal: **qualidade acima de velocidade**.
- Código limpo, organizado, funcional vale mais que entregar rápido.

### Etapa 3 — Entrevista Técnica
- Discussão sobre o desafio entregue.
- Perguntas sobre stack, experiência, resolução de problemas.
- Avaliar comunicação e alinhamento com a house.

### Critérios de Avaliação
| Critério | Peso |
|---|---|
| Qualidade de código | Alto |
| Organização e estrutura | Médio |
| Comunicação e clareza | Médio |
| Variedade de stack | Baixo |

### Quem Avalia
- Membro admin ou cofundador responsável pela vaga.

## Onboarding de Membro
[A DEFINIR: passo a passo — sugerido:]
1. Aprovação no processo seletivo.
2. Cadastro no dashboard (stack, nível, horas semanais disponíveis, GitHub).
3. Assinatura de acordo de parceria (por projeto).
4. Inclusão na fila de prioridade.
5. Acesso ao repositório da org no GitHub.

## Offboarding de Membro
- Membro decide se sai e deixa os projetos, ou se continua nos projetos em andamento.
- Acesso ao dashboard revogado após saída completa.
- Projetos que ficaram são redistribuídos pela fila (Seguro do Código — ver [PROCESSO.md](./PROCESSO.md)).
- [A DEFINIR: período de transição? aviso prévio?]

## Consequências por Falha em Projeto
- A house absorve o prejuízo financeiro do projeto que dá errado.
- Após cada falha, é feita uma avaliação para identificar a causa.
- Se a causa for negligência ou falha de um membro, ele terá consequências (a definir: advertência, suspensão da fila, remoção).
- [A DEFINIR: graus de consequência, processo de apuração]

## Avaliação de Desempenho
Avaliação feita pelo **admin responsável** pelo projeto ao final de cada entrega.

### Modelo de Avaliação (Rubrica)

Cada critério recebe nota de 1 a 5:

| Critério | Descrição | Peso |
|---|---|---|
| Qualidade de Código | Código limpo, organizado, sem bugs recorrentes | 30% |
| Cumprimento de Prazo | Entrega no prazo combinado ou com aviso prévio | 25% |
| Comunicação | Responde no Discord, avisa problemas, atualiza status | 20% |
| Satisfação do Cliente | Feedback do cliente sobre a experiência (quando disponível) | 15% |
| Proatividade | Sugere melhorias, documenta, ajuda outros membros | 10% |

### Nota Final
- **4.0-5.0**: Membro destaque — prioridade na fila, elegível para admin no futuro.
- **3.0-3.9**: Membro sólido — mantém posição normal.
- **2.0-2.9**: Membro em alerta — conversa com admin, pode cair na fila.
- **1.0-1.9**: Membro em risco — advertência formal. Repetindo = remoção.

### Consequências por Falha
- 1ª vez: Advertência + conversa com admin.
- 2ª vez: Suspensão da fila de prioridade por 2 semanas.
- 3ª vez: Remoção da house.

### Periodicidade
- Avaliação ao final de cada projeto.
- Revisão geral trimestral pelo admin (média das notas).
- [A DEFINIR: dashboard gera relatório automático?]

## Fila de Prioridade Inteligente
- Quem trabalhou por último tem menos prioridade.
- Filtro por stack: se o projeto exige Django, pula para o primeiro da fila que domina Django.
- Gestão de carga: se membro está Vermelho (sobrecarga), é ignorado na fila até liberar.

## Portfólio e GitHub
- Projetos da agência são desenvolvidos na org do GitHub da agência.
- Membros que contribuem recebem os commits no perfil pessoal também.
- Portfólio final fica na conta da empresa (org).
- Clientes são captados pelo portfólio dos membros com mais projetos.
- Ver [PADROES.md](./PADROES.md) para convenções de repo.

## Liberdade de Trabalho
- Membros podem pegar projetos freelancer por fora.
- Regra: sem conflito de cliente (não pegar projeto de um cliente da agência por conta própria).
- [A DEFINIR: como monitorar conflitos? declaração de conflito no dashboard?]

## Divisão de Lucro
- A house cobra **10% de cada projeto** para se manter (infra, ferramentas, custos operacionais).
- O restante (90%) é dividido entre os membros que trabalharam no projeto, conforme definido no contrato por projeto.
- Sobras após pagar todos os custos da house vão para o **Caixa da House** — fundo trancado para reserva/reinvestimento.
- O dashboard deve registrar: valor do projeto, 10% house, splits dos membros, e saldo do Caixa.
- Acesso ao Caixa: somente cofundadores/admins. Membros não sacam do Caixa.

## Gestão de Talentos (Dashboard)
- Cadastro de membros com:
  - Nome, contato, GitHub
  - Stacks e níveis de proficiência
  - Horas semanais disponíveis
  - Projetos ativos e histórico
  - Status na fila de prioridade