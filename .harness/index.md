# .harness/index.md — Índice Central do Bifrost
<!-- v1.4.0 -->

> Leia este arquivo PRIMEIRO. Carregue apenas o que tiver match com a tarefa.
> Regra: se não há match explícito, execute sem carregar directive extra.

---

## Como Usar

```
1. Leia as palavras-chave de cada linha
2. Identifique qual tem match com a tarefa atual
3. Carregue APENAS essa directive ou skill
4. Se nenhuma fizer match → execute sem carregar nada
```

---

## Directives

| Arquivo | Palavras-chave | Quando carregar |
|---------|---------------|----------------|
| `directives/DIRECTIVE-template.md` | template, criar directive | ao criar nova directive |
| `directives/health-check.md` | saúde, verificar, integridade, check | ao verificar o sistema |
| `directives/session-memory.md` | sessão, memória, contexto, handoff, retomar, parar, continuar | ao iniciar/encerrar sessão |
| `directives/context-management.md` | tokens, contexto, compressão, budget, economia, caro | ao gerenciar tokens |
| `directives/subagent-dispatch.md` | subagente, delegar, tarefa pesada, isolado, paralelo | tarefa > 20k tokens |
| `directives/observation-masking.md` | log longo, output longo, masking, placeholder, truncar | output > 20 linhas |
| `directives/harness-evolution.md` | evolução, hashimoto, melhoria, aprender, erro recorrente | ao melhorar o harness |
| `directives/diagnose.md` | diagnóstico, investigar, por que quebrou, debug sistemático | ao investigar falhas |
| `directives/spec-driven.md` | spec, especificação, requisitos, prd, antes de código | ao iniciar feature nova |

---

## Skills

| Arquivo | Palavras-chave | Quando carregar |
|---------|---------------|----------------|
| `.harness/skills/SKILL-template.md` | template, criar skill | ao criar nova skill |
| `.harness/skills/context7/SKILL.md` | biblioteca, API, documentação, versão, desatualizado, docs | antes de implementar com lib externa |

---

## Domínios

| Arquivo | Palavras-chave | Quando carregar |
|---------|---------------|----------------|
| `.harness/domains/saas.md` | frontend, UI, autenticação, JWT, produto web, componente | tarefas de produto web |
| `.harness/domains/api.md` | endpoint, API, REST, backend, rota, handler | tarefas de API |
| `.harness/domains/automation.md` | script, automação, batch, pipeline, ETL, agendamento | tarefas de automação |
| `.harness/domains/juridico-financeiro.md` | contrato, cláusula, LGPD, valor, pagamento, jurídico | tarefas jurídicas |

---

## Camada 2 — Orquestração (DOE)

| Arquivo | Quando usar |
|---------|------------|
| `.harness/doe/diretrizes.md` | ao configurar system prompt global |
| `.harness/doe/orquestracao.md` | ao montar prompt do planejador |
| `.harness/doe/execucao.md` | ao montar prompt de subagente |

---

## Regra de Manutenção

Ao criar nova directive, skill ou domínio:
1. Adicione uma linha na tabela acima com palavras-chave específicas
2. Commit: `harness(index): adicionar [nome]`
