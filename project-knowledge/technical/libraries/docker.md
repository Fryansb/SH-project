# Docker
## Versão: Docker 24+, Compose v2+
## Por que usamos:
- Reprodutibilidade entre ambientes (dev/staging/prod).
- Isolamento de serviços: banco, cache, web, worker.
- Facilita CI/CD e deploys com imagens imutáveis.

---

## Setup Básico
### Dockerfiles multistage

Django (production-ready) Dockerfile (improvements: non-root, cache deps, healthcheck):

```dockerfile
# Dockerfile (django)
FROM python:3.12-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 POETRY_VIRTUALENVS_CREATE=false
WORKDIR /app

# system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc libpq-dev curl && rm -rf /var/lib/apt/lists/*

# create non-root user
RUN useradd --create-home appuser

# copy dependency files first to leverage cache
COPY pyproject.toml poetry.lock /app/

# install poetry and dependencies (no-dev in production)
RUN pip install --upgrade pip && pip install poetry && poetry install --no-dev --no-interaction --no-ansi

COPY . /app
RUN chown -R appuser:appuser /app
USER appuser

# collect static (ensure DJANGO_SETTINGS_MODULE and envs set at build/run time)
RUN python manage.py collectstatic --noinput || true

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD curl -f http://localhost:8000/health || exit 1

CMD ["gunicorn", "project.wsgi:application", "--bind", "0.0.0.0:8000"]
```

Notes:
- COPY poetry.lock* was accepted but ensure poetry.lock exists; copying lockfile first improves build cache.
- collectstatic may require environment variables; in CI/build prefer to run collectstatic during release step or ensure envs are present.
- Using non-root user improves security; add appropriate permissions for volume mounts in deployments.

---


React (production) Dockerfile multistage:

```dockerfile
# Dockerfile (frontend)
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

### Docker Compose (dev)

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: sh_db
      POSTGRES_USER: sh_user
      POSTGRES_PASSWORD: sh_pass
    volumes:
      - postgres-data:/var/lib/postgresql/data
  web:
    build:
      context: .
      dockerfile: Dockerfile
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
  frontend:
    build:
      context: frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"

volumes:
  postgres-data:
```

---

## API/Components (boas práticas e utilitários)
- Healthchecks: endpoints /health ou /ready para uso de orquestradores.
- Entrypoints: usar scripts entrypoint.sh para aplicar migrations, criar usuários e rodar supervisores.
- Secrets: usar env files durante dev, e secrets managers (AWS Secrets Manager, Vault) em produção.

Exemplo de entrypoint.sh (Django):

```bash
#!/bin/sh
set -e

# wait for db (opcional: usar wait-for-it ou psql loop)
python manage.py migrate --noinput
# coletar assets apenas em production
if [ "$DJANGO_ENV" = "production" ]; then
  python manage.py collectstatic --noinput
fi

exec "$@"
```

---

## Integração Stack SH
- CI: imagens frontend e backend são construídas separadamente; backend roda testes e gera artefatos (migrations) antes de build final.
- Local dev: compose com volumes permite hot-reload para backend e frontend.
- Production: usar multi-stage builds, remover dependências de dev, e empacotar apenas artefatos necessários.
- Migrações: aplicar migrações automaticamente em deploy controlado (canary) ou via job separado.

---

## Não Fazer ❌
- Buildar imagens com chaves/segredos embutidos.
- Usar root user em containers sem necessidade.
- Executar migrations direto no CMD sem proteção (pode causar race conditions em escalonamento).
- Manter volumes mutáveis como fonte de verdade para dados críticos (usar backups e replicas).

---

## Fazer Sempre ✅
- Minimizar camadas na imagem e usar .dockerignore.
- Rodar containers com non-root user quando possível.
- Incluir healthchecks e readiness probes.
- Fazer multi-stage builds para reduzir tamanho de imagem.
- Automatizar builds e scans de vulnerabilidades na pipeline.

---

## Tests Obrigatórios
- Testar que a imagem constrói: docker build --file Dockerfile -t sh-backend:ci .
- Testar healthcheck endpoint com curl em CI.
- Rodar lint e testes dentro do container (docker run sh-backend:ci pytest).

---

## Links
- Docker: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- Nginx for static sites: https://nginx.org/en/docs/

---

Notas finais: exemplos adaptados para a Stack SH — revisar variáveis de ambiente e secrets no deploy para garantir segurança.
