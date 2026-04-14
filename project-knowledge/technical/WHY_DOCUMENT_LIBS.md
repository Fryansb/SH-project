# Por Que Documentar Bibliotecas e Ferramentas?

## Problemas que Isso Resolve:

1. **Evita reinventar a roda** - A IA usa patterns existentes em vez de criar do zero
2. **Aumenta qualidade do input** - Melhor input = melhor output
3. **Centraliza conhecimento** - Não precisa pesquisar a cada implementação
4. **Garante consistência** - Todos usam os mesmos patterns
5. **Reduz bugs** - Usa soluções testadas e validadas

## Onde Colocar:

### project-knowledge/technical/
```
project-knowledge/technical/
├── libraries/                 # Bibliotecas principais
│   ├── django-rest-framework.md
│   ├── react-material-ui.md
│   ├── jwt-authentication.md
│   └── postgresql-guide.md
├── tools/                     # Ferramentas e infra
│   ├── docker-setup.md
│   ├── vercel-deployment.md
│   ├── testing-strategies.md
│   └── git-workflow.md
└── patterns/                  # Padrões específicos
    ├── state-management.md
    ├── error-handling.md
    └── api-structure.md
```

## O Que Incluir em Cada Documento:

### 1. Info Básica
- Link para documentação oficial
- Versão que estamos usando
- Por que escolhemos esta lib

### 2. Exemplos RELEVANTES
- Código que faremos neste projeto
- Patterns específicos que queremos seguir
- Setup básico com nossa stack

### 3. Gotchas & Best Practices
- Coisas que não fazer ❌
- Coisas que sempre fazer ✅
- Problemas comuns e soluções

### 4. Integração com Stack
- Como combina com nossas outras libs
- Config específica para nosso caso

## Exemplo Prático - Django JWT:

```markdown
# Django JWT Authentication

## Versão: djangorestframework-simplejwt

## Por que usamos:
- Refresh tokens automáticos
- Config customizável
- Performance melhor que DRF nativo

## Setup Básico (nosso padrão):
```python
# settings.py
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}
```

## Padrão de Login:
```python
# views.py - SEGUIR EXATAMENTE ESTE PADRÃO
class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # Nossa implementação específica
```

## Não fazer:
❌ Implementar refresh manual
❌ Salvar senha em plaintext
❌ Usar tokens com lifetime > 30 dias
```

## Como Usar no Prompt:

Ao implementar autenticação, o prompt deve incluir:
```
## Bibliotecas Específicas
- Django JWT: Siga exatamente os padrões em project-knowledge/technical/libraries/django-jwt.md
- React Material UI: Use components de project-knowledge/technical/libraries/react-material-ui.md
```

## Benefícios:

1. **Qualidade Garantida** - Código segue patterns testados
2. **Velocidade** - IA não precisa "adivinhar" como usar
3. **Consistência** - Todo mundo usa mesma estrutura
4. **Maintainable** - Fácil de entender e modificar

## Fluxo de Atualização:

1. Ao escolher nova lib → Criar doc primeiro
2. Ao encontrar problema → Atualizar doc com solução
3. Ao encontrar pattern melhor → Atualizar doc

 Isso é fundamental para o sucesso do projeto!