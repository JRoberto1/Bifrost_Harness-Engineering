---
id: code-review
version: 1.0.0
triggers: ["review", "revisão", "revisar", "pr", "pull request", "code review", "feedback", "aprovação", "lgtm"]
domain: universal
estimated_tokens: 720
compatible_runtimes: [claude-code, antigravity, opencode, cursor]
last_updated: 2026-05-28
---

# Directive: Code Review

## Objetivo
Conduzir revisões de código sistemáticas que encontrem problemas reais
sem gerar ruído ou microgerenciar escolhas de estilo.

## Regra Fundamental

Uma revisão de código não é uma auditoria de estilo.
É uma verificação de corretude, segurança e manutenibilidade.
Comentários de estilo sem um linter configurado são desperdício de atenção.

## Protocolo de Revisão (5 camadas)

### Camada 1 — Corretude
O código faz o que deveria fazer?
- Lógica de negócio está correta?
- Edge cases cobertos (null, empty, overflow, timeout)?
- Erros tratados adequadamente?
- Testes cobrem os cenários críticos?

### Camada 2 — Segurança
O código introduz vulnerabilidades?
- Inputs validados antes de usar?
- Secrets fora do código?
- SQL/queries parametrizadas (sem interpolação direta)?
- Autenticação e autorização corretas?
- Dados sensíveis logados acidentalmente?

### Camada 3 — Performance
O código vai escalar?
- N+1 queries em loops?
- Operações O(n²) onde O(n log n) seria possível?
- Cache onde faz sentido?
- Operações pesadas bloqueando a thread principal?

### Camada 4 — Manutenibilidade
O próximo desenvolvedor vai entender?
- Nomes de variáveis e funções descritivos?
- Funções com mais de uma responsabilidade?
- Comentários explicam O QUÊ (não o óbvio) ou o PORQUÊ?
- Duplicação que deveria ser extraída?

### Camada 5 — Consistência
O código segue os padrões do projeto?
- Convenções de nomenclatura respeitadas?
- Estrutura de arquivos consistente?
- Padrões arquiteturais do projeto seguidos?

## Classificação de Comentários

Prefixe cada comentário com sua gravidade:

**[BLOQUEADOR]** — Deve ser corrigido antes do merge
Exemplo: bug, vulnerabilidade de segurança, quebra de contrato de API

**[SUGESTÃO]** — Melhoria recomendada, não obrigatória
Exemplo: extração de função, renomeação para clareza

**[NITPICK]** — Preferência pessoal, não bloqueia
Exemplo: ordem de imports, espaçamento (se não há linter)

**[DÚVIDA]** — Preciso entender antes de aprovar
Exemplo: "por que essa abordagem em vez de X?"

## Regras do Agente

- Nunca comente sobre estilo se existe um linter/formatter configurado —
  deixe a ferramenta fazer esse trabalho
- Máximo 10 comentários por PR — priorize os mais impactantes
- Cada comentário deve ter: o problema, o impacto, e uma sugestão
- Elogie o que está bem feito — revisão não é só crítica
- Se o PR está muito grande para revisar bem, diga isso antes de revisar

## Output Esperado

APROVAÇÃO: APROVADO | APROVADO COM SUGESTÕES | AGUARDA CORREÇÕES
BLOQUEADORES: [lista ou "nenhum"]
SUGESTÕES: [lista numerada]
DÚVIDAS: [lista ou "nenhuma"]

## Aprendizados
<!-- Atualize quando encontrar padrões de revisão recorrentes -->
- [data] [padrão identificado e solução aplicada]
