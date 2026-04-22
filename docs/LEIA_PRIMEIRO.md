# Leia Primeiro - Instruções Mestre para IA

## Objetivo

Este arquivo é o ponto de entrada único para qualquer IA que vá trabalhar no projeto SH.
Leia este arquivo primeiro e depois siga apenas os documentos relevantes para a tarefa.

## Regra de Leitura

1. Leia este arquivo por completo.
2. Leia os índices do projeto por completo:
   - [docs/README.md](README.md)
   - [project-knowledge/README.md](../project-knowledge/README.md)
3. Depois leia somente os documentos que realmente ajudam na tarefa atual.
4. Em arquivos de estado e contexto, leia só o resumo atual e o bloco final mais recente.

## Documentos Que Normalmente Valem Leitura Completa

- [docs/1-research/PRD.md](1-research/PRD.md)
- [docs/2-specification/Spec.md](2-specification/Spec.md)
- [docs/2-specification/PROMPT_IMPLEMENTACAO.md](2-specification/PROMPT_IMPLEMENTACAO.md)
- [docs/3-guidelines/REGRAS_DESENVOLVIMENTO.md](3-guidelines/REGRAS_DESENVOLVIMENTO.md)
- [docs/3-guidelines/MENSAGEM_IA.md](3-guidelines/MENSAGEM_IA.md)
- Os documentos técnicos em `project-knowledge/technical/` quando a tarefa tocar na tecnologia correspondente
- O README específico da área onde a tarefa vai mexer, quando existir

## Documentos Que Devem Ser Lidos Só de Forma Seletiva

- [implementation/state/.CONTEXT.json](../implementation/state/.CONTEXT.json)
- [implementation/state/.DEVELOPMENT.md](../implementation/state/.DEVELOPMENT.md)
- [implementation/state/.RESTORE](../implementation/state/.RESTORE)
- Arquivos parecidos com `.context.json`, `.CONTEXT.json`, `.RESTORE` e `.DEVELOPMENT.md` em qualquer pasta de estado

### Como Ler Esses Arquivos

- `.CONTEXT.json`: leia os campos de resumo e, se necessário, os últimos itens de `history`
- `.DEVELOPMENT.md`: leia apenas o bloco mais recente ou as últimas linhas que mostram a ação atual
- `.RESTORE`: leia o cabeçalho de contexto, o próximo passo e o bloco final "Para Continuar"
- Se o arquivo for muito grande, ignore o histórico antigo e vá direto para o final

## Ordem Recomendada Para Tarefas de Implementação

1. Entender a tarefa
2. Ler este arquivo
3. Ler os índices de documentação
4. Ler os docs da fase atual
5. Ler os docs técnicos relevantes
6. Ler apenas o estado atual dos arquivos voláteis
7. Olhar o código mais próximo do comportamento
8. Fazer a menor alteração possível
9. Validar logo em seguida

## O Que Evitar

- Não ler o histórico inteiro de log/estado quando um resumo ou o final já resolvem
- Não abrir documentação irrelevante só por completude
- Não editar sem antes entender a doc mais próxima do problema
- Não confiar em memória antiga quando existir estado atual no projeto

## Regra Prática

Se a tarefa é pequena, leia só o mínimo necessário.
Se a tarefa é grande, aumente a leitura só nos docs diretamente relacionados.

## Frase de Início Sugerida

"Li o documento de entrada. Agora vou ler apenas os docs relevantes e o estado atual antes de agir."