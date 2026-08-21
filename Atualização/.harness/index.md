# .harness/index.md — Bifrost Context Index
<!-- Versão: 2.6.0 -->

## REGRA FUNDAMENTAL — Token Filter

**Default = não carregar nada.**

O agente começa com contexto zero e adiciona **apenas** o que a tarefa
prova que precisa. O Token Filter não apenas recomenda contexto —
ele impede carregamento indiscriminado.

```
TASK → INDEX → RELEVÂNCIA → CONTEXTO MÍNIMO SUFICIENTE → AGENTE
```

Objetivo: **Minimum Sufficient Context** — mínimo E suficiente.
Zero contexto também é erro. Contexto demais também é erro.

---

## Directives — Quando Carregar

### Session Memory
```
Use quando: início/fim de sessão, retomar trabalho, salvar contexto
Não usar: tarefas simples sem histórico relevante
Carrega: directives/session-memory.md
```

### Context Management
```
Use quando: contexto > 8 turnos, janela ficando grande, compressão necessária
Não usar: sessões curtas e focadas
Carrega: directives/context-management.md
```

### Observation Masking
```
Use quando: outputs longos (logs, testes, builds), revisão de código grande
Não usar: outputs curtos e diretos
Carrega: directives/observation-masking.md
```

### Subagent Dispatch
```
Use quando: tarefa > 20k tokens estimados, tarefa independente do contexto atual
Não usar: tarefas que dependem do contexto da sessão atual
Carrega: directives/subagent-dispatch.md
```

### Harness Evolution
```
Use quando: encontrou erro recorrente, quer melhorar o harness, aplicar Hashimoto
Não usar: erros isolados que não se repetem
Carrega: directives/harness-evolution.md
```

### Diagnose (SupervisorAgent)
```
Use quando: ERRO EXPLÍCITO · ANOMALIA DE COMPORTAMENTO · DESVIO DO PLANO
Ativar automaticamente — não espere instrução do usuário
Carrega: directives/diagnose.md
```

### Spec-Driven
```
Use quando: feature nova, tarefa de implementação com 3+ arquivos
Não usar: correções simples, tarefas de 1 arquivo
Carrega: directives/spec-driven.md
```

### Office Hours
```
Use quando: feature nova significativa, escopo não está claro,
            solução proposta parece óbvia demais, início de sprint
Não usar: correções conhecidas, tarefas com escopo claro
Carrega: directives/office-hours.md
```

---

## Skills — Quando Carregar

### Context7
```
Use quando: biblioteca externa, versão importa, primeira vez com a API,
            configuração/middleware/auth
Não usar: operações básicas, bibliotecas nativas, já consultou nesta sessão
Carrega: .harness/skills/context7/SKILL.md
```

---

## Domínios — Quando Carregar

### SaaS Web
```
Use quando: produto web, autenticação, JWT, UI, React, Next.js
Carrega: .harness/domains/saas.md
```

### API / Backend
```
Use quando: endpoints, REST, GraphQL, backend, rotas
Carrega: .harness/domains/api.md
```

### Automação / Scripts
```
Use quando: scripts, ETL, pipelines, automação, cron
Carrega: .harness/domains/automation.md
```

### Jurídico / Financeiro
```
Use quando: contratos, LGPD, valores monetários, compliance
Carrega: .harness/domains/juridico-financeiro.md
```

---

## Agents — Quando Carregar

### Code Reviewer
```
Use quando: /review, pull request, antes de merge, quality gate
Postura: cético — presuma que o código está errado até provar o contrário
Carrega: agents/code-reviewer.md
```

### Security Auditor
```
Use quando: feature com auth, dados sensíveis, endpoints públicos, LGPD
Carrega: agents/security-auditor.md
```

---

## Regression Tests — Verificação do Token Filter

Casos de teste em `.harness/tests/context/` verificam se o Token Filter
está carregando o contexto certo (não demais, não de menos).

```bash
# Para verificar manualmente:
cat .harness/tests/context/DS-001.md
cat .harness/tests/context/DEP-001.md
```

---

## Tabela de Decisão Rápida

| A tarefa envolve... | Carregue |
|---------------------|---------|
| Início/fim de sessão | session-memory.md |
| Feature nova com 3+ arquivos | spec-driven.md |
| Erro ou anomalia | diagnose.md |
| Erro recorrente | harness-evolution.md |
| Revisão de código | code-reviewer.md |
| Biblioteca externa nova | context7/SKILL.md |
| Dados sensíveis ou auth | security-auditor.md |
| Contexto > 8 turnos | context-management.md |
| Nenhum dos acima | **não carregue nada extra** |
