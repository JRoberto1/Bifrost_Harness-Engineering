# Changelog

Todas as mudanças notáveis neste projeto são documentadas aqui.
Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)

---

## [v1.7.0] — atual

### Adicionado
- Directive `architecture.md` — decisões arquiteturais e ADRs
- Directive `onboarding.md` — integrar novo desenvolvedor ao projeto
- Skill `performance-audit` — auditoria de performance web e API
- Skill `accessibility` — checklist WCAG 2.1 AA completo
- 16 directives total instaladas pelo CLI

---

## [v1.6.0]

### Adicionado
- Directive `code-review.md` — protocolo de revisão em 5 camadas
- Directive `refactoring.md` — protocolo de refatoração segura
- Directive `mobile.md` — suporte a React Native e Flutter
- Directive `data-science.md` — análise reproduzível e ML

---

## [v1.5.0]

### Adicionado
- Sistema de skills funcional — instalar via `npx harness-engineering skill`
- 8+ skills reais incluídas no pacote npm
- Directive `testing.md` — protocolos de TDD e cobertura mínima
- Directive `deployment.md` — checklist de deploy por plataforma
- Taxonomia Hashimoto — 5 tipos (A–E) com protocolo de correção
- Consolidação do Protocolo PEV em todos os arquivos (substituindo DOE em partes do projeto)
- Transição de `last-session.md` para `last-session.json`

---

## [v1.4.0]

### Adicionado
- Identidade **Bifrost** — nome e posicionamento definitivos
- `.harness/config.json` — protected/allowed paths configuráveis
- Arquitetura DOE completa: `diretrizes.md` · `orquestracao.md` · `execucao.md`
- Intent Gate — classifica intenção antes de executar (Pesquisa / Implementação / Investigação / Correção / Revisão)
- Ciclo SDLC completo: `/spec` `/plan` `/review` `/ship`
- Três Tiers de Permissão (PODE / DEVE PERGUNTAR / NUNCA)
- Hierarquia de Memória L0→L4 com lazy loading
- Viés do Avaliador no `/review` — postura cética por padrão
- `execution/validate_action.py` — validação programática dos 3 tiers
- `execution/handoff.py` — handoff estruturado para novo agente + WIP commits
- `execution/self-correction.py` — Hashimoto automático com `--open-pr`
- `execution/stats.js` — métricas de sessões e tokens (`npx harness-engineering stats`)
- Community Skills: Next.js, FastAPI, LGPD
- Agent Judge: `.harness/quality-gates/agent-judge.sh` — auditoria via Haiku
- Context7 integration — documentação atualizada de bibliotecas externas
- `directives/office-hours.md` — 6 perguntas de reframing antes de implementar
- SupervisorAgent: 3 gatilhos automáticos em `directives/diagnose.md`
- `claude-progress.txt` — progresso de features vinculado ao histórico de commits
- `scripts/sync-mirrors.sh` — sincroniza AGENTS.md → CLAUDE.md + GEMINI.md
- Princípios Karpathy formalizados
- `agents/code-reviewer.md` · `agents/security-auditor.md`

---

## [v1.2.0]

### Adicionado
- Lazy loading de directives via `.harness/index.md`
- Protocolo de Output Conciso — 3 formatos padrão (sucesso / falha / confirmação)
- Observation Masking — outputs longos como placeholders estruturados
- Progressive Disclosure — `grep` antes de `cat`
- Budget por tipo de tarefa (contexto e output máximos)
- `execution/compress-history.py --auto`
- `/context-check` para Claude Code
- Roteamento de Modelos por tipo de tarefa (Haiku / Sonnet / Opus)

---

## [v1.1.0]

### Adicionado
- Memória persistente entre sessões
- `/wrap-session` — encerra sessão e salva `last-session.md`
- `/brief-session` — retoma sessão com ~500 tokens em vez de 20k+

---

## [v1.0.0]

### Adicionado
- Estrutura base: DOE · PEV · 4 domínios de negócio
- Quality gate com pre-commit hook
- `AGENTS.md` · `CLAUDE.md` · `GEMINI.md` universais
- Publicação npm: `npx harness-engineering`
- Scripts: `init-project.sh` · `adopt-project.sh` · `health-check.sh`
- Template base `harness-template/` para novos projetos
