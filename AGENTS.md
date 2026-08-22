# AGENTS.md — Bifrost Universal Harness
<!-- Claude Code · Antigravity · OpenCode · Cursor · Copilot -->
<!-- Versão: 3.0.1 -->

> Leia este arquivo completamente antes de qualquer ação.
> Arquivo universal — lido por qualquer runtime.
> Claude Code: use CLAUDE.md · Antigravity: use GEMINI.md

---

## Os 5 Princípios Arquiteturais

> Toda nova feature passa pelo teste: "Respeita os 5 princípios?"
> Se não respeitar → provavelmente não entra.

**1. Runtime Agnostic**
Funciona em Claude Code, Antigravity, OpenCode, Cursor.
Mesmas regras. Qualquer runtime.

**2. Zero Infrastructure**
Sem servidor, banco, API ou serviço externo.
npx + Markdown + scripts locais. Nada mais.

**3. Minimum Sufficient Context**
Carregue o mínimo necessário — e suficiente.
Zero contexto também é erro. O objetivo é mínimo E suficiente.

**4. Deterministic Over Probabilistic**
Scripts determinísticos > agente improvisando.
Se existe um script, use o script.

**5. Failures Improve the Harness**
Falhas recorrentes geram aprendizado permanente.
Erros isolados: registrar e avaliar antes de virar regra.

---

## Regra Anti-Directive Hell

Antes de criar qualquer arquivo novo, pergunte:

```
→ É contexto?      → vai para .harness/index.md
→ É regra?         → vai para directive existente
→ É execução?      → vai para execution/
→ É memória?       → vai para .harness/memory/
→ É validação?     → vai para pre-commit ou validate_action.py
→ Não se encaixa?  → questione se é necessário
```

---

## Identidade

Você opera dentro de uma **arquitetura de 3 camadas**:

```
Camada 1 — directives/      → SOPs: o QUE fazer
                ↓
Camada 2 — .harness/doe/    → Orquestração: COMO o agente age
            diretrizes.md · orquestracao.md · execucao.md
                ↓
Camada 3 — execution/       → Scripts determinísticos: FAZ
```

---

## Hierarquia de Memória

```
L0 — AGENTS.md              → regras fixas · sempre presente · nunca descartar
L1 — .harness/index.md      → índice leve · sempre presente · nunca descartar
L2 — .harness/domains/      → domínios ativos · carregado sob demanda
L3 — directives/ · skills/  → carregado por match com a tarefa
L4 — memory/last-session.md → contexto da sessão · descartável após wrap-session
```

Quando o contexto apertar → descarte de L4 para L0, nunca o contrário.

---

## Dois Tipos de Memória — Nunca Confundir

### SESSION MEMORY
```
Arquivo:   .harness/memory/last-session.md
Propósito: temporário e contextual
Responde:  "Onde estávamos?"
Contém:    tarefa atual, decisões da sessão, próximos passos
Duração:   descartável após /wrap-session
```

### LEARNING MEMORY
```
Arquivo:   directives/harness-evolution.md
Propósito: permanente e acumulado
Responde:  "O que o Bifrost aprendeu?"
Contém:    falhas recorrentes, correções, regras melhoradas
Duração:   NUNCA descartado automaticamente
```

**Regras:**
1. Session memory NÃO vira Learning memory automaticamente
2. Erro isolado → registrar em session, avaliar antes de promover
3. Erro recorrente → Hashimoto → melhoria permanente → regression case
4. Classificação incerta → não alterar harness → aguardar revisão

---

## Três Tiers de Permissão

### ✅ PODE fazer sem pedir
- Ler qualquer arquivo do projeto
- Rodar testes (`npm test`, `pytest`, etc.)
- Gerar código em `src/`, `app/`, `components/`
- Criar arquivos em `directives/`, `docs/`, `execution/`
- Executar scripts com `--dry-run`
- Buscar informação na web
- Criar ou atualizar `claude-progress.txt`

### ⚠️ DEVE perguntar antes
- Deletar qualquer arquivo
- Modificar arquivos de configuração (`package.json`, `tsconfig.json`)
- Chamar APIs externas com efeitos colaterais (POST, PUT, DELETE)
- Instalar dependências (`npm install`, `pip install`)
- Modificar `.github/workflows/`
- Fazer commit ou push no git

### 🚫 NUNCA pode fazer
- Modificar arquivos em `protected_paths` do `.harness/config.json`
- Alterar `.env` ou qualquer arquivo de credenciais
- Apagar histórico do git (`git reset --hard`, `git push --force`)
- Modificar o próprio `AGENTS.md` sem instrução explícita

---

## Regras Absolutas

1. Nunca avance sem validar o output da etapa anterior
2. Nunca invente — marque `[VERIFICAR: motivo]`
3. Nunca quebre a arquitetura de `docs/architecture.md`
4. Verifique `execution/` antes de criar script novo
5. Nunca use `any` em TypeScript nem ignore erros
6. Aplique o Protocolo PEV em tarefas com 3+ arquivos
7. Aplique a Regra de Hashimoto: cada erro melhora o harness
8. Classifique a intenção antes de executar (Intent Gate)

---

## Intent Gate

| Intenção | Exemplos | Ação |
|----------|----------|------|
| Pesquisa | "o que é X?", "como funciona Y?" | Responda direto |
| Implementação | "crie X", "implemente Y" | Carregue directive + PEV |
| Investigação | "por que X quebrou?" | Carregue `directives/diagnose.md` |
| Correção | "corrija X", "fix Y" | Carregue directive + PEV + Hashimoto |
| Revisão | "revise X", "audit Y" | Carregue `agents/code-reviewer.md` |

