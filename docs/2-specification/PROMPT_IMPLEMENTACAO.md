# Prompt de Implementação - MVP: Sistema de Autenticação e Gestão de Membros

**ATENÇÃO**: Antes de implementar QUALQUER COISA, leia os padrões em:
- django-rest-framework.md
- jwt-authentication.md
- react-material-ui.md
- E outras libs relevantes

**Regra fundamental**: Se já existe padrão documentado, USE-O. Não reinvente!

## Contexto do Projeto
Este prompt implementa as funcionalidades iniciais da plataforma de gestão da Software House conforme PRD.md e Spec.md. A plataforma organiza desenvolvedores autônomos em uma estrutura colaborativa com transparência e gestão de prioridade.

O frontend já inclui uma sidebar protegida por autenticação, um `PageShell` compartilhado e páginas reais para `Dashboard`, `Projects`, `Hours`, `Priority`, `Members` e `Reports`.

## Tarefa Específica
Implementar o sistema de autenticação com roles (admin/member) e gestão básica de membros conforme Spec.md seções "Autenticação" e "Members". Isso inclui login, registro, perfis e controle de acesso básico.

## Escopo Exato
- [ ] Setup do projeto Django REST com estrutura básica
- [ ] Configurar JWT authentication com refresh tokens
- [ ] Criar User model com role (admin/member)
- [ ] Criar Member Profile model com campos essenciais
- [ ] Implementar endpoints: login, refresh, logout
- [ ] Implementar CRUD de membros (admin only)
- [ ] Criar middlewares de permissão por role
- [ ] Setup frontend React + TypeScript com estrutura
- [ ] Criar components de Login e Register
- [ ] Criar Dashboard básico diferenciado por role
- [ ] Documentar a navegação lateral protegida e os shells de páginas já existentes no frontend

## Padrões Técnicos
**IMPORTANTE: Usar EXATAMENTE os padrões documentados em:**
- Django REST Framework: ../project-knowledge/technical/libraries/django-rest-framework.md
- JWT Authentication: ../project-knowledge/technical/libraries/jwt-authentication.md
- Material UI: ../project-knowledge/technical/libraries/react-material-ui.md
- PostgreSQL: ../project-knowledge/technical/libraries/postgresql.md
- Redux Toolkit: ../project-knowledge/technical/libraries/redux-toolkit.md
- Jest: ../project-knowledge/technical/libraries/jest.md

**Regra NÃO negociável**: NUNCA implementar sem consultar os docs da biblioteca primeiro

## Regras de Negócio Aplicáveis
- Apenas admins podem criar/editar membros
- Members veem apenas seus dados
- Passwords com hash (bcrypt)
- JWT expires em 24 horas, refresh em 7 dias
- Email único para cada usuário
- Stack selection via ManyToMany

## Estrutura de Arquivos

```
agencia-gestao/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── settings/
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   ├── accounts/
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   ├── members/
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   └── core/
│   │       ├── __init__.py
│   │       ├── permissions.py
│   │       └── exceptions.py
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── LoginForm.tsx
│   │   │   └── common/
│   │   │       ├── BaseButton.tsx
│   │   │       ├── BaseInput.tsx
│   │   │       └── PageShell.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Hours.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Members.tsx
│   │   │   ├── Priority.tsx
│   │   │   ├── Projects.tsx
│   │   │   └── Reports.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── auth.ts
│   │   ├── store/
│   │   │   ├── authSlice.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── constants.ts
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
```

## Exemplos de Código

