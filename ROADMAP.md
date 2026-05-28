# Bifrost — Roadmap

> Última atualização: 2026-05-28

## Estado atual — v1.5.0 (Harness) · v2.6.0 (CLI)

O harness está estável e testado. O CLI foi validado end-to-end.
Contribuições são bem-vindas nas áreas abaixo.

---

## ✅ v1.5.0 — Harness (concluído)

**Foco: Directives de qualidade + sistema de skills**

- [x] Sistema de skills funcional — instalar via `npx harness-engineering skill`
- [x] 8+ skills reais incluídas no pacote npm
- [x] Directive `testing.md` — protocolos de TDD e cobertura mínima
- [x] Directive `deployment.md` — checklist de deploy por plataforma
- [x] Taxonomia Hashimoto — 5 tipos (A–E) com protocolo de correção
- [x] Todos os arquivos atualizados: DOE removido, PEV consolidado, last-session.json

**Critério de conclusão:** ✓ 10 directives instaladas pelo CLI,
incluindo testing.md e deployment.md com protocolos acionáveis.

---

## ✅ v2.1.0–v2.6.0 — CLI (concluído)

**Foco: Fluxo de adoção em projetos existentes**

- [x] `npx harness-engineering adopt` — wizard para projetos existentes (v2.2.0)
- [x] `npx harness-engineering doctor` — diagnóstico completo do ambiente (v2.3.0)
- [x] `npx harness-engineering upgrade --force` — atualização preservando customizações (v2.3.0)
- [x] 8+ directives reais bundladas no pacote npm (v2.4.0)
- [x] DOE removido, PEV consolidado em todos os arquivos (v2.5.0)
- [x] `testing.md` e `deployment.md` — 10 directives total (v2.6.0)

---

## v1.6.0 — Harness (em progresso)

**Foco: Directives de qualidade de código**

- [x] Directive `code-review.md` — protocolo de revisão em 5 camadas ✓ Sprint 21
- [x] Directive `refactoring.md` — protocolo de refatoração segura ✓ Sprint 21
- [ ] Domínio `mobile.md` — React Native / Flutter
- [ ] Domínio `data-science.md` — Python, Jupyter, pandas

---

## v1.7.0 — Harness (futuro)

**Foco: Multi-agente e workflows paralelos**

- [ ] Directive `multi-agent.md` — coordenação entre agentes paralelos
- [ ] Protocolo de handoff entre sessões de runtimes diferentes
- [ ] Schema de sessão v2 com suporte a sub-tarefas e dependências
- [ ] Integração com GSD (get-shit-done) via harness compartilhado

---

## Contribuindo com o Roadmap

Tem uma ideia que não está aqui?
Abra uma [Discussion](https://github.com/JRoberto1/Bifrost_Harness-Engineering/discussions)
antes de abrir uma issue — assim alinhamos prioridade antes de implementar.

Para contribuir com itens já listados:
1. Comente na issue correspondente (ou crie uma)
2. Leia CONTRIBUTING.md
3. Abra um PR seguindo o PR template

---

## O que NÃO está no roadmap

- Suporte a modelos proprietários fechados (sem API pública)
- Interface web ou dashboard
- Banco de dados ou backend próprio

O Bifrost é e continuará sendo arquivos de texto + scripts leves.
A complexidade está no design, não na infraestrutura.
