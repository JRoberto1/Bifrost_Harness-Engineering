# Contribuindo com o Bifrost

---

## Princípio antes de qualquer contribuição

> **Não adicionar complexidade antecipadamente.**
> Problema real → solução mínima → medir → observar → só então evoluir.

Toda contribuição deve responder: *"Respeita os 5 Princípios do Bifrost?"*

```
1. Runtime Agnostic       — funciona em qualquer runtime?
2. Zero Infrastructure    — não requer servidor/banco/API externa?
3. Minimum Sufficient Context — reduz ou mantém o contexto necessário?
4. Deterministic Over Probabilistic — prefere scripts a improviso?
5. Failures Improve the Harness — o erro vira regra permanente?
```

Se a resposta para qualquer um for "não" → provavelmente não entra no Core.

---

## Anti-Directive Hell

Antes de criar um arquivo novo, pergunte:

```
→ É contexto?   → vai para .harness/index.md
→ É regra?      → vai para directive existente
→ É execução?   → vai para execution/
→ É memória?    → vai para .harness/memory/
→ É validação?  → vai para pre-commit ou validate_action.py
→ Não encaixa?  → questione se é necessário
```

---

## Convenção de Commits

```
feat:     nova funcionalidade
fix:      correção de bug
harness:  melhoria no harness (regra, directive, processo)
context:  mudança no Token Filter ou .harness/index.md
memory:   mudança em session ou learning memory
runtime:  mudança em CLAUDE.md, GEMINI.md, AGENTS.md
docs:     documentação apenas
test:     regression cases em .harness/tests/
```

**Exemplos:**
```
feat: adicionar validate_action.py com três tiers
harness(B): directive spec-driven estava ambígua para APIs
context: index.md — adicionar domínio de data-science
memory: documentar distinção SESSION ≠ LEARNING
runtime: GEMINI.md — alternativa web search para Context7
```

---

## Como Contribuir com uma Community Skill

1. Crie `community-skills/skills/[nome]/SKILL.md`
2. Siga o formato do template em `community-skills/README.md`
3. A skill deve ser testada em projeto real antes do PR
4. Sem dependências externas — zero infra, só Markdown
5. Um PR por skill

---

## O que NÃO entra no Bifrost Core

```
✗ Banco de dados          → viola Zero Infrastructure
✗ Servidor Bifrost        → viola Zero Infrastructure
✗ API central             → viola Zero Infrastructure
✗ Dashboard               → viola Zero Infrastructure
✗ Telemetria externa      → viola Zero Infrastructure
✗ Vector database         → viola Zero Infrastructure
✗ Harness Compiler        → complexidade antecipada
✗ State Machine complexa  → complexidade antecipada
✗ Dezenas de directives   → Directive Hell
```

Essas features não entram no **Core** enquanto violarem os princípios.
Extensões futuras (`bifrost-enterprise`, `bifrost-cloud`) podem abordá-las.

---

## Processo de Pull Request

1. Fork + branch: `feat/nome` ou `fix/nome` ou `harness/nome`
2. Descreva o problema real que resolve (não a feature em si)
3. Mostre que respeita os 5 Princípios
4. Se adiciona directive: justifique pela Anti-Directive Hell rule
5. Se adiciona script: inclua `--dry-run` e output JSON
6. Se muda o Token Filter: crie regression case em `.harness/tests/`

---

*Bifrost — pequeno, portátil, local, agnóstico ao runtime, instalável em segundos.*
