# Lista de Bibliotecas com Referências Cruzadas

## Bibliotecas e Onde São Referenciadas:

| Biblioteca | Referenciada em: | Status |
|------------|-----------------|---------|
| Django REST Framework | ✅ Spec.md, PROMPT.md, MENSAGEM.md | Atualizado |
| JWT Authentication | ✅ Spec.md, PROMPT.md, MENSAGEM.md | Atualizado |
| Material UI | ✅ Spec.md, PROMPT.md, MENSAGEM.md | Atualizado |
| PostgreSQL | ✅ Spec.md (Deploy/Performance) | Parcial |
| Docker | ✅ Spec.md (Deploy) | Parcial |
| Redux Toolkit | ✅ Spec.md (State Management) | Parcial |
| Jest | ✅ Spec.md (Tests) | Parcial |
| Vercel | ✅ Spec.md (Deploy) | Parcial |
| GitHub Actions | ✅ Spec.md (Deploy/Segurança) | Parcial |
| ESLint | ❌ Não referenciado | Pendente |

## Arquivos Atualizados:

### ✅ docs/2-specification/Spec.md
- Referências para docs existentes (DRF, JWT, Material UI)
- Links para docs futuras (PostgreSQL, Docker, etc.)

### ✅ docs/2-specification/PROMPT_IMPLEMENTACAO.md
- NOTA obrigatória no topo sobre ler docs primeiro
- Referências a todas as bibliotecas

### ✅ docs/3-guidelines/MENSAGEM_IA.md
- Lista de docs obrigatórias antes de implementar

## Check de Consistência:

### Para cada biblioteca:
1. **[ ]** Está em Spec.md?
2. **[ ]** Está em PROMPT_IMPLEMENTACAO.md?
3. **[ ]** Está em MENSAGEM_IA.md?
4. **[ ]** O arquivo .md existe?
5. **[ ]** Links estão funcionando?

## Arquivos para Verificar:

### project-knowledge/technical/README.md
```
[ ] Atualizar lista de bibliotecas
[ ] Adicionar status das referências
```

### docs/README.md
```
[ ] Adicionar seção "Bibliotecas Técnicas"
[ ] Link para docs de bibliotecas
```

### project-knowledge/technical/libraries/README.md
```
[ ] Atualizar com novas libs
[ ] Adicionar check de referências
```

## Script de Verificação (futuro):
```bash
python scripts/check_lib_references.py
# Verifica se todas as bibliotecas estão referenciadas
```

## Prioridade de Atualização:

1. **URGENTE**: ESLint (não referenciada)
2. **ALTA**: PostgreSQL, Docker, Jest (referências parciais)
3. **MÉDIA**: Docs READMEs

## Comandos Rápidos:

### Para verificar manualmente:
```bash
grep -r "postgre" docs/ --include="*.md"
grep -r "docker" docs/ --include="*.md"
grep -r "jest" docs/ --include="*.md"
```

### Para verificar referências:
```bash
find docs/ -name "*.md" -exec grep -l "django-rest-framework.md" {} \;
```

---

**IMPORTANTE**: Cada nova biblioteca documentada DEVE ser referenciada em pelo menos 3 lugares:
1. Spec.md
2. PROMPT_IMPLEMENTACAO.md
3. MENSAGEM_IA.md