# GEMINI.md — Bifrost Universal Harness
<!-- Runtime: Antigravity · Gemini CLI · OpenCode -->
<!-- Versão: 1.7.0 -->

> Leia este arquivo completamente antes de qualquer ação.
> Este arquivo é específico para Antigravity e runtimes baseados em Gemini.
> Para Claude Code use CLAUDE.md. Para qualquer runtime use AGENTS.md.

---

## Identidade

Você opera dentro de uma **arquitetura de 3 camadas**:

```
Camada 1 — directives/      → SOPs: o QUE fazer
                ↓
Camada 2 — .harness/pev/    → Protocolo PEV: PLAN → EXECUTE → VERIFY
            pev.md
                ↓
Camada 3 — execution/       → Scripts determinísticos: FAZ
```

---

## Hierarquia de Memória

```
L0 — GEMINI.md              → sempre presente · nunca descartar
L1 — .harness/index.md      → índice leve · sempre presente · nunca descartar
L2 — .harness/domains/      → domínios ativos · carregado sob demanda
L3 — directives/ · skills/  → carregado por match com a tarefa
L4 — memory/last-session.json → contexto da sessão · descartável após wrap-session
```

Quando o contexto apertar → descarte de L4 para L0, nunca o contrário.

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
- Modificar arquivos de configuração (`package.json`, `tsconfig.json`, etc.)
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
| Revisão | "revise X", "audit Y" | Carregue `directives/observation-masking.md` |

**Intenção não clara → pergunte antes de executar.**

---

## Protocolo PEV

```
PLAN    → critérios verificáveis antes de qualquer código
EXECUTE → dentro do plano aprovado
VERIFY  → falha = volta ao Plan com contexto de erro
```

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
| "Entendido, vou fazer..." | 6 | [execute] |

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
grep -n "gerarToken" src/services/auth.ts
head -50 src/services/auth.ts
```

### Observation Masking

```
[Logs omitidos — 847 linhas | Resultado: FALHA | Erro: timeout linha 42]
[Testes omitidos — 47 testes | Status: 46 PASS, 1 FALHA]
```

---

## Roteamento de Modelos (Gemini)

| Tarefa | Modelo recomendado |
|--------|-------------------|
| Tarefas mecânicas | Flash / Flash-Lite |
| Código e implementação | Pro (padrão) |
| Arquitetura e debugging | Pro (extended thinking) ou Ultra |

---

## Princípios Karpathy

1. Declare suposições antes de agir — nunca escolha silenciosamente
2. Código mínimo — nada especulativo. 200 linhas quando cabem 50? Reescreva.
3. Mudanças cirúrgicas — não melhore o que não está quebrado
4. Transforme tarefas em critérios verificáveis

---

## Viés do Avaliador

No `/review` e ao revisar qualquer código:
> Presuma que o código está errado até provar o contrário.
> Se não encontrou problema → revise de novo.
> Frase proibida: "O código parece correto."

---

## Memória de Sessão

Este runtime não tem comandos nativos de sessão. Use estes prompts manualmente:

**Ao iniciar:**
```
Execute: Leia .harness/memory/last-session.json e me dê um briefing
do estado anterior antes de qualquer ação.
```

**Ao encerrar:**
```
Execute: Leia directives/session-memory.md e salve o contexto atual
em .harness/memory/last-session.json seguindo o template da directive.
```

**Formato JSON:** salve em `.harness/memory/last-session.json` (schema: `docs/session-schema.md`)
**Compressão:** `python execution/compress-history.py --auto` após 8 turnos.

---

## Compressão de Histórico

Após 8 turnos:
```bash
python execution/compress-history.py --auto
```

---

## Context7 — Documentação Atualizada

Antes de implementar com qualquer biblioteca externa, verifique se a API está atualizada.

### Quando usar (seletivo — não use para tudo)

```
✅ USE: versão importa · primeira vez com a API · configuração/middleware/auth
❌ NÃO USE: operações básicas · bibliotecas nativas · já consultou nesta sessão
```

### Por runtime

**Claude Code / OpenCode / Cursor:**
```bash
ctx7 docs /vercel/next.js "middleware authentication"
ctx7 docs /prisma/prisma "one-to-many relations"
ctx7 docs /colinhacks/zod "form validation"
```

**Antigravity (sem suporte nativo):**
```
Busque a documentação oficial da versão [X] de [biblioteca]
sobre [tópico] antes de implementar.
```

Referência completa: `.harness/skills/context7/SKILL.md`

---

## Domínios Ativos

- [ ] SaaS Web              → `.harness/domains/saas.md`
- [ ] API / Backend         → `.harness/domains/api.md`
- [ ] Automação / Scripts   → `.harness/domains/automation.md`
- [ ] Jurídico / Financeiro → `.harness/domains/juridico-financeiro.md`

---

## Evolução do Harness

```
1. Corrija o código
2. Identifique onde o harness falhou
3. Atualize a directive correspondente
4. python execution/self-correction.py --auto
5. Commit: harness(tipo): descrição
```

Referência: `directives/harness-evolution.md`

---

*Bifrost v1.7.0 · runtime: Gemini / Antigravity*
