# Vercel Deployment
## Versão: Vercel Platform (uso com Next.js 13+)
## Por que usamos:
- Deploy instantâneo e previews por branch (Pull Request) para frontend Next.js.
- Integração nativa com Next.js: builds otimizadas, Edge Functions e Image Optimization.
- Fluxo simples de CI/CD com GitHub/GitLab/Bitbucket e configuração via vercel.json ou dashboard.

---

## Setup Básico
### Pré-requisitos
- Conta Vercel e projeto conectado ao repositório Git (GitHub recomendado).
- Vercel CLI para deploys manuais: npm i -g vercel
- Next.js app com package.json scripts: build e start

### Passos rápidos (deploy inicial)
1. Conectar repositório no dashboard Vercel (Import Project).
2. Definir Build Command: npm run build
3. Output Directory: .next (para Next.js é automático)
4. Adicionar Environment Variables (ver seção abaixo).
5. Deployar; cada PR gera Preview Deployment.

### Variáveis de ambiente
- NEXT_PUBLIC_API_URL (visível no client) — apontar para API Django (ex.: https://api.staging.example.com)
- API_INTERNAL_URL (server-only) — usado por getServerSideProps/Edge Functions (não prefixar NEXT_PUBLIC)
- SECRET_KEY, DATABASE_URL, SENTRY_DSN (use secrets/variables do Vercel, não commit)

Adicionar via CLI (nota: vercel CLI pedirá ambiente e valor; para automatizar em CI use `vercel env add` com stdin ou a API):

```bash
# adiciona variável para production
vercel env add NEXT_PUBLIC_API_URL production
# adiciona para preview
vercel env add NEXT_PUBLIC_API_URL preview
# adicionar variável server-only (prod)
vercel env add API_INTERNAL_URL production
```

Dica: prefira configurar variáveis no dashboard para valores sensíveis e use Vercel Secrets/API para automação. Lembre-se que variáveis com prefixo NEXT_PUBLIC serão expostas ao bundle do cliente.

---

Observação: preferir rewrites para encaminhar chamadas de /api/* ao backend Django hospedado externamente (evita CORS no client).

### vercel.json (exemplo com rewrites e headers)

```json
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/next" }
  ],
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://api.example.com/:path*" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [ { "key": "X-Frame-Options", "value": "DENY" } ]
    }
  ]
}
```

Observação: preferir rewrites para encaminhar chamadas de /api/* ao backend Django hospedado externamente (evita CORS no client).

---

## API/Components (principais conceitos)
- Build & Output: Next.js build gera .next; Vercel fornece handler para SSR/SSG/ISR.
- Edge Functions / Serverless Functions: funções rápidas para lógica próxima ao usuário (limitações de tempo/memória).
- Incremental Static Regeneration (ISR): revalidate em páginas estáticas com getStaticProps({ revalidate }).
- Redirects/Rewrites: use vercel.json para mapear rotas, proteger endpoints e expor API proxy.
- Image Optimization: configurar domains em next.config.js (images.domains).

Exemplo next.config.js:

```js
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.example.com', port: '' }
    ]
  },
  experimental: { serverActions: true },
};
```

---

## Integração Stack SH (Next.js frontend + Django backend)
- Deploy do frontend em Vercel; Django permanece em infra dedicada (Heroku, Render, AWS, DigitalOcean, etc.).
- Usar rewrites para encaminhar /api a endpoints Django ou configurar API URL no client para apontar diretamente ao backend.
- Autenticação: preferir httpOnly cookies para segurança; configurar domínio e sameSite entre frontend e backend.
- Assets/uploads: Vercel tem filesystem efêmero; usar S3/Cloud Storage para uploads e servir via CDN.
- Background jobs: não executar em Vercel; rodar Celery/Workers em servidores dedicados.

Padrão recomendado:
- Frontend: Next.js em Vercel
- Backend: Django em infra com DB e workers (Postgres, Redis)
- Storage: S3 (uploads) + CloudFront/other CDN
- Auth: httpOnly cookies com rota de login no backend; frontend faz fetch para /api/login que é reescrito para backend

---

## Não Fazer ❌
- Usar Vercel para processos de longa duração (workers/cron jobs).
- Armazenar uploads ou dados persistentes no filesystem do projeto (é efêmero).
- Colocar segredos em repositório ou expor NEXT_PUBLIC variables para dados sensíveis.
- Depender de build-time secrets para runtime (use env vars runtime e Vercel Secrets onde possível).
- Executar heavy DB migrations via Edge Functions ou dentro do deploy (use jobs fora da Vercel).

---

## Fazer Sempre ✅
- Separar responsabilidades: frontend no Vercel, backend em serviço apropriado.
- Proteger secrets com Vercel Environment Variables / Secrets.
- Usar rewrites para evitar CORS e manter a API base consistente.
- Testar Preview Deploys (cada PR) com smoke tests automatizados.
- Configurar Healthchecks e monitoramento (Sentry, Uptime checks).
- Configurar domínios custom e forçar HTTPS (Vercel cuida de TLS automático).
- Usar image optimization e cache headers para performance.

---

## Tests Obrigatórios (templates)
### 1) Smoke test após deploy (CI job)
```bash
# example: curl health endpoint
curl -fS --retry 3 https://www.example.com/health || exit 1
```

### 2) Preview deploy validation (GitHub Actions step)
- Após PR build, executar script que verifica:
  - status 200 em rota principal
  - presença de env var critical (p. ex. NEXT_PUBLIC_API_URL) via endpoint /_vercel/env (ou endpoint custom)

Exemplo simple-node script (ci/check-deploy.js):
```js
import fetch from 'node-fetch';
const url = process.env.PREVIEW_URL;
const res = await fetch(url + '/health');
if (!res.ok) throw new Error('Health check failed');
console.log('OK');
```

### 3) Build locally (replicar ambiente Vercel)
```bash
# Simular build que Vercel fará
npm ci
npm run build
# rodar um servidor local para conferir
npx vercel dev
```

---

## Links
- Vercel docs: https://vercel.com/docs
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs
- vercel.json reference: https://vercel.com/docs/configuration
- Environment variables: https://vercel.com/docs/concepts/projects/environment-variables
- Rewrites and Redirects: https://vercel.com/docs/configuration#project/rewrites

---

Notas finais:
- Para a Stack SH, usar Vercel exclusivamente para o frontend garante rapidez em deploys e Pré-views em PRs; manter backend Django em infra própria e usar rewrites/env vars para integrar de forma segura e performática. Testar preview deployments via CI para garantir qualidade antes do merge.
