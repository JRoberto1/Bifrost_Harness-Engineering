[![npm CLI](https://img.shields.io/npm/v/harness-engineering?style=flat-square&label=CLI&color=000)](https://www.npmjs.com/package/harness-engineering)
[![Harness](https://img.shields.io/badge/harness-v1.7.0-blue?style=flat-square)](https://github.com/JRoberto1/Bifrost_Harness-Engineering/releases/tag/v1.7.0)
[![CI](https://github.com/JRoberto1/Bifrost_Harness-Engineering/actions/workflows/harness-check.yml/badge.svg)](https://github.com/JRoberto1/Bifrost_Harness-Engineering/actions/workflows/harness-check.yml)
[![MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](https://github.com/JRoberto1/Bifrost_Harness-Engineering/blob/main/LICENSE)
[![runtimes](https://img.shields.io/badge/runtimes-Claude%20Code%20%7C%20Antigravity%20%7C%20OpenCode-green?style=flat-square)](#compatibilidade)

# 🌉 Bifrost — Harness Engineering

A ponte entre seus projetos e qualquer agente de IA.

---

## O Problema

Você dá uma tarefa ao Claude Code. Ele começa bem — lê arquivos, escreve código, parece produtivo.
Depois algo vai errado: pula um passo, quebra um teste, diz "feito" mas nada funciona.

Isso não é problema do modelo. É problema de harness.

> Mesmo modelo (Opus 4.5) · Mesmo prompt ("build a 2D retro game editor")
>
> ❌ Sem harness → $9 · 20 minutos · não funcionou
> ✅ Com harness → $200 · 6 horas · jogo jogável e funcional

O gargalo não é mais escrever código. É validar comportamento, capturar regressões, manter confiabilidade.

---

## O que é Bifrost

Na mitologia nórdica, Bifrost é a ponte que conecta todos os mundos.

```
Claude Code  ─────┐
Antigravity  ─────┼──── AGENTS.md ──── seu projeto
OpenCode     ─────┘     CLAUDE.md
                        GEMINI.md
```

Um harness. Qualquer runtime. Mesmas regras.

```
Prompt Engineering  →  você funciona
Context Engineering →  você é consistente
Harness Engineering →  você é confiável em produção
```

---

## Instalação

> Requisito: [Node.js 16+](https://nodejs.org)

```bash
npx harness-engineering
```

O instalador faz 4 perguntas e configura tudo em menos de 1 minuto.

**Outros comandos:**

```bash
# Verificar integridade do harness
npx harness-engineering check

# Ver métricas do projeto
npx harness-engineering stats

# Configurar auto-save de sessão (uma vez por computador)
npx harness-engineering setup-hooks
```

> Após configurar, `.harness/memory/last-session.json` é atualizado
> automaticamente a cada `git commit` em qualquer projeto com Bifrost.
> Funciona em Windows, Mac e Linux.

Exemplo de output do `stats`:
```
─────────────────────────────────
  Bifrost v1.7.0 — Stats
─────────────────────────────────
  Directives:     18 carregadas
  Runtime:        Claude Code (CLAUDE.md)
  Último sync:    2026-05-28
  Sessões:        3 registradas
  Harness:        ✓ íntegro
─────────────────────────────────
```

```bash
# Verificar se há versão nova disponível
npx harness-engineering upgrade
```

Exemplo de output do `upgrade`:
```
✓ Bifrost já está na versão mais recente (v2.0.3)
```

ou:
```
Nova versão disponível: v2.0.3 → v2.1.0
Para atualizar: npx harness-engineering@latest upgrade --force
⚠ O upgrade não sobrescreve customizações em directives/ e .harness/
```

---

## Duas versões, uma ferramenta

| | Harness | CLI |
|---|---|---|
| **O que é** | Arquivos copiados para seu projeto | Instalador e utilitários |
| **Versão atual** | v1.7.0 | v3.0.0 |
| **Onde vive** | Dentro do seu projeto | npm global |
| **Como atualizar** | `git pull` + `sync-harness.py` | `npx harness-engineering upgrade` |

O **harness** são os arquivos que definem as regras do agente —
`AGENTS.md`, `directives/`, `.harness/`, `scripts/`.
O **CLI** é o instalador que copia esses arquivos para o seu projeto
e oferece utilitários como `check`, `stats` e `upgrade`.

---

## Estrutura do Projeto

```
seu-projeto/
│
├── AGENTS.md               ← fonte canônica do harness
├── CLAUDE.md               ← gerado por sync-harness.py (Claude Code)
├── GEMINI.md               ← gerado por sync-harness.py (Antigravity)
│
├── directives/             ← Camada 1: SOPs — o QUE fazer
│   ├── session-memory.md
│   ├── context-management.md
│   ├── observation-masking.md
│   ├── subagent-dispatch.md
│   ├── harness-evolution.md    ← protocolo + taxonomia Hashimoto
│   ├── diagnose.md             ← investigação sistemática de falhas
│   └── health-check.md
│
├── execution/              ← Camada 3: scripts determinísticos
│   └── compress-history.py
│
├── scripts/                ← automação do harness
│   ├── build-harness.py        ← gera .harness/index.md
│   ├── sync-harness.py         ← propaga AGENTS.md → CLAUDE.md + GEMINI.md
│   └── overrides/
│       ├── claude-overrides.md
│       └── gemini-overrides.md
│
├── docs/
│   ├── architecture.md         ← diagrama das 3 camadas
│   └── session-schema.md       ← schema de memória entre sessões
│
├── .harness/
│   ├── index.md                ← lazy loading (auto-gerado)
│   ├── config.json             ← protected paths e quality gate
│   ├── memory/
│   │   ├── last-session.json   ← estado estruturado entre sessões
│   │   └── hashimoto-log.md    ← registro de erros → melhorias
│   └── domains/
│
└── .github/workflows/
    └── harness-check.yml       ← CI com 9 checks automáticos
```

---

## Como Usar

**Prompt universal para qualquer runtime:**

```
Leia AGENTS.md (ou CLAUDE.md / GEMINI.md) completamente antes de qualquer ação.
```

**Comandos Claude Code:**

```
/spec           → escreva a spec antes de qualquer código
/plan           → decomponha em tarefas verificáveis
/review         → quality gate com viés do avaliador
/ship           → checklist completo antes de deploy
/wrap-session   → encerra sessão e salva contexto
/brief-session  → retoma sessão (~500 tokens vs 20k+)
/context-check  → audita e comprime contexto
```

**Scripts de setup:**

```bash
bash scripts/init-project.sh      # inicializa harness em projeto novo
bash scripts/adopt-project.sh     # adota projeto existente
bash scripts/health-check.sh      # verifica saúde do harness
bash scripts/sync-harness.sh      # alternativa shell ao sync-harness.py
```

> Se Python estiver disponível, prefira:
> `python scripts/sync-harness.py` (mais completo — aplica overrides por runtime)

---

## Documentação

| Documento | Descrição |
|-----------|-----------|
| [Quickstart](docs/quickstart.md) | Instale e configure o Bifrost em 5 minutos |
| [FAQ](docs/faq.md) | Perguntas frequentes: Hashimoto, memória, CI, upgrades |
| [Arquitetura](docs/architecture.md) | Diagrama das 3 camadas e fluxo de decisão |
| [Session Schema](docs/session-schema.md) | Schema de memória entre sessões |
| [Exemplo Next.js](examples/nextjs-typescript/) | Harness real instalado em projeto Next.js 14 + TypeScript |

---

## Compatibilidade

| Runtime | Arquivo | SDLC | Memória | Tokens |
|---------|---------|------|---------|--------|
| Claude Code | `CLAUDE.md` | `/spec /plan /review /ship` | `/wrap-session` | `/context-check` |
| Antigravity | `GEMINI.md` | prompt direto | manual | script Python |
| OpenCode | `AGENTS.md` + `.opencode/instructions.md` | prompt direto | last-session.json | script Python |
| Cursor | `.cursorrules` | prompt direto | manual | — |

---

## Domínios

Harness não é só para código:

| Domínio | Componentes | Arquivo |
|---------|-------------|---------|
| SaaS Web | modelo + componentes + validação | `.harness/domains/saas.md` |
| API / Backend | modelo + esquemas + auditoria | `.harness/domains/api.md` |
| Automação | modelo + scripts + monitoramento | `.harness/domains/automation.md` |
| Jurídico / Financeiro | modelo + regras + conformidade | `.harness/domains/juridico-financeiro.md` |

---

## Princípios

1. Agente = Modelo + Harness
2. A Marcha dos Noves — o harness resolve o que o modelo não garante
3. Directives são documentos vivos — atualize sempre
4. Scripts determinísticos > agente improvisando
5. Verificador com contexto limpo
6. Sucesso silencioso, falha barulhenta
7. Hashimoto — cada erro melhora o harness
8. Memória persistente entre sessões
9. Contexto mínimo necessário
10. Modelo certo para cada tarefa
11. Intenção antes de execução (Intent Gate)
12. Spec antes de código
13. Ceticismo ativo no review (Viés do Avaliador)
14. Validação antes da ação (Três Tiers)

---

## Regra de Hashimoto

Quando o agente cometer um erro:

```
1. Classifique o tipo:
   A — Harness Miss         → trigger faltando no frontmatter da directive
   B — Directive Incompleta → SOP não cobriu o edge case
   C — Context Overflow     → janela cheia, compressão não acionada
   D — Hallucination        → regra de verificação fraca
   E — Permission Violation → tier de permissão ambíguo

2. Corrija no arquivo indicado pela taxonomia
3. Rode: python scripts/build-harness.py   (se Tipo A)
4. Rode: python scripts/sync-harness.py    (qualquer tipo)
5. Registre em: .harness/memory/hashimoto-log.md
6. Commit: harness(tipo-A): [descrição]
```

> Taxonomia completa em `directives/harness-evolution.md`

---

## Changelog

### Harness v1.7.0 — atual

- ✨ `directives/architecture.md` — ADRs e decisões arquiteturais
- ✨ `directives/onboarding.md` — integração de novos desenvolvedores
- ✨ `skills/performance-audit` — auditoria de performance web e API
- ✨ `skills/accessibility` — checklist WCAG 2.1 AA completo
- ✨ 16 directives total instaladas pelo CLI (era 14)

### CLI v2.9.0 — atual

- ✨ `directives/architecture.md` e `directives/onboarding.md` bundladas
- ✨ `skills/performance-audit` e `skills/accessibility` adicionadas

### Harness v1.6.0

- ✨ `directives/code-review.md` — protocolo de revisão em 5 camadas
- ✨ `directives/refactoring.md` — protocolo de refatoração segura
- ✨ `directives/mobile.md` — React Native e Flutter
- ✨ `directives/data-science.md` — análise reproduzível e ML

### Harness v1.5.0

- ✨ Sistema de skills funcional — instalar via `npx harness-engineering skill`
- ✨ 8+ skills reais incluídas no pacote npm
- ✨ `directives/testing.md` e `directives/deployment.md` bundladas
- ✨ Taxonomia Hashimoto — 5 tipos (A–E) com protocolo de correção

### Harness v1.4.0

- ✨ `GEMINI.md` reescrito com comandos corretos para Antigravity
- ✨ `docs/architecture.md` — diagrama das 3 camadas e fluxo de decisão
- ✨ `scripts/build-harness.py` — gera `.harness/index.md` automaticamente
- ✨ `scripts/sync-harness.py` — AGENTS.md vira fonte canônica
- ✨ Taxonomia Hashimoto — 5 tipos (A–E) com protocolo de correção
- ✨ `.harness/memory/last-session.json` — schema estruturado de sessão
- ✨ CI consolidado em `harness-check.yml` com 9 checks automáticos
- ✨ `.gitattributes` — line endings determinísticos Windows/Linux

### CLI v2.5.0

- 🐛 DOE → PEV em todos os harness files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `harness-template/`)
- 🐛 `harness-template/.harness/doe/` removido (3 arquivos órfãos)
- 🐛 `session-memory.md`: `last-session.md` → `last-session.json` em todos os locais
- 🐛 `context-management.md`: referência a `last-session.md` corrigida
- 🔧 `stats.js`: conta todas as directives `.md` (antes filtrava por frontmatter — mostrava 1 em vez de 8)

### CLI v2.4.0

- ✨ 8 directives reais instaladas pelo CLI (`session-memory`, `context-management`, `observation-masking`, `subagent-dispatch`, `harness-evolution`, `diagnose`, `health-check`, `spec-driven`)
- 🐛 `INDEX_MD` corrigido: seção "Camada 2 — DOE" removida, substituída por "Protocolo PEV" real
- 🔧 `bin/directives/` bundled no pacote npm — sem dependências externas
- 🔧 `harness-template/.harness/memory/last-session.md` renomeado para `.json`
- 🔧 `directives/spec-driven.md` e `office-hours.md` sincronizados entre root e harness-template

### CLI v2.3.0

- ✨ `upgrade --force` — aplica atualização local, preserva `AGENTS.md`, `directives/`, `.harness/memory/` e `docs/`
- ✨ `doctor` — diagnóstico completo do ambiente (Node.js, Python, Git, harness, arquivos, versão npm)
- 🔧 Entry point convertido para async IIFE (compatível com Node.js v24 CommonJS)
- 🔧 Comparação de versão semver sem `localeCompare` (sem dependências externas)

### CLI v2.2.0

- ✨ Comando `adopt` — detecta stack automaticamente e adota harness em projeto existente
- ✨ `detectStack()` — lê `package.json`, `next.config.*`, `vite.config.*`, `Cargo.toml`, `go.mod`, `pyproject.toml`
- 🔧 `writeHarnessFiles({name,desc,stack,domains,skipFiles=[]})` — extração de lógica de escrita do `cmdInstall`
- 🔧 `cmdCheck` corrigido: contagem de skills usa `.endsWith(".md")` (não `.isDirectory()`)

### CLI v2.1.0

- ✨ 8 skills reais de `antigravity-awesome-skills` (MIT) incluídas no pacote npm
- ✨ `fetchSkill` lê de `bin/skills/` local — sem dependências externas em runtime
- ✨ `skill --list` exibe descrições reais do frontmatter + árvore por bundle
- 🔧 `BUNDLES` corrigido: 4 bundles (essentials, saas, api, security) com skills reais
- 🔧 Skill instalada é escrita em `.harness/skills/<nome>.md` no projeto do usuário
- 🔧 `package.json` com campo `files` para incluir `bin/skills/` no publish

### CLI v2.0.5

- 🐛 Template do `AGENTS.md` e comandos `/wrap-session` `/brief-session` referenciavam `last-session.md` — corrigido para `last-session.json`
- 🔧 `harness-template/scripts/sync-mirrors.sh` renomeado para `sync-harness.sh` com header explicativo
- 🔧 `harness-template/directives/health-check.md` adicionado (estava faltando no template)
- ✨ `ROADMAP.md` — v1.5.0, v2.1.0, v1.6.0 com critérios de conclusão

### CLI v2.0.4

- 🐛 `readline` recriado em cada `ask()` pausava stdin — corrigido com canal bidirecional único

### CLI v2.0.3

- ✨ Comando `upgrade` — verifica e instrui atualização do CLI
- 🔧 `last-session.json` substituiu `last-session.md` no installer
- 🔧 `hashimoto-log.md` e `.gitattributes` adicionados ao installer
- 🔧 Next steps da welcome message atualizados

### CLI v2.0.2

- 🔒 Dependência externa `sickn33/antigravity-awesome-skills` removida
- 🔧 `VERSION` interno sincronizado com `package.json`

### CLI v2.0.1

- 🐛 `stats.js` ausente corrigido (`npx harness-engineering stats` funcionava)
- 🔧 OpenCode adicionado como runtime suportado
- 🔧 Repository URL corrigida para `Bifrost_Harness-Engineering`

### Harness v1.0.0 / CLI v1.x

- Estrutura base: DOE · PEV · 4 domínios de negócio
- Quality gate com pre-commit · Publicação npm

---

## Licença

MIT — use, modifique, distribua, contribua.
Contribua com skills: [bifrost-community-skills](https://github.com/JRoberto1/bifrost-community-skills)

---

## Atribuição

As skills incluídas no CLI são derivadas de
[antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills)
por sickn33 e contribuidores, licenciadas sob MIT.

---

[⭐ Star no GitHub](https://github.com/JRoberto1/Bifrost_Harness-Engineering) · [🐛 Issues](https://github.com/JRoberto1/Bifrost_Harness-Engineering/issues)
