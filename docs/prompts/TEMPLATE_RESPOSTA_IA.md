# Template de Resposta da IA para Documentação de Bibliotecas

Este é o template que a IA deve seguir ao gerar documentação de cada biblioteca:

---

# [NOME_DA_BIBLIOTECA]

## Versão: [versão_estável_atual]

## Por que usamos:
- [Motivo principal alinhado com Software House]
- [Benefício específico para nosso modelo de negócio]
- [Como resolve um problema específico do projeto]

## Setup Básico (PADRÃO DO PROJETO):

### 1. Instalação
```bash
# Comando exato de instalação
pip install nome
# ou
npm install nome
```

### 2. Configuração Padrão
```python
# settings.py ou config (para backend)
CONFIG_PATTERN = "valor_específico_SH"
```
```typescript
// config (para frontend)
export const config = {
  // Config específica do projeto
};
```

### 3. Exemplo de Uso (SEGUIR EXATAMENTE ESTE PADRÃO)
```python
# Exemplo prático que usaremos
def padrão_projeto():
    # Implementação específica SH
    pass
```

## API/Componentes Principais

### [Componente/Classe 1]
- Propósito:
- Uso no projeto:
- Exemplo:

### [Componente/Classe 2]
- Propósito:
- Uso no projeto:
- Exemplo:

## Integração com Stack SH

### Com Django
```python
# Como integra com views/models DRF
```

### Com React/TypeScript
```typescript
// Como integra com components/estado
```

### Com Material UI
```typescript
// Como funciona com nosso theme
```

## Não Fazer ❌:
- ❌ [Erro comum 1]
- ❌ [Pitfall 2]
- ❌ [Anti-pattern 3]

## Fazer Sempre ✅:
- ✅ [Best practice 1]
- ✅ [Padrão obrigatório 2]
- ✅ [Otimização 3]

## Tests Obrigatórios

```python
# Template de test padrão
class LibraryTest(TestCase):
    def test_basic_functionality(self):
        # Testar caso principal
        pass
    
    def test_integration(self):
        # Testar com nossa stack
        pass
```

```typescript
// Teste frontend se aplicável
describe('Library Component', () => {
  it('should integrate correctly', () => {
    // Teste de integração
  });
});
```

## Performance & Otimizações

```python
# Otimizações específicas
queryset = queryset.select_related('related').prefetch_related('prefetch')
```

```typescript
// Otimizações frontend
const memoized = useMemo(() => expensiveCalc(data), [data]);
```

## Troubleshooting Comum

### Problema 1: [Erro específico]
**Solução**:
```python
# Como resolver
```

### Problema 2: [Erro específico]
**Solução**:
```typescript
// Como resolver
```

## Links e Referências:
- **Documentação Oficial**: https://link-oficial.com
- **API Reference**: https://api-docs.link
- **Exemplos**: https://examples.link
- **Community**: https://community.link

---

**Arquivo**: project-knowledge/technical/libraries/[nomedolivro].md
**Atualização**: [Data de hoje]
**Status**: Pronto para Implementação