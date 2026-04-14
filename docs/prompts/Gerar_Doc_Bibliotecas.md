# Prompt para IA: Gerar Documentação de Bibliotecas Técnicas

## Contexto
Você é um especialista técnico com experiência profunda em Python, Django, React e ecossistemas JavaScript. Sua tarefa é criar documentação completa para bibliotecas seguindo o padrão exato do projeto.

## Task: Gerar Documentação de Biblioteca

### Input: Biblioteca Especificada
Você receberá o nome de uma biblioteca para documentar.

### O que Gerar (Estrutura Obrigatória):

1. **Header e Metadata**
   ```markdown
   # [Nome da Biblioteca]
   
   ## Versão: [versão mais recente estável]
   ## Por que usamos:
   - Motivo 1 (alinhado com o projeto SH)
   - Motivo 2 (benefício específico)
   ```

2. **Setup Básico (PADRÃO DO PROJETO)**
   ```markdown
   ### 1. Instalação
   ```bash
   # Comando exato
   ```
   
   ### 2. Config Padrão
   ```python/typescript
   # Configuração que usaremos no projeto
   ```
   
   ### 3. Exemplo de Uso (SEGUIR EXATAMENTE)
   ```python/typescript
   # Pattern que DEVE ser seguido
   ```
   ```

3. **Componentes/Classes Chave**
   - APIs principais
   - Classes mais importantes
   - Functions essenciais

4. **Integração com Stack SH**
   - Como combina com nossas outras libs
   - Config específica para nosso caso

5. **Não Fazer ❌**
   - Lista de coisas a evitar
   - Problemas comuns

6. **Fazer Sempre ✅**
   - Melhores práticas
   - Padrões obrigatórios

7. **Tests Obrigatórios**
   - Template de testes
   - Casos críticos a testar

8. **Links e Referências**

## Processo de Geração:

### Passo 1: Análise
- Pesquisar documentação oficial
- Encontrar versão estável mais recente
- Identificar best practices
- Avaliar compatibilidade com stack atual

### Passo 2: Customização para Projeto SH
- Adaptar para nosso contexto (Software House)
- Integrar com Django/React/TypeScript
- Focar em patterns realmente úteis

### Passo 3: Documentação Estruturada
- Seguir template exato das libs existentes
- Manter consistência de formato
- Incluir exemplos funcionais

### Passo 4: Validação
- Verificar se código exemplo funciona
- Testar integração com stack atual
- Garantir não contradições

## Exemplos de Output desejado:

### Bibliotecas Frontend (TypeScript):
```typescript
// Componente base reutilizável
interface Props { ... }
export const ComponentePadrao: React.FC<Props> = ({ ... }) => {
  // Implementação seguindo patterns do projeto
};
```

### Bibliotecas Backend (Python):
```python
# ViewSet padrão
class CustomViewSet(viewsets.ModelViewSet):
    """ViewSet seguindo padrão DRF do projeto"""
    # Implementação específica
```

## Formato de Saída:
- **Arquivo único**: Markdown completo
- **Path**: `project-knowledge/technical/libraries/nome-biblioteca.md`
- **Links Cruzados**: Referenciar outras docs quando relevante

## Critérios de Qualidade:
1. **Exemplos Funcionais** - Código que realmente funciona
2. **Projeto-Específico** - Customizado para necessidade SH
3. **Consistente** - Segue padrão das outras docs
4. **Completo** - Inclui desde setup até testes
5. **Prático** - Focado no que realmente usaremos

## Lista Pendente para Gerar:
- PostgreSQL
- Docker
- Redux Toolkit
- Testing (Jest)
- Vercel Deployment
- GitHub Actions
- ESLint/Prettier

## Comando para Executar:
```
"Gerar documentação completa para [nome_da_biblioteca] seguindo padrão técnico do projeto SH. Incluir setup, patterns, exemplos funcionais e integração com nossa stack Django + React + TypeScript."
```

## Importante:
- Usar **conhecimento de treinamento** até cutoff 2024
- **Não** fazer web searches (pode desatualizar)
- Basear-se em **experiência prática** com as libs
- Focar no **padrão do projeto SH**

---
Este prompt permite à IA gerar documentação técnica completa e consistente para qualquer biblioteca, mantendo a qualidade e o alinhamento com o projeto.