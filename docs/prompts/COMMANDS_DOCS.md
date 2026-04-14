# Comandos Rápidos para Gerar Documentação

## Como Usar:

1. **Copiar** o prompt abaixo
2. **Substituir** [NOME_DA_BIBLIOTECA]
3. **Colar** na conversa com IA

---

## Prompt Principal:

```
# Gerar Documentação Técnica - [NOME_DA_BIBLIOTECA]

## Contexto
Você é especialista técnico com experiência profunda em stacks web modernas. Siga as instruções em docs/prompts/Gerar_Doc_Bibliotecas.md para criar documentação completa da biblioteca [NOME_DA_BIBLIOTECA].

## Requisitos Específicos:
- Criar arquivo: project-knowledge/technical/libraries/[NOME_DA_BIBLIOTECA].md
- Seguir template exato das libs existentes no projeto
- Customizar para stack Django + React + TypeScript da Software House
- Incluir exemplos funcionais e testes
- Focar em patterns práticos para implementação imediata

## Bibliotecas de Referência:
- Ver django-rest-framework.md para padrão backend
- Ver react-material-ui.md para padrão frontend
- Ver jwt-authentication.md para padrão de autenticação

## Entregar:
1. Documentação markdown completa
2. Código exemplo funcional
3. Integração com stack atual
4. Tests obrigatórios
5. Links oficiais

## Comece com:
"Vou gerar documentação completa para [NOME_DA_BIBLIOTECA] seguindo padrão técnico do projeto SH. Primeiro, vou analisar a biblioteca..."
```

---

## Comandos por Biblioteca:

### 1. PostgreSQL:
```
# Gerar Documentação - PostgreSQL

# ...prompt principal com [NOME_DA_BIBLIOTECA] = "PostgreSQL" 
Foco em:
- Integração Django
- Migrations
- Performance tips
- Queries otimizadas
```

### 2. Docker:
```
# Gerar Documentação - Docker

# ...prompt principal com [NOME_DA_BIBLIOTECA] = "Docker"
Foco em:
- Django + React containers
- Docker Compose
- Production deploy
- Volumes e networks
```

### 3. Redux Toolkit:
```
# Gerar Documentação - Redux Toolkit

# ...prompt principal com [NOME_DA_BIBLIOTECA] = "Redux Toolkit"
Foco em:
- Integração React + TypeScript
- Auth state
- API integration
- Testing patterns
```

### 4. Testing (Jest):
```
# Gerar Documentação - Jest + Testing Library

# ...prompt principal com [NOME_DA_BIBLIOTECA] = "Jest"
Foco em:
- React Component Tests
- Backend API Tests
- Integration Tests
- Coverage setup
```

### 5. Vercel:
```
# Gerar Documentação - Vercel Deployment

# ...prompt principal com [NOME_DA_BIBLIOTECA] = "Vercel"
Foco em:
- Next.js deploy
- Environment variables
- Custom domains
- CI/CD integration
```

### 6. GitHub Actions:
```
# Gerar Documentação - GitHub Actions

# ...prompt principal com [NOME_DA_BIBLIOTECA] = "GitHub Actions"
Foco em:
- Django testing workflow
- Frontend build workflow
- Deploy automático
- Security scanning
```

### 7. ESLint/Prettier:
```
# Gerar Documentação - ESLint + Prettier

# ...prompt principal com [NOME_DA_BIBLIOTECA] = "ESLint"
Foco em:
- React + TypeScript config
- Django Python linting
- Pre-commit hooks
- VS Code integration
```

---

## Script Multi-Bibliotecas (para gerar todas):

```
# Gerar Documentação - Múltiplas Bibliotecas

## Tarefa
Gerar documentação completa para TODAS as bibliotecas da lista abaixo, uma por vez, seguindo padrão técnico do projeto SH.

## Lista de Bibliotecas:
1. PostgreSQL
2. Docker
3. Redux Toolkit
4. Jest (testing)
5. Vercel
6. GitHub Actions
7. ESLint + Prettier

## Processo:
1. Gerar doc da primeira biblioteca
2. Aguardar confirmação que está correta
3. Continuar para próxima biblioteca
4. Repetir até completar todas

## Formato:
- Cada biblioteca em arquivo separado
- Path: project-knowledge/technical/libraries/[nome].md
- Seguir padrão das libs existentes

## Comece com:
"Vou gerardocumentação para PostgreSQL primeiro..."
```

---

## Comando de Verificação:

```
# Verificar Documentação Gerada

## Checar se a doc gerada está correta:

1. [ ] Tem Header completo com versão?
2. [ ] Tem "Por que usamos" alinhado ao projeto?
3. [ ] Tem Setup básico com comandos exatos?
4. [ ] Tem exemplos funcionais?
5. [ ] Tem seção "Não Fazer" e "Fazer Sempre"?
6. [ ] Tem Tests obrigatórios?
7. [ ] Tem links oficiais?
8. [ ] Segue padrão das outras libs?

## Se faltar algo:
"Por favor, adicione a seção [X] à documentação de [BIBLIOTECA]"
```

---

## Dicas:

- Use Claude 3 Sonnet ou Opus para melhor qualidade técnica
- Aguarde confirmação antes de gerar próxima biblioteca
- Salve cada arquivo gerado em project-knowledge/technical/libraries/
- Verifique se o código exemplo realmente funciona
- Mantenha consistência com as 3 libs existentes

## Resultado Esperado:
Ao final, você terá documentação completa para todas as bibliotecas da stack, permitindo que a IA implemente seguindo patterns testados e validados!