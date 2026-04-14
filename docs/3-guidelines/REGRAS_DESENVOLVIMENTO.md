# Regras de Desenvolvimento - Plataforma de Gestão

**Data**: 14/04/2026
**Base**: Metodologia Spec-Driven Development (SDD)
**Status**: Pronto para Implementação

## Premissas Fundamentais

Este guia define as regras de desenvolvimento para evitar os 5 problemas comuns quando se desenvolve com IA:

1. Over-engineering
2. Reinventar a roda
3. Não sabe fazer o que foi pedido
4. Repete trechos de código
5. Junta tudo no mesmo lugar

## Regra de Ouro: Input/Output

**Qualidade do input = Qualidade do output**
- Sempre fornecer TODA informação necessária
- Ser conciso e direto
- Não pedir para a IA "adivinhar"
- Referenciar documentação existente

## Metodologia SDD (Spec-Driven Development)

### Fase 1: Pesquisa (Research)
O que fazer ao implementar algo novo:

1. **Pesquisar first, code second**
   - Ler PRD.md completamente
   - Pesquisar documentação de tecnologias
   - Encontrar padrões similares no código base
   - Importar exemplos de repositórios externos se necessário

2. **Resultado esperado**
   - Documento PRD.md atualizado
   - Links para documentação relevante
   - Exemplos de código que funcionam

### Fase 2: Especificação (Spec)
1. **Limpar contexto**
   - Após pesquisa, usar `/clear`
   - Começar nova conversa com contexto limpo

2. **Referenciar PRD**
   - "Lê esse PRD.md e gera uma spec"
   - Especificar exatamente:
     - Arquivos que precisam ser modificados
     - Arquivos que precisam ser criados
     - O que fazer em cada arquivo

3. **Resultado esperado**
   - Spec.md detalhado
   - Paths exatos dos arquivos
   - Descrição precisa das mudanças

### Fase 3: Implementação (Code)
1. **Contexto limpo novamente**
   - Dar `/clear` novamente
   - Contexto livre para implementação

2. **Implementar Spec**
   - "Implemente essa Spec.md"
   - Anexar arquivo como prompt
   - Usar máxima capacidade do modelo

## Regras Específicas do Projeto

### 1. Evitar Over-engineering
- **Regra**: Se existe uma lib que faz isso, usar a lib
- **Exemplo**: Editor rich text? Não criar do zero. Usar Tiptap, Prosemirror, etc.
- **Verificação**: O componente resolve o problema com <50% do código que eu escreveria?

### 2. Não Reinventar a Roda
- **Regra**: Antes de criar, pesquisar soluções existentes
- **Fontes a verificar**:
  - Documentação oficial das libs
  - Exemplos no GitHub
  - Stack Overflow
  - Repositórios da comunidade
- **Processo**: Importar para pasta `.temp`, analisar, depois deletar

### 3. Verificar Capacidade
- **Regra**: Se a documentação é de 2026 e cutoff é 2024, não funciona
- **Verificação**: 
  - A IA reconhece a tecnologia?
  - Tem exemplos funcionando?
  - A documentação é acessível?

### 4. Evitar Repetição
- **Regra**: Components são únicos e reutilizáveis
- **Verificação**:
  - Já existe um Button component? Usar ele!
  - Já existe uma API helper function? Importar!
  - CSS já tem essa classe estilizada? Usar!

### 5. Separação de Responsabilidades
- **Regra**: Um arquivo = uma responsabilidade
- **Exemplos**:
  - `auth.js` só cuida de autenticação
  - `api.js` só cuida de chamadas de API
  - `utils.js` só tem funções utilitárias
- **Verificação**: O arquivo faz mais de uma coisa? Dividir!

## Padrões de Código Específicos

### Backend (Django)
```python
# Models: um model por arquivo
# Views: uma viewset por arquivo
# Serializers: um serializer por arquivo
# Utils: funções genéricas em utils.py
# Tests: sempre criar test_*.py
```

### Frontend (React/TypeScript)
```typescript
// Components: um component por arquivo
// Types: types/interfaces centralizados
// Services: API calls em services/
// Hooks: custom hooks em hooks/
// Utils: helper functions em utils/
```

## Processo de Code Review

### Checklist antes de aceitar código:
1. [ ] Segue a arquitetura definida?
2. [ ] Reusa components existentes?
3. [ ] Tem tests?
4. [ ] Não tem código duplicado?
5. [ ] Documentação atualizada?

### Se falhar em algum item:
- Não aceitar o código
- Pedir para refazer seguindo as regras
- Explicar qual regra foi violada

## Padrões de Git

### Branching
- `main` - produção
- `develop` - desenvolvimento
- `feature/nome-da-feature` - novas funcionalidades
- `fix/nome-do-fix` - correções

### Commits
```
feat: add member registration
fix: resolve priority queue calculation
docs: update API documentation
refactor: extract reusable components
test: add coverage for priority queue
```

## Context Window Management

### Limites
- Manter conversa < 50% do context window
- Usar `/clear` entre fases
- Anexar arquivos em vez de colar código

### Sinais de context pollution
- Respostas genéricas
- Esquecimento de código anterior
- Repetição de patterns já definidos
- Implementations inconsistentes

## Verificação de Qualidade

### Automática
```bash
# Backend
flake8
black
coverage run

# Frontend
eslint
prettier
jest
```

### Manual
- Code funciona no one shot?
- Segue a spec?
- Não há over-engineering?
- Código é maintainable?

## Debugging

### Se algo não funciona:
1. Não tentar "fixar" aleatoriamente
2. Voltar à spec: o que foi pedido?
3. Verificar se não violou alguma regra
4. Pedir esclarecimento se spec está ambígua

## Documentação

### Regra fundamental:
- Todo código novo precisa de documentação
- Atualizar PRD.md se mudar requisitos
- Comentários apenas em lógica complexa
- READMEs com exemplos de uso

## Integração Contínua

### Pipeline:
1. Lint/format
2. Tests
3. Type check
4. Build
5. Deploy (somente se passar em tudo)

## Emergências

### Se precisar quebrar uma regra:
- Documentar o motivo
- Criar issue para consertar depois
- Não criar precedentes
- Comunicar ao time

## Métricas de Sucesso

### Indicadores de que as regras funcionam:
- Código escrito em one shot
- Sem necessidade de refactoring
- Test coverage > 80%
- Zero bugs críticos
- Deploy tranquilo

## Treinamento

### Checklist de onboarding:
1. [ ] Leu PRD.md
2. [ ] Leu Spec.md
3. [ ] Entendeu as regras
4. [ ] Fez primeiro PR seguindo regras
5. [ ] Recebeu review e ajustou

## Evolução das Regras

- Revisar mensalmente
- Adicionar novas regras se necessário
- Remover regras que não fazem sentido
- Manter documento vivo

## Lembrete Final

> "A qualidade do seu input determina a qualidade do output"
> 
> Over-engineering é o caminho para o fracasso
> 
> Simplicidade é o objetivo final