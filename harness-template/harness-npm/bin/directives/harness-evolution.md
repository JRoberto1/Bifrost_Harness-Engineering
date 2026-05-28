# Directive: Evolução do Harness (Bifrost)

## Objetivo
Protocolo formal de como o Bifrost melhora a si mesmo.
Cada falha encontrada é uma oportunidade de tornar o sistema mais forte.

## O Loop de Evolução

```
falha encontrada
      ↓
diagnosticar causa raiz (directives/diagnose.md)
      ↓
corrigir o código/output
      ↓
identificar onde o harness falhou em prevenir
      ↓
atualizar o harness (directive, domain, quality-gate, config)
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
| Regra absoluta nova | `AGENTS.md` → seção Regras Absolutas |
| Skill necessária | `npx harness-engineering skill [nome]` |
| Path que não devia ser tocado | `.harness/config.json` → `protected_paths` |
| Filler proibido novo | `AGENTS.md` → tabela Frases Proibidas |

## Formato do Commit de Evolução

```
harness(quality-gate): bloquear float em valores monetários
harness(domain): adicionar regra LGPD para dados de terceiros
harness(directive): criar SOP para geração de contratos PDF
harness(agent): adicionar Intent Gate para pesquisa vs implementação
harness(config): proteger pasta terraform/
```

## Intent Gate — Classifique Antes de Agir

| Intenção | Exemplos | Ação |
|----------|----------|------|
| **Pesquisa** | "o que é X?", "como funciona Y?" | Responda direto, sem carregar directives |
| **Implementação** | "crie X", "implemente Y" | Carregue directive + PEV |
| **Investigação** | "por que X quebrou?" | Carregue `directives/diagnose.md` |
| **Correção** | "corrija X", "fix Y" | Carregue directive + PEV + Hashimoto |
| **Revisão** | "revise X", "audit Y" | Carregue `directives/observation-masking.md` |

**Se a intenção não estiver clara → pergunte antes de executar.**

## Cadência

- **A cada erro:** aplicar Hashimoto imediatamente
- **A cada 5 sessões:** revisar `.harness/memory/` por padrões recorrentes
- **A cada nova feature:** verificar se novos domínios ou directives são necessários
- **A cada versão maior:** atualizar `.harness/VERSION` e o CHANGELOG do README

## Aprendizados Acumulados
<!-- Formato: [data] [versão] [o que foi aprendido] -->
- [2026-04-23] [v2.0.0] Sistema Bifrost iniciado com Sprints A+B+C+D completos