### Backend - Models (seguir este padrão):
```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('member', 'Member'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

### Frontend - Components (seguir este padrão):
```typescript
import React from 'react';
import { Box, TextField, Button } from '@mui/material';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  // Implementation following Material UI patterns
};
```

### Frontend já consolidado
- `App.tsx` contém rotas protegidas com `RequireAuth` e `RequireAdmin`.
- O menu lateral aparece apenas para usuários autenticados.
- `Members` e `Reports` aparecem apenas para admin.
- `PageShell` padroniza título e descrição das páginas internas.
- `Login.tsx` redireciona para `Dashboard` quando já existe access token.
- O backend aceita login fixo via `FIXED_LOGIN_EMAIL` e `FIXED_LOGIN_PASSWORD` nas variáveis locais de desenvolvimento.

## Critérios de Sucesso

### Backend:
1. [ ] `python manage.py migrate` roda sem erros
2. [ ] `python manage.py test` passa todos os testes
3. [ ] POST `/api/auth/login` retorna tokens JWT
4. [ ] POST `/api/members/` (admin) cria novo membro
5. [ ] GET `/api/members/` (member) retorna erro 403
6. [ ] POST `/api/auth/refresh` renova token válido

### Frontend:
1. [ ] `npm install` instala dependências
2. [ ] `npm test` passa em todos os testes
3. [ ] `npm run build` compila sem erros
4. [ ] Login redireciona para dashboard correto
5. [ ] Member dashboard não mostra menu de admin
6. [ ] Admin dashboard lista todos os membros

### Manual:
1. [ ] Admin consegue criar novo membro
2. [ ] Member consegue fazer login
3. [ ] Logout remove tokens do localStorage
4. [ ] Refresh token funciona após expiração

## Não Fazer
- ❌ Implementar features além do básico (ex: fila de prioridade)
- ❌ Criar components duplicados (reutilizar common components)
- ❌ Hardcodar valores (usar constants)
- ❌ Ignorar validações de segurança
- ❌ Esquecer de adicionar testes

## Processo de Implementação

1. **Phase 1**: Setup do backend Django
2. **Phase 2**: Models e serializers
3. **Phase 3**: Views e endpoints
4. **Phase 4**: Tests do backend
5. **Phase 5**: Setup do frontend
6. **Phase 6**: Components e pages
7. **Phase 7**: Redux store e services
8. **Phase 8**: Tests do frontend
9. **Phase 9**: Integration test completo

## Gestão de Contexto Entre Conversas

### Scripts Necessários:
```bash
# Tornar executável
chmod +x scripts/save_context.py
```

### Comandos de Contexto:

#### A cada arquivo criado/modificado:
```bash
python scripts/save_context.py --action "created" --path "app/accounts/models.py" --phase "2"
```

#### Ao executar testes:
```bash
python scripts/save_context.py --action "tested" --path "backend" --phase "3"
```

#### Ao encontrar erro:
```bash
python scripts/save_context.py --action "error" --error "ValidationError in models.py"
```

#### Ao mudar de fase:
```bash
python scripts/save_context.py --action "phase_change" --phase "3" --path "Starting views implementation"
```

### Fluxo com /clear:

1. **ANTES do /clear**:
```bash
python scripts/save_context.py --action "paused" --path "implementation"
```

2. **USE /clear** para limpar contexto

3. **APÓS /clear**: Cole conteúdo de:
```bash
cat implementation/state/.RESTORE
```

### O que é salvo automaticamente:
- Todos os arquivos criados/modificados
- Decisões importantes tomadas
- Status dos testes executados
- Erros e soluções encontradas
- Fase atual e progresso
- Próximo passo a executar

### Arquivos de Controle:
- `.CONTEXT.json` - Estado completo (JSON)
- `.DEVELOPMENT.md` - Log cronológico (Markdown)
- `.RESTORE` - Comando pronto para colar

## Referências
- PRD.md: docs/1-research/PRD.md
- Spec.md: docs/2-specification/Spec.md
- REGRAS_DESENVOLVIMENTO.md: docs/3-guidelines/REGRAS_DESENVOLVIMENTO.md
- PESQUISA_PROMPTS.md: docs/1-research/PESQUISA_PROMPTS.md
- PESQUISA_CONTEXT_MANAGEMENT.md: docs/1-research/PESQUISA_CONTEXT_MANAGEMENT.md