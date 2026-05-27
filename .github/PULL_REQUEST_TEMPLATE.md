## O que esta PR faz

<!-- Descreva a mudança em 1-2 frases -->

## Tipo de mudança

- [ ] Bug fix — corrige comportamento incorreto
- [ ] Nova directive — SOP adicionado ao harness
- [ ] Melhoria de script — build-harness, sync-harness ou similar
- [ ] Documentação — README, CONTRIBUTING, ou docs/
- [ ] CI/Infra — workflows, templates, configuração

## Checklist obrigatório

- [ ] `python scripts/build-harness.py --check` passa localmente
- [ ] `python scripts/sync-harness.py --check` passa localmente
- [ ] Se adicionei uma directive: frontmatter YAML completo incluído
- [ ] Se modifiquei AGENTS.md: rodei sync-harness.py para propagar
- [ ] Commit segue a convenção: `feat|fix|docs|harness(escopo): descrição`

## Tipo Hashimoto (se for bug fix)

<!-- Se esta PR corrige um bug, classifique:
A — Harness Miss | B — Directive Incompleta | C — Context Overflow
D — Hallucination | E — Permission Violation -->

## Referência

<!-- Issue relacionada: fixes #NNN -->
