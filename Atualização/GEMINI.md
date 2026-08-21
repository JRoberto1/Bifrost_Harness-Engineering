# GEMINI.md — Bifrost Universal Harness
<!-- Runtime: Antigravity · Gemini CLI · OpenCode -->
<!-- Versão: 2.6.0 -->

> Leia este arquivo antes de qualquer ação.
> Específico para Antigravity e runtimes Gemini.
> Claude Code: use CLAUDE.md · Universal: use AGENTS.md

---

## Os 5 Princípios Arquiteturais

**1. Runtime Agnostic** — funciona em qualquer runtime
**2. Zero Infrastructure** — sem servidor, banco ou serviço externo
**3. Minimum Sufficient Context** — mínimo E suficiente (zero também é erro)
**4. Deterministic Over Probabilistic** — scripts > improviso
**5. Failures Improve the Harness** — falhas recorrentes viram regras permanentes

---

## Regra Anti-Directive Hell

```
→ É contexto?   → .harness/index.md
→ É regra?      → directive existente
→ É execução?   → execution/
→ É memória?    → .harness/memory/
→ É validação?  → pre-commit ou validate_action.py
→ Não encaixa?  → questione se é necessário
```

---

## Identidade

Você opera no **Antigravity** dentro do sistema Bifrost.

```
Camada 1 — directives/   → SOPs: o QUE fazer
                ↓
Camada 2 — .harness/doe/ → Orquestração: COMO agir
                ↓
Camada 3 — execution/    → Scripts: FAZ de forma confiável
```

---

## Hierarquia de Memória

```
L0 — GEMINI.md              → sempre presente · nunca descartar
L1 — .harness/index.md      → sempre presente · nunca descartar
L2 — .harness/domains/      → sob demanda
L3 — directives/ · skills/  → por match
L4 — memory/last-session.md → descartável após encerramento
```

---

## Dois Tipos de Memória

```
SESSION  → last-session.md      → temporário · "onde estávamos?"
LEARNING → harness-evolution.md → permanente · "o que aprendemos?"

REGRA: Session NÃO vira Learning automaticamente.
```

---

## Três Tiers de Permissão

### ✅ PODE sem pedir
Ler arquivos · rodar testes · gerar código · criar em directives/ execution/ · `--dry-run` · atualizar `claude-progress.txt`

### ⚠️ PERGUNTAR antes
Deletar arquivos · modificar configs · APIs externas POST/PUT/DELETE · instalar deps · git commit/push

### 🚫 NUNCA
`protected_paths` · `.env` · `git reset --hard` · `git push --force`

---

## Regras Absolutas

1. Nunca avance sem validar etapa anterior
2. Nunca invente — marque `[VERIFICAR: motivo]`
3. Verifique `execution/` antes de criar script novo
4. Aplique PEV em tarefas com 3+ arquivos
5. Aplique Hashimoto: cada erro melhora o harness
6. Classifique intenção antes de executar (Intent Gate)

---

## Intent Gate

| Intenção | Ação |
|----------|------|
| Pesquisa | Responda direto |
| Implementação | Directive + PEV |
| Investigação | `directives/diagnose.md` |
| Correção | Directive + PEV + Hashimoto |

**Intenção não clara → pergunte antes de executar.**

---

## Protocolo PEV

```
PLAN    → critérios verificáveis antes de qualquer código
EXECUTE → dentro do plano aprovado
VERIFY  → máximo 3 linhas · falha = volta ao Plan
```

---

## Token Filter

```
TASK → INDEX → RELEVÂNCIA → CONTEXTO MÍNIMO SUFICIENTE → AGENTE
```

Padrão: **carregar nada**. Adicione só o que a tarefa prova que precisa.
Consulte: `.harness/index.md`

---

## Documentação Atualizada (alternativa ao Context7)

O Antigravity não tem suporte nativo ao Context7.
Use a busca web integrada:

```
Antes de implementar com [biblioteca] versão [X]:
Busque: "[biblioteca] [versão] [tópico] site:docs.[biblioteca].com"

Exemplo:
"Next.js 15 middleware authentication site:nextjs.org"
```

Ou rode no terminal e cole o resultado:
```bash
npx ctx7 docs /vercel/next.js "middleware" --no-install
```

---

## Roteamento de Modelos (Gemini)

| Tarefa | Modelo |
|--------|--------|
| Docs, testes | Gemini Flash |
| Código | Gemini Pro |
| Arquitetura | Gemini Pro (contexto longo) |

---

## Memória de Sessão (sem slash commands)

**Ao encerrar:**
```
Leia directives/session-memory.md e salve o contexto atual
em .harness/memory/last-session.md seguindo o template da directive.
```

**Ao iniciar:**
```
Leia .harness/memory/last-session.md e me dê um briefing
resumido antes de qualquer ação.
```

**Features longas:**
```bash
python execution/handoff.py --wip --tema "nome-feature"
python execution/handoff.py --restore
```

---

## SDLC no Antigravity (prompts diretos)

```
# /spec equivalente
Leia directives/spec-driven.md e crie uma spec para [feature].

# /plan equivalente
Leia .harness/index.md e decomponha [feature] em tarefas verificáveis.

# /review equivalente
Leia agents/code-reviewer.md e revise com postura cética.

# /ship equivalente
Verifique o checklist em .claude/commands/ship.md antes do deploy.
```

---

## Compressão de Histórico

Após 8 turnos:
```bash
python execution/compress-history.py --auto
```

Ou manualmente:
```
Resuma o histórico mantendo: decisões tomadas, estado atual, próximos passos.
Salve em .harness/memory/last-session.md.
```

---

## Princípios Karpathy

1. Declare suposições antes de agir
2. Código mínimo — nada especulativo
3. Mudanças cirúrgicas — toque só o que deve
4. Transforme tarefas em critérios verificáveis

---

## Domínios Ativos

- [ ] SaaS Web              → `.harness/domains/saas.md`
- [ ] API / Backend         → `.harness/domains/api.md`
- [ ] Automação / Scripts   → `.harness/domains/automation.md`
- [ ] Jurídico / Financeiro → `.harness/domains/juridico-financeiro.md`

---

## O que NÃO entra no Bifrost Core

```
✗ Banco de dados  ✗ Servidor  ✗ API central  ✗ Dashboard
✗ Telemetria externa  ✗ Vector database  ✗ Harness Compiler
```

---

*Bifrost v2.6.0 — Antigravity / Gemini*
