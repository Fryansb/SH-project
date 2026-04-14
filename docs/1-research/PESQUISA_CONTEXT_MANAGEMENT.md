# Pesquisa: Sistemas de Persistência de Contexto para Desenvolvimento com IA

## Problema Identificado
Ao usar `/clear`, a IA perde todo o contexto do projeto durante as fases do SDD. Precisamos de um sistema para:
1. Salvar progresso entre conversas
2. Recuperar contexto rapidamente
3. Evitar re-ler toda a documentação

## Soluções Pesquisadas

### 1. Context Cache Files (Recomendado)
**Como funciona**:
- Arquivo JSON que guarda estado do desenvolvimento
- Salva a cada fase completada
- Recuperável com um comando simples

**Estrutura**:
```json
{
  "project": "Plataforma de Gestão SH",
  "phase": "implementation",
  "current_phase": 2,
  "completed_files": [
    "accounts/models.py",
    "accounts/serializers.py"
  ],
  "decisions": [
    "Usar JWT com refresh tokens",
    "Material UI v5 para frontend"
  ],
  "next_step": "Implementar views.py",
  "test_results": {
    "backend": {
      "migrate": "✓",
      "test": "pending"
    }
  }
}
```

### 2. State Marker Files
**Como funciona**:
- Arquivo .STATE em cada diretório
- JSON com progresso específico daquele módulo
- Facilita retomar exatamente onde parou

**Exemplo**:
```
/backend/.STATE
{
  "setup": "complete",
  "models": "complete", 
  "serializers": "complete",
  "views": "in_progress",
  "urls": "pending",
  "tests": "pending"
}
```

### 3. Development Log File
**Como funciona**:
- Arquivo markdown com log de todas as ações
- Cronológico com timestamps
- Pesquisável com grep

**Formato**:
```markdown
# Development Log

## 2026-04-14 15:30 - Phase 1: Backend Setup
- [✓] Django project created
- [✓] Settings configured
- [✓] Requirements.txt created
- [ ] Next: Implement models

## 2026-04-14 16:00 - Phase 2: Models
- In progress...
```

### 4. Session Management System
**Como funciona**:
- arquivo .SESSION com comando para restaurar
- Include prompt pre-formatado
- Um-liner para retomar

**Exemplo**:
```
/SESSION_RESTORE
```
Que executa automaticamente:
```
"Resumindo: implementando MVP da plataforma SH. Estou na Phase 2 implementando models. Arquivos já criados: listados abaixo. Próximo passo: views.py. Confirme se está correto."
```

## Best Practices Identificadas

### 1. Atomic Updates
- Salvar estado após CADA arquivo criado
- Não esperar até final da fase
- Facilita recuperação de erros

### 2. Decision Logging
- Registrar TODAS as decisões importantes
- Porquê da decisão
- Alternativas consideradas

### 3. Test Results Tracking
- Status de cada critério de sucesso
- Command usado para testar
- Output se houver erro

### 4. Quick Recovery Commands
- Comandos de 1 linha para retomar
- Diferente para cada modalidade
- Include contexto essencial apenas

## Implementação Recomendada: Sistema Híbrido

### 3 Files System:

1. **.CONTEXT.json** - Estado global principal
2. **.DEVELOPMENT.md** - Log detalhado
3. **.RESTORE** - Comando de 1 linha

### Fluxo de Uso:

1. **Antes de /clear**:
   ```bash
   python scripts/save_context.py
   ```

2. **Depois do /clear**:
   ```bash
   cat .RESTORE | pbcopy
   # Colar na nova conversa
   ```

3. **Durante implementação**:
   ```bash
   python scripts/update_context.py --action "created file" --path "models.py"
   ```

## Scripts de Apoio

### save_context.py
```python
import json
from datetime import datetime

def save_context(action, details):
    context = load_context()
    
    context['last_action'] = action
    context['last_action_time'] = datetime.now().isoformat()
    context['history'].append({
        'action': action,
        'details': details,
        'time': datetime.now().isoformat()
    })
    
    with open('.CONTEXT.json', 'w') as f:
        json.dump(context, f, indent=2)
```

### generate_restore.py
```python
def generate_restore_command():
    context = load_context()
    
    restore_cmd = f"""
# RESTAURAR CONTEXTO

## Projeto: {context['project']}
## Fase Atual: {context['current_phase']}
## Progresso: {context['progress']}%

## Última Ação: {context['last_action']}
## Próximo Passo: {context['next_step']}

## Arquivos Criados:
{chr(10).join(['- ' + f for f in context['completed_files']])}

## Decisões Importantes:
{chr(10).join(['- ' + d for d in context['decisions']])}

## Verificação Pendente:
{chr(10).join(['- [ ] ' + t for t in context['pending_tests']])}

## Comando para Continuar:
"Confirmo contexto. Implementando {context['next_step']} seguindo padrões estabelecidos."
"""
    
    with open('.RESTORE', 'w') as f:
        f.write(restore_cmd)
```

## Integração com Prompt Original

Adicionar ao final de PROMPT_IMPLEMENTACAO.md:

```markdown
## Gestão de Contexto Entre Conversas

### Salvar Progresso:
Ao final de CADA arquivo criado, execute:
```python
python scripts/save_context.py --action "created" --path "arquivo.py" --phase "2"
```

### Antes de usar /clear:
```bash
python scripts/save_full_context.py
```

### Para Restaurar:
Após /clear, cole o conteúdo de `.RESTORE`

### O que é salvo:
- Arquivos criados e modificados
- Decisões tomadas durante implementação
- Status dos testes
- Próximo passo a executar
- Erros encontrados e soluções
```

## Vantagens Desta Abordagem:

1. **Recuperação Rápida**: 1 comando para restaurar tudo
2. **Histórico Completo**: Nada se perde
3. **Flexibilidade**: Pula diretamente para onde parou
4. **Debugging**: Histórico de decisões ajuda a identificar problemas
5. **Colaboração**: Outra pessoa pode pegar onde você parou

## Alternativas Consideradas e Rejeitadas:

1. **Only Memory**: Fracassa com /clear
2. **Git Commits**: Muito verboso, difícil de extrair contexto
3. **Comments no Code**: Polui o código, hard to parse
4. **Database**: Overkill para este caso

## Recomendação Final:
Implementar o **3 Files System** (CONTEXT.json + DEVELOPMENT.md + RESTORE)
por ser o mais robusto, flexível e fácil de usar.