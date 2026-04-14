# Padrões Técnicos

Stack técnica, ferramentas e convenções do ecossistema da agência.

## Stack Principal
- **Backend**: Python + Django REST Framework
- **Frontend Admin (Dashboard)**: React + TypeScript
- **Frontend Vendas (Landing Page)**: Next.js (React + SSR/SSG)
- **Documentação**: Markdown (compatível com Obsidian e repositórios)

## Banco de Dados
[A DEFINIR: PostgreSQL? SQLite para dev?]

## Infra e Deploy
[A DEFINIR: Vercel? Railway? AWS? Docker?]

## Repositórios GitHub
- Organização GitHub da agência: [A DEFINIR nome da org]
- Todo projeto da agência fica em repo da org.
- Membros contribuem via forks ou branches (paraportfólio pessoal também).
- Veja regras de portfólio em [MEMBROS.md](./MEMBROS.md).

## Convenções de Código
[A DEFINIR: linter, formatter, commit conventions, branching model]

## Padrão de Documentação
- Diretório `info/` em cada repositório: conhecimento em Markdown.
- Seguir regras de [INSTRUCOES_IA.md](./INSTRUCOES_IA.md).
- Obsidian-friendly: links relativos, tags com `#`.

## Ferramentas de Gestão
- Dashboard interno (build próprio) como ferramenta principal.
- GitHub para versionamento e portfólio.
- Ferramenta de comunicação: Discord

## Segurança
- Tokens e credenciais NUNCA em repositórios.
- Variáveis de ambiente em `.env` (fora do versionamento).
- Acesso ao dashboard: admin full, membro limitado.