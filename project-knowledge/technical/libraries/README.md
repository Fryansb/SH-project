# Documentação de Bibliotecas - Índice

## Por Que Isso É Crucial?

### 1. Evita Reinventar a Roda 🛠️
- A IA usa patterns existentes em vez de criar do zero
- Exemplo de sucesso: Tiptap para editor rich text em vez de criar do zero

### 2. Aumenta a Qualidade do Input 💎
- Melhor input = melhor output
- IA não precisa "adivinhar" como usar as bibliotecas

### 3. Garante Consistência 📏
- Todos os desenvolvedores usam os mesmos patterns
- Código mais maintainable

### 4. Reduz Bugs 🐛
- Usa soluções testadas e validadas
- Evita problemas comuns conhecidos

## Como Usar Esta Documentação

### 1. Ao Implementar:
```
## Bibliotecas Específicas
- Django JWT: Siga exatamente em libraries/jwt-authentication.md
- Material UI: Use components de libraries/react-material-ui.md
- DRF: Padrões em libraries/django-rest-framework.md
```

### 2. Ao Especificar:
```
## Stack Técnica
- Backend: Django REST Framework (veja libraries/django-rest-framework.md)
- Frontend: React + Material UI (veja libraries/react-material-ui.md)  
- Auth: JWT (veja libraries/jwt-authentication.md)
```

## Bibliotecas Documentadas:

### 🎯 Essenciais (Core Stack)
| Biblioteca | Documentação | Status |
|------------|-------------|---------|
| Django REST Framework | [django-rest-framework.md](django-rest-framework.md) | ✅ Completa |
| JWT Authentication | [jwt-authentication.md](jwt-authentication.md) | ✅ Completa |
| Material UI React | [react-material-ui.md](react-material-ui.md) | ✅ Completa |

### 📦 A Adicionar (Prioridade Alta)
| Biblioteca | Documentação | Status |
|------------|-------------|---------|
| PostgreSQL | postgresql-guide.md | 📋 Para criar |
| Docker | docker-setup.md | 📋 Para criar |
| Redux Toolkit | redux-toolkit.md | 📋 Para criar |
| Testing (Jest) | testing-strategies.md | 📋 Para criar |

### 🔧 Ferramentas DevOps
| Biblioteca | Documentação | Status |
|------------|-------------|---------|
| Vercel Deployment | vercel-deployment.md | 📋 Para criar |
| GitHub Actions | github-actions.md | 📋 Para criar |
| ESLint/Prettier | code-quality.md | 📋 Para criar |

## Template para Nova Documentação:

```markdown
# [Nome da Biblioteca]

## Versão: [versão]

## Por que usamos:
- Motivo 1
- Motivo 2

## Setup Básico (PADRÃO DO PROJETO):
### 1. Instalação
```bash
pip install nome
```

### 2. Config padrão
```python
# settings/módulo.py
PADRÃO = "valor"
```

### 3. Exemplo de uso
```python
# SEGUIR EXATAMENTE ESTE PADRÃO
def exemplo():
    # Implementação específica
```

## Não Fazer ❌:
- ❌ Não fazer isso
- ❌ Evitar aquilo

## Fazer Sempre ✅:
- ✅ Fazer assim
- ✅ Sempre isto

## Tests Obrigatórios:
```python
def test_basico():
    # Teste padrão
```

**Link Oficial**: https://link-para-docs
```

## Checklists:

### ✅ Antes de Começar uma Nova Feature:
1. [ ] Verificar se existe doc da biblioteca
2. [ ] Ler o padrão definido 
3. [ ] Seguir exatamente o exemplo
4. [ ] Não reinventar se existe padrão

### ✅ Ao Encontrar Bug:
1. [ ] Verificar se violou algum padrão da doc
2. [ ] Atualizar a doc com a solução encontrada
3. [ ] Adicionar "common issues" se relevante

### ✅ Ao Melhorar um Padrão:
1. [ ] Atualizar a documentação
2. [ ] Migrar código existente
3. [ ] Comunicar ao time

## Integração com SDD:

### Phase 1 (Research):
- Pesquisar libs existentes
- Criar doc se não existe

### Phase 2 (Spec):  
- Referenciar docs específicas na Spec

### Phase 3 (Guidelines):
- Incluir mensagens com referências à docs

### Phase 4 (Implementation):
- Seguir padrões rigorosamente

---

## Como Criar Nova Doc:

1. **Escolher template** acima
2. **Pesquisar**: Docs oficiais, exemplos, best practices
3. **Criar patterns**: Baseado no nosso caso de uso
4. **Testar**: Criar exemplo funcionando
5. **Documentar**: Incluir gotchas e soluções

### Script Automático (futuro):
```bash
python scripts/add_lib_doc.py --lib "pytest" --version "7.0"
# Cria template automáticamente
```

---

**Lembrete**: Documentação de bibliotecas é um investimento que paga 10x em velocidade e qualidade!