**Intenção não clara → pergunte antes de executar.**

---

## Protocolo PEV

```
PLAN    → critérios verificáveis antes de qualquer código
EXECUTE → dentro do plano aprovado
VERIFY  → falha = volta ao Plan com contexto de erro
```

---

## Token Filter — Minimum Sufficient Context

O contexto certo, não o contexto todo.

```
TASK → INDEX → RELEVÂNCIA → CONTEXTO MÍNIMO SUFICIENTE → AGENTE
```

**Regra:** o padrão é carregar NADA.
O agente começa com contexto zero e adiciona só o que a tarefa prova que precisa.

**O Token Filter não apenas recomenda contexto — impede carregamento indiscriminado.**

Consulte: `.harness/index.md`

---

## Protocolo de Output Conciso

| Situação | Formato |
|----------|---------|
| Sucesso | Máximo 3 linhas |
| Falha | `ERRO:` / `CAUSA:` / `AÇÃO:` |
| Confirmação | "✓ feito" |
| Output longo | Use Observation Masking |

### Frases Proibidas

| Proibido | Tokens | Substituto |
|---------|--------|-----------|
| "Vou ser feliz em ajudar..." | 8 | [execute] |
| "O motivo pelo qual isto..." | 7 | [causa direta] |
| "Eu recomendaria que..." | 7 | [afirme] |
| "Claro, deixa eu ver isso" | 8 | [veja e responda] |
| "Ótima pergunta!" | 3 | [responda] |

---

## Lazy Loading de Directives

```
1. Leia .harness/index.md
2. Identifique directive com match
3. Carregue APENAS essa directive
4. Nenhum match → execute sem carregar extra
```

### Progressive Disclosure

```bash
# ❌ Não
cat src/services/auth.ts

# ✅ Sim
grep -n "função" src/services/auth.ts
head -50 src/services/auth.ts
```

### Observation Masking

```
[Logs omitidos — 847 linhas | Resultado: FALHA | Erro: timeout linha 42]
[Testes omitidos — 47 testes | Status: 46 PASS, 1 FALHA]
```

---

## Roteamento de Modelos

| Tarefa | Modelo |
|--------|--------|
| Docs, testes, formatação | Haiku / Flash |
| Código, implementação | Sonnet / Pro |
| Arquitetura, debugging | Opus / Pro longo |

---

## Princípios Karpathy

1. Declare suposições antes de agir — nunca escolha silenciosamente
2. Código mínimo — nada especulativo. 200 linhas quando cabem 50? Reescreva.
3. Mudanças cirúrgicas — não melhore o que não está quebrado
4. Transforme tarefas em critérios verificáveis

---

## Viés do Avaliador (no /review)

> Presuma que o código está errado até provar o contrário.
> Se não encontrou problema → revise de novo.
> Frase proibida: "O código parece correto."

---

## SupervisorAgent — Zero custo no caminho feliz

Ativa `directives/diagnose.md` automaticamente:

```
Gatilho 1 — Erro Explícito    → pare · diagnostique
Gatilho 2 — Anomalia          → pare · sinalize [ANOMALIA]
Gatilho 3 — Desvio do Plano   → pare · reporte · aguarde
```

---

## Context7 — Documentação Atualizada

Antes de implementar com qualquer biblioteca externa cuja versão importa:

**Claude Code / OpenCode / Cursor:**
```bash
ctx7 docs /vercel/next.js "middleware authentication"
ctx7 docs /prisma/prisma "relations"
```

**Antigravity:**
```
Busque a documentação oficial da versão [X] de [biblioteca] antes de implementar.
```

Quando usar: versão importa · primeira vez com a API · setup/config
Não usar: operações básicas · já consultou nesta sessão

---

## Regra de Hashimoto

```
Erro isolado:
  1. Corrija o código
  2. Registre em session memory
  3. Avalie antes de promover para learning memory

Erro recorrente:
  1. Classifique (A/B/C/D/E — ver directives/failure-taxonomy.md)
  2. Corrija o código
  3. Atualize a directive correspondente
  4. python execution/self-correction.py --auto
  5. Crie regression case em .harness/tests/
  6. Commit: harness(tipo): descrição
```

---

## Memória de Sessão

**Ao iniciar:** leia `.harness/memory/last-session.md` se existir.
**Ao encerrar:** salve contexto em `.harness/memory/last-session.md`.

**Claude Code:** `/wrap-session` e `/brief-session`
**Outros runtimes:** leia `directives/session-memory.md`

---

## Compressão de Histórico

Após 8 turnos:
```bash
python execution/compress-history.py --auto
```
Claude Code: `/context-check --compress`

---

## Domínios Ativos

- [ ] SaaS Web              → `.harness/domains/saas.md`
- [ ] API / Backend         → `.harness/domains/api.md`
- [ ] Automação / Scripts   → `.harness/domains/automation.md`
- [ ] Jurídico / Financeiro → `.harness/domains/juridico-financeiro.md`

---

## O que NÃO entra no Bifrost Core

Enquanto violar os princípios de zero infrastructure e minimum sufficient context:

```
✗ Banco de dados          ✗ Servidor Bifrost
✗ API central             ✗ Dashboard
✗ Telemetria externa      ✗ Vector database
✗ Harness Compiler        ✗ State Machine complexa
✗ Policy Engine enterprise ✗ Dezenas de novas directives
```

---

*Bifrost v2.6.0 — Universal*
