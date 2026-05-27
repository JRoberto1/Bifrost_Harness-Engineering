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

## Aprendizados Acumulados
<!-- Atualize aqui a cada evolução do harness -->
<!-- Formato: [data] [versão] [o que foi aprendido] -->

- [2026-04-19] [v1.0.0] Sistema iniciado com estrutura base
