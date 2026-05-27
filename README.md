[![npm](https://img.shields.io/npm/v/harness-engineering?style=flat-square&color=000)](https://www.npmjs.com/package/harness-engineering) [![MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE) [![v1.4.0](https://img.shields.io/badge/versão-1.4.0-purple?style=flat-square)](#changelog) [![runtimes](https://img.shields.io/badge/runtimes-Claude%20Code%20%7C%20Antigravity%20%7C%20OpenCode-green?style=flat-square)](#compatibilidade)

# Bifrost

**O Sistema Operacional para Agentes de IA.**
Um harness de engenharia que torna agentes de IA confiáveis em produção.

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

```bash
npx harness-engineering
npx harness-engineering check                       # verifica integridade
npx harness-engineering stats                       # métricas de sessões e tokens
npx harness-engineering skill --bundle essentials   # instala skills essenciais
npx harness-engineering skill --list                # ver todas disponíveis
```

---

## Estrutura do Projeto

```
.
├── AGENTS.md              # Instrução universal — qualquer runtime
├── CLAUDE.md              # Instrução específica para Claude Code
├── GEMINI.md              # Instrução específica para Antigravity/Gemini
├── .env.example           # Template de variáveis de ambiente
│
├── .harness/              # Orquestração interna do harness
│   ├── index.md           # Índice de directives (L1 da hierarquia)
│   ├── VERSION            # Versão canônica do harness
│   ├── config.json        # Paths protegidos e permitidos
│   ├── doe/               # Diretrizes · Orquestração · Execução
│   ├── domains/           # Regras por domínio de negócio
│   ├── pev/               # Protocolo Plan-Execute-Verify
│   ├── quality-gates/     # Pre-commit · Agent Judge
│   └── skills/            # Skills instaladas
│
├── directives/            # SOPs — o QUE o agente deve fazer
├── execution/             # Scripts determinísticos — FAZ de forma confiável
├── docs/                  # Arquitetura e documentação do projeto
├── scripts/               # Utilitários: init, adopt, health-check
├── harness-template/      # Template base para novos projetos
└── community-skills/      # Skills contribuídas pela comunidade
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
```

---

## Compatibilidade

| Runtime | Arquivo | SDLC | Memória | Tokens |
|---------|---------|------|---------|--------|
| Claude Code | `CLAUDE.md` | `/spec /plan /review /ship` | `/wrap-session` | `/context-check` |
| Antigravity | `GEMINI.md` | prompt direto | manual | script Python |
| OpenCode | `AGENTS.md` | prompt direto | manual | script Python |
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

## Changelog

### v1.4.0 — atual
- Identidade Bifrost · `.harness/config.json` · protected/allowed paths
- Arquitetura DOE completa (`diretrizes.md` · `orquestracao.md` · `execucao.md`)
- Intent Gate · SDLC completo (`/spec` `/plan` `/review` `/ship`)
- Três Tiers de Permissão · Hierarquia de Memória L0→L4
- Viés do Avaliador · `execution/validate_action.py`
- `execution/handoff.py` · `execution/self-correction.py --open-pr`
- Community Skills (Next.js, FastAPI, LGPD) · Agent Judge · Context7

### v1.2.0
- Lazy loading de directives via `.harness/index.md`
- Output conciso · Observation Masking · Progressive Disclosure
- `execution/compress-history.py` · `/context-check`

### v1.0.0
- Estrutura base: DOE · PEV · 4 domínios de negócio
- Quality gate com pre-commit · Publicação npm

---

## Licença

MIT — use, modifique, distribua, contribua.
Contribua com skills: [bifrost-community-skills](https://github.com/JRoberto1/bifrost-community-skills)
