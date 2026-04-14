# GitHub Actions
## Versão: GitHub Actions (2026)
## Por que usamos:
- Automatizar testes, lint, builds e deploys para garantir qualidade e velocidade.
- Runs isolados por PR/branch com previews e gates para proteger main.
- Integração com security scans (CodeQL), dependabot e CI/CD para a Stack SH.

---

## Setup Básico
- Criar diretório .github/workflows/ com workflows YAML.
- Armazenar secrets no GitHub repository Settings > Secrets (ex.: DATABASE_URL, DOCKERHUB_TOKEN, VERCEL_TOKEN, SSH_PRIVATE_KEY).
- Usar actions oficiais e caches para acelerar builds.

Exemplo de patterns de workflow:
1. backend-tests.yml — roda pytest, linters, e reporta coverage
2. frontend-ci.yml — roda npm ci, lint, tests e build
3. docker-build-push.yml — builda imagens multi-stage e publica registry
4. deploy.yml — deploy controlado (aplicar migrations com cuidado, deploy canary)
5. codeql-analysis.yml — security scanning

---

## API/Components (workflows exemplares)

### 1) backend-tests.yml (Django)

```yaml
name: Backend CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: sh_db
          POSTGRES_USER: sh_user
          POSTGRES_PASSWORD: sh_pass
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U sh_user -d sh_db" --health-interval 10s --health-timeout 5s --health-retries 5
    env:
      DATABASE_URL: postgres://sh_user:sh_pass@127.0.0.1:5432/sh_db
    steps:
      - uses: actions/checkout@v4
      - name: Cache Python & Poetry
        uses: actions/cache@v4
        with:
          path: |
            ~/.cache/pip
            ~/.cache/pypoetry
          key: ${{ runner.os }}-poetry-${{ hashFiles('**/poetry.lock') }}
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'
      - name: Install dependencies
        run: |
          pip install --upgrade pip
          pip install poetry
          poetry install --no-interaction --no-ansi
      - name: Run linters
        run: poetry run flake8
      - name: Run migrations
        run: |
          python manage.py migrate --noinput
      - name: Run tests
        run: pytest -q --maxfail=1
      - name: Upload coverage
        if: success()
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage.xml
```

Notas: usar services.postgres em CI para testar migrations/queries; proteger secrets e não rodar migrate em produção nesta job.

---

### 2) frontend-ci.yml (React + TypeScript)

```yaml
name: Frontend CI
on: [push, pull_request]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Cache node modules
        uses: actions/cache@v4
        with:
          path: |
            ~/.npm
            ~/.cache
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Run tests
        run: npm run test -- --coverage --watchAll=false
      - name: Build
        run: npm run build
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: frontend-build
          path: build
```

---

### 3) docker-build-push.yml (multi-arch optional)

```yaml
name: Build and Push Docker
on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v2
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      - name: Login to registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
          file: ./Dockerfile
          platforms: linux/amd64,linux/arm64
```

---

### 4) deploy.yml (deploy controlado + migrate)

```yaml
name: Deploy
on:
  push:
    branches: [ main ]

concurrency:
  group: deploy-main
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Download backend image artifact
        uses: actions/download-artifact@v4
        with:
          name: backend-image
      - name: Run DB migrations (remote)
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          SSH_HOST: ${{ secrets.SSH_HOST }}
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh -o StrictHostKeyChecking=no ubuntu@$SSH_HOST 'cd /srv/app && ./deploy/run-migrations.sh'
      - name: Trigger deploy (example: call deployment API)
        run: curl -X POST https://deploy.example.com/trigger -H "Authorization: Bearer ${{ secrets.DEPLOY_TOKEN }}"
```

Aviso: executar migrations via SSH/remote script garante controle; evitar executar diretamente na job sem locks — usar feature-flag/canary quando necessário.

---

### 5) codeql-analysis.yml (security)

```yaml
name: "CodeQL"
on:
  push:
    branches: [ main ]
  pull_request:

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: 'python, javascript'
      - name: Autobuild
        uses: github/codeql-action/autobuild@v2
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
```

---

## Integração Stack SH
- Coordenar jobs: rodar backend-tests antes do deploy job; bloquear merges quando jobs falham.
- Artefatos: compartilhar build artifacts entre jobs (ex: frontend build para deploy), usando actions/upload-artifact e download-artifact.
- Secrets e env: usar repository secrets e organization secrets; limitar acesso por necessidade.
- Migration strategy: criar job separado que executa migrations com retries e check para evitar race conditions em deploys paralelos.

---

## Não Fazer ❌
- Colocar credenciais em texto plano no YAML.
- Rodar migrations automaticamente em todos os runners sem locks (race conditions).
- Tornar workflow monolítico: preferir jobs pequenos e focados com dependencies claras.
- Ignorar caching: sempre cachear dependências para acelerar CI.

---

## Fazer Sempre ✅
- Usar cache para pip/npm (actions/cache) e cache de build outputs.
- Usar matrix builds quando apropriado (testar múltiplas versões de Python/Node).
- Falhar rápido (fast-fail) e reportar logs detalhados em builds falhos.
- Publicar e armazenar artifacts relevantes (coverage, build outputs) para análise.
- Executar security scans periodicamente (CodeQL, dependabot alerts).
- Usar concurrency/group para evitar deploys concorrentes perigosos.

---

## Tests Obrigatórios (templates)
- job: run pytest with --junitxml for test reports and upload as artifact
- job: run jest with coverage and fail if coverage below threshold
- job: run flake8/isort/black as a check-step

Exemplo: falhar build se coverage < 80% (bash)
```yaml
- name: Check coverage
  run: |
    COVERAGE=$(python -c "import xml.etree.ElementTree as ET; print(ET.parse('coverage.xml').getroot().get('line-rate'))")
    python - <<PY
import sys
rate=float('$COVERAGE')
if rate < 0.8:
    print('Coverage below threshold', rate)
    sys.exit(1)
print('Coverage OK', rate)
PY
```

---

## Links
- GitHub Actions docs: https://docs.github.com/actions
- Actions for cache: https://github.com/actions/cache
- CodeQL: https://securitylab.github.com/tools/codeql
- Dependabot: https://docs.github.com/maintaining-security/keeping-your-dependencies-updated-automatically
- Docker Build Action: https://github.com/docker/build-push-action
- Super-Linter: https://github.com/github/super-linter

---

Notas finais:
- Workflows fornecem a espinha dorsal da entrega contínua da Stack SH. Adaptar exemplos acima à política de segurança do time e aos endpoints de deploy reais. Recomenda-se revisar secrets e permissões antes de ativar deploy automático para main.
