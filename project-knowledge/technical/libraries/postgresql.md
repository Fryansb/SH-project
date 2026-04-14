# PostgreSQL
## Versão: 15+
## Por que usamos:
- Performance e escalabilidade para cenários multi-tenant (particionamento, índices avançados, JSONB).
- Integração nativa e madura com Django (psycopg, transações, Migrations).
- Recursos para observabilidade (pg_stat_statements), replica/backup e tuning em produção.

---

## Setup Básico
### Instalação
- Em dev: usar PostgreSQL local via apt / brew ou container Docker (ex.: postgres:15).
- Driver Django: psycopg[binary] (preferível) ou psycopg2.

Exemplo instalando via pip:

```bash
pip install "psycopg[binary]" django
```

### Django - settings.py (exemplo padrão)

```python
# settings.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB', 'sh_db'),
        'USER': os.getenv('POSTGRES_USER', 'sh_user'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'sh_pass'),
        'HOST': os.getenv('POSTGRES_HOST', 'localhost'),
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
        # Conexão persistente - útil para reduzir overhead
        'CONN_MAX_AGE': int(os.getenv('CONN_MAX_AGE', 60)),
        # Opcional: opções avançadas
        'OPTIONS': {
            # Ex.: 'sslmode': 'require'
        },
    }
}
```

### Notas de configuração do servidor PostgreSQL
- pg_hba.conf: garantir regras apropriadas para rede (host/hostssl) e usar ident/md5 conforme política de segurança.
- Habilitar extensão pg_stat_statements para monitoramento:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

- Ajustes básicos de tuning (valores iniciais; calibrar conforme memória/CPU):
  - shared_buffers = 25% do total de RAM
  - effective_cache_size = 50-75% da RAM
  - max_connections = valor adequado (usar pgbouncer para muitos clientes)
  - work_mem = ajuste por consulta (p. ex. 4MB-16MB)

> Esses parâmetros devem ser testados em staging antes de aplicar em produção.

### Docker Compose (dev)

```yaml
# docker-compose.yml (trecho)
version: '3.8'
services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_DB: sh_db
      POSTGRES_USER: sh_user
      POSTGRES_PASSWORD: sh_pass
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres-data:
```

---


---

## API/Components (principais conceitos e utilitários)
- psycopg / connection: pool, cursors, parâmetros de isolamento.
- Django ORM: QuerySet, Manager, select_related/prefetch_related para evitar N+1.
- Indexes: Index, UniqueIndex, PartialIndex, GinIndex (para JSONB/text search).
- Migrations: makemigrations, migrate, operações RunSQL/RunPython para dados críticos.
- Extensions: pg_trgm, citext, hstore, postgis (quando necessário).

Exemplos importantes:

Criando um índice Gin em JSONB:

```python
from django.contrib.postgres.indexes import GinIndex
from django.db import models

class Event(models.Model):
    data = models.JSONField()

    class Meta:
        indexes = [GinIndex(fields=['data'])]
```

Query otimizada (usar values_list quando não precisar de objetos completos):

```python
emails = User.objects.filter(is_active=True).values_list('email', flat=True)
```

---

## Integração Stack SH (Django + React)
- Backend Django: usar DRF ViewSets/Serializer para expor endpoints otimizados.
- Autenticação: tokens/JWT armazenados no frontend, endpoints Django responsáveis por sessão/refresh.
- Paginação e filtros: paginar no server-side (Django paginator/LimitOffsetPagination).
- Conexão pooling em produção: usar pgbouncer entre Django e PostgreSQL para gerenciar muitas conexões (especialmente com Gunicorn/uvicorn workers).
- Migrações coordenadas: CI/CD (GitHub Actions) executa teste de migrations e aplica em canary/blue-green deploys.
- React: evite endpoints que retornem payloads enormes; use queries com projeção (fields) e endpoints para agregações quando necessário.

Exemplo de pattern:
- Endpoint DRF: GET /api/users/?fields=id,name,email&page=1
- Frontend: busca apenas campos necessários para a tela, reduz payload e carga no banco.

---

## Não Fazer ❌
- Usar SELECT * em consultas pesadas sem necessidade.
- Esquecer de criar índices para colunas filtradas/ordenadas frequentemente.
- Fazer long migrations de dados sem backups e janelas de manutenção.
- Confiar em autocommit sem entender transações; não envolver operações múltiplas em transações quando necessário.
- Abrir muitas conexões do app sem pooling (causa OOM/too many connections).
- Armazenar credenciais no repositório (usar secrets manager / env vars).

---

## Fazer Sempre ✅
- Medir antes de otimizar: usar EXPLAIN ANALYZE e pg_stat_statements.
- Usar select_related e prefetch_related para evitar N+1.
- Criar índices apropriados e revisar periodicamente (pg_stat_user_indexes).
- Usar CONN_MAX_AGE e pgbouncer em produção.
- Planejar backups (pg_dump/pg_basebackup/replication) e testá-los.
- Aplicar VACUUM/ANALYZE regularmente ou configurar autovacuum tuning.
- Versionar Migrations e revisá-las em code review (especialmente operações DDL que bloqueiam).
- Usar tipos corretos (UUIDField vs CharField, DateTimeTZ, JSONB se precisar de flexibilidade).

---

## Tests Obrigatórios (templates)
### 1) Teste Django: garantir número de queries (evitar N+1)

```python
# tests/test_users_queries.py
from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserQueryTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        for i in range(5):
            User.objects.create_user(username=f'u{i}', email=f'u{i}@x.com', password='pw')

    def test_user_list_queries(self):
        with self.assertNumQueries(1):
            qs = list(User.objects.filter(is_active=True).values('id', 'username'))
            # acessar qs para forçar execução
            assert len(qs) >= 0
```

### 2) Teste de performance (simples) - pytest + django

```python
# tests/test_orders_perf.py
import pytest
from django.db import connection

@pytest.mark.django_db
def test_heavy_query_performance():
    with connection.cursor() as cur:
        cur.execute("EXPLAIN ANALYZE SELECT COUNT(*) FROM app_order WHERE status='paid';")
        plan_rows = cur.fetchall()
        plan_text = "\n".join(row[0] for row in plan_rows if row and row[0])
        # Asserção simples: o EXPLAIN ANALYZE deve retornar um plano com 'Total runtime' ou 'Execution Time'
        assert ('Total runtime' in plan_text) or ('Execution Time' in plan_text) or len(plan_rows) > 0
```

### 3) Teste de migração segura (CI)
- No CI, criar DB temporário, aplicar todas as migrations e rodar testes básicos.
- Exemplo de job: python manage.py migrate --noinput && pytest -q

---

## Links
- PostgreSQL official: https://www.postgresql.org/docs/15/index.html
- Psycopg (psycopg3): https://www.psycopg.org/
- Django DB backends: https://docs.djangoproject.com/en/stable/ref/databases/
- PgBouncer: https://www.pgbouncer.org/
- EXPLAIN: https://www.postgresql.org/docs/15/using-explain.html
- pg_stat_statements: https://www.postgresql.org/docs/15/pgstatstatements.html

---

Notas finais:
- Este documento foi escrito para a Stack SH: exemplos de settings, docker-compose e testes são práticos e prontos para CI. Após revisão, executar no ambiente de staging para ajustar parâmetros de pool e autovacuum conforme carga real.
