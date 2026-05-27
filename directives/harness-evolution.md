---
id: harness-evolution
version: 1.0.0
triggers: ["erro", "bug", "hashimoto", "melhoria", "evoluir harness", "atualizar directive"]
domain: universal
estimated_tokens: 500
compatible_runtimes: [claude-code, antigravity, opencode, cursor]
last_updated: 2026-05-27
---

# Directive: Evolução do Harness

## Objetivo
Protocolo formal de como o Bifrost melhora a si mesmo.
Cada falha encontrada é uma oportunidade de tornar o harness mais forte.

## O Loop de Evolução

```
falha encontrada
      ↓
diagnosticar causa raiz
      ↓
corrigir o código/output
      ↓
identificar onde o harness falhou em prevenir
      ↓
atualizar o harness (directive, domain, quality-gate)
      ↓
commit: harness(tipo): descrição
      ↓
harness mais forte
```

## Onde Registrar Cada Tipo de Aprendizado

| Tipo de falha | Onde atualizar |
|---------------|---------------|
| Regra de negócio nova | `.harness/domains/[domínio].md` |
| Padrão de código proibido | `.harness/quality-gates/pre-commit` |
| Procedimento que faltava | `directives/[nova-directive].md` |
| Regra absoluta nova | `AGENTS.md` seção de Regras Absolutas |
| Skill que faltava | `npx harness-engineering skill [nome]` |
| Path que não devia ser tocado | `.harness/config.json` → `protected_paths` |

## Formato do Commit de Evolução

```
harness(quality-gate): bloquear float em valores monetários
harness(domain): adicionar regra LGPD para dados de terceiros
harness(directive): criar SOP para geração de contratos PDF
harness(agent): adicionar regra de classificação de intenção
```

## Cadência Recomendada

- **A cada erro encontrado**: aplicar imediatamente (Hashimoto)
- **A cada 5 sessões**: revisar `.harness/memory/` por padrões recorrentes
- **A cada nova feature**: verificar se novos domínios ou directives são necessários
- **A cada versão**: atualizar o CHANGELOG e incrementar `.harness/VERSION`

## Classificação de Intenção (Intent Gate)

Antes de executar qualquer tarefa, classifique:

| Intenção | Exemplos | Directive a carregar |
|----------|----------|---------------------|
| **Pesquisa** | "o que é X?", "como funciona Y?" | nenhuma — só responder |
| **Implementação** | "crie X", "implemente Y" | directive do domínio |
| **Investigação** | "por que X está quebrando?" | `directives/diagnose.md` |
| **Correção** | "corrija X", "fix Y" | directive do domínio + PEV |
| **Revisão** | "revise X", "audit Y" | `directives/observation-masking.md` |

**Se a intenção não estiver clara → pergunte antes de executar.**

## Taxonomia de Erros — Onde Corrigir

Classifique o erro antes de aplicar Hashimoto. Cada tipo tem
um arquivo de correção diferente.

| Tipo | Sintoma | Causa Provável | Onde Corrigir |
|------|---------|----------------|---------------|
| **A — Harness Miss** | Agente executou sem carregar a directive certa | Triggers insuficientes no frontmatter | `directives/<nome>.md` → adicionar trigger · regenerar index |
| **B — Directive Incompleta** | Directive foi carregada mas não cobriu o edge case | SOP não previu o cenário | `directives/<nome>.md` → adicionar edge case ou step |
| **C — Context Overflow** | Agente perdeu contexto no meio da tarefa | Janela cheia, compressão não acionada | `execution/compress-history.py` → ajustar threshold · verificar budget table |
| **D — Hallucination** | Agente inventou sem marcar [VERIFICAR] | Regra de verificação fraca | `AGENTS.md` → reforçar regra de verificação · adicionar ao quality gate |
| **E — Permission Violation** | Agente executou ação sem autorização do tier correto | Tier de permissão ambíguo | `AGENTS.md` → clarificar o tier · adicionar exemplo ao caso limítrofe |

## Protocolo de Aplicação

1. Identifique o tipo (A, B, C, D ou E)
2. Corrija no arquivo indicado pela coluna "Onde Corrigir"
3. Se for Tipo A → rode `python scripts/build-harness.py` para regenerar o index
4. Se for qualquer tipo → rode `python scripts/sync-harness.py` para propagar
5. Commit com prefixo: `harness(tipo-A):`, `harness(tipo-B):` etc.
6. Adicione o caso ao log: `.harness/memory/hashimoto-log.md`

## Aprendizados Acumulados
<!-- Atualize aqui a cada evolução do harness -->
<!-- Formato: [data] [versão] [o que foi aprendido] -->

- [2026-04-19] [v1.0.0] Sistema iniciado com estrutura base
