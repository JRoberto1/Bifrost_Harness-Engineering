# .harness/tests/ — Regression Tests do Bifrost

Casos de teste que verificam se o Token Filter está funcionando corretamente.
Sem servidor. Sem framework. Markdown puro.

---

## Por que esses testes existem

O Token Filter pode errar nos dois sentidos:
- **Carregar demais** → contexto poluído → agente perde foco
- **Carregar de menos** → contexto insuficiente → agente toma decisões erradas

Cada caso de teste verifica **Precision** (não carregar o desnecessário)
E **Recall** (carregar o necessário). Os dois importam.

---

## Estrutura

```
.harness/tests/
├── README.md          ← este arquivo
├── context/           ← testes do Token Filter
│   ├── DS-001.md      ← Data Science: precision
│   ├── DS-002.md      ← Data Science: recall
│   ├── DEP-001.md     ← Deploy: precision
│   ├── DEP-002.md     ← Deploy: recall
│   └── SEC-001.md     ← Segurança: recall
├── directives/        ← testes de regras das directives
└── failures/          ← regression cases de erros passados
```

---

## Como Usar

Cole no agente para verificar um caso:

```
Leia .harness/tests/context/DS-001.md e verifique se o Token Filter
do .harness/index.md produziria o resultado esperado para aquela task.
```

---

## Formato de cada caso

```markdown
# Case: [ID] — [Nome]

Task: "[descrição da tarefa]"

DEVE carregar (Recall):
✅ arquivo-necessario.md

NÃO DEVE carregar (Precision):
❌ arquivo-desnecessario.md

Critério de sucesso:
Carregou tudo que precisa E não carregou o que não precisa.
```

---

## Quando Criar Novos Casos

Sempre que o Hashimoto identificar um erro de **Categoria C** (Context Overflow),
crie um regression case em `failures/` para garantir que o erro não se repita.
