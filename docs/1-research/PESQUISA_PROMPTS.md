# Melhores Práticas para Prompts de Implementação

## Pesquisa sobre Estrutura de Prompts Eficazes

### Baseado em documentação de Claude Code e melhores práticas da indústria

## Componentes Essenciais de um Bom Prompt de Implementação

### 1. Contexto Completo
- **Por que**: Claude precisa entender o "porquê" para tomar boas decisões
- **O que incluir**: Referências a todos os documentos relevantes (PRD, Spec,etc.)
- **Como**: Links ou resumos concisos dos pontos-chave

### 2. Escopo Claro
- **Por que**: Evita over-engineering e features não solicitadas
- **O que incluir**: Exatamente o que precisa ser feito
- **Como**: Lista de checkboxes concretos

### 3. Padrões e Convenções
- **Por que**: Garante consistência no código
- **O que incluir**: Stack, patterns, naming conventions
- **Como**: Exemplos de código do projeto

### 4. Regras de Negócio
- **Por que**: Implementação correta da lógica
- **O que incluir**: Validações, permissões, cálculos
- **Como**: Pseudocódigo ou fórmulas

### 5. Estrutura de Arquivos Esperada
- **Por que**: Organização do projeto
- **O que incluir**: Paths exatos,命名规范
- **Como**: Árvore de diretórios

### 6. Verificação e Testes
- **Por que**: Qualidade garantida
- **O que incluir**: Como testar o que foi implementado
- **Como**: Passos específicos de verificação

## Formato Recomendado (Template)

```
# Contexto do Projeto
[Referência ao PRD.md em 2-3 frases]

# Tarefa Específica
Implementar [feature] conforme Spec.md seção [seção]

# Escopo Exato
- [ ] Item 1: [descrição]
- [ ] Item 2: [descrição]
- [ ] Item 3: [descrição]

# Padrões Técnicos
- Backend: Django REST Framework
- Frontend: React + TypeScript
- Database: PostgreSQL
- [Outros padrões relevantes]

# Regras de Negócio Aplicáveis
- [Regra 1 com exemplo]
- [Regra 2 com exemplo]

# Estrutura de Arquivos
```
pasta/arquivo1.js
pasta/arquivo2.ts
```

# Exemplos de Código
```javascript
// Exemplo de padrão existente a seguir
```

# Critérios de Sucesso
1. [Critério verificável 1]
2. [Critério verificável 2]
3. [Critério verificável 3]

# Não Fazer
- ❌ [Coisa a evitar]
- ❌ [Outra coisa a evitar]

# Referências
- PRD.md: [path]
- Spec.md: [path]
- [Outros docs relevantes]
```

## Padrões Identificados de Prompts de Alto Sucesso

### Structure Patterns
1. **The Triple Header**:
   - Header 1: O que fazer
   - Header 2: Como fazer
   - Header 3: Como verificar

2. **The Five W's**:
   - What: Exatamente o que buildar
   - Why: Por que isso importa
   - Where: Onde colocar os arquivos
   - When: Quando isso roda no fluxo
   - Who: Quem tem acesso a isso

### Content Patterns
1. **Bullet Points para requisitos**
2. **Code blocks para exemplos**
3. **Markdown paths para estrutura**
4. **Checklists para verificação**
5. **Emojis (❌/✅) para o que fazer/não fazer

## Erros Comuns a Evitar

### 1. Vague Instructions
- ❌ "Implementar autenticação"
- ✅ "Implementar login JWT com refresh tokens usando Django REST"

### 2. Missing Context
- ❌ "Criar dashboard"
- ✅ "Criar dashboard conforme Spec.md seção Dashboard, usando React + TypeScript"

### 3. No Constraints
- ❌ "Build feature X"
- ✅ "Build feature X usando Material UI, seguindo pattern do componente Button existente"

### 4. No Verification
- ❌ "Fazer funcionar"
- ✅ "Testar com: npm test && manual verification checklist"

## Técnicas Avançadas

### 1. Progressive Disclosure
- Começar com contexto geral
- Detalhes específicos depois
- Exemplos no final

### 2. Example-Driven
- Mostrar código que funciona
- Pedir para seguir padrão
- Indicar onde encontrar exemplos

### 3. Constraint-Based
- Listar limits e boundaries
- Indicar o que NÃO fazer
- Especificar edge cases

### 4. Verification-First
- Definir como testar primeiro
- Implementação depois
- Testes incluídos

## Recomendação de Modelo

Para implementação de código, use modelos com forte capacidade de reasoning:

1. **Claude 3 Opus** (se disponível) - Melhor para código complexo
2. **Claude 3 Sonnet** - Bom balance custo/benefício
3. **GPT-4** - Alternative forte para código
4. **Claude 3 Haiku** - Para tasks simples/rápidas

Considerando a imagem mostrada (que não posso ver), recomendo começar com **Claude 3 Sonnet** para implementação, pois oferece bom equilíbrio entre capacidade de código e custo.