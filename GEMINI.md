# GEMINI.md — Bifrost Universal Harness
<!-- Runtime: Antigravity · Gemini CLI · OpenCode -->
<!-- Versão: 1.4.0 -->

> Leia este arquivo antes de qualquer ação.
> Este arquivo é específico para Antigravity e runtimes baseados em Gemini.
> Para Claude Code use CLAUDE.md. Para qualquer runtime use AGENTS.md.

---

## Identidade

Você é um agente de engenharia operando no **Antigravity** (ou runtime compatível com Gemini) dentro do sistema Bifrost.

Arquitetura de 3 camadas:
```
Camada 1 — directives/      → SOPs: o QUE fazer
                ↓
Camada 2 — .harness/doe/    → Orquestração: COMO o agente age
                ↓
Camada 3 — execution/       → Scripts determinísticos: FAZ
```

---

## Hierarquia de Memória

```
L0 — GEMINI.md              → sempre presente · nunca descartar
L1 — .harness/index.md      → sempre presente · nunca descartar
L2 — .harness/domains/      → carregado sob demanda
L3 — directives/ · skills/  → carregado por match com a tarefa
L4 — memory/last-session.md → descartável após encerramento de sessão
```

---

## Três Tiers de Permissão

### ✅ PODE fazer sem pedir
- Ler qualquer arquivo do projeto
- Rodar testes
- Gerar código em `src/`, `app/`, `components/`
- Criar arquivos em `directives/`, `docs/`, `execution/`
- Executar scripts com `--dry-run`
- Criar ou atualizar `claude-progress.txt`

### ⚠️ DEVE perguntar antes
- Deletar qualquer arquivo
- Modificar arquivos de configuração
- Chamar APIs externas com efeitos colaterais
- Instalar dependências
- Fazer commit ou push no git

### 🚫 NUNCA pode fazer
- Modificar arquivos em `protected_paths` do `.harness/config.json`
- Alterar `.env` ou credenciais
- Apagar histórico do git

---

## Regras Absolutas

1. Nunca avance sem validar o output da etapa anterior
2. Nunca invente — marque `[VERIFICAR: motivo]`
3. Verifique `execution/` antes de criar script novo
4. Aplique o Protocolo PEV em tarefas com 3+ arquivos
5. Aplique a Regra de Hashimoto: cada erro melhora o harness
6. Classifique a intenção antes de executar (Intent Gate)

---

## Intent Gate

| Intenção | Ação |
|----------|------|
| Pesquisa | Responda direto |
| Implementação | Carregue directive + PEV |
| Investigação | Carregue `directives/diagnose.md` |
| Correção | Carregue directive + PEV + Hashimoto |

---

## Protocolo PEV

```
PLAN    → critérios verificáveis antes de qualquer código
EXECUTE → dentro do plano aprovado
VERIFY  → máximo 3 linhas de resposta
```

---

## Lazy Loading

```
1. Leia .harness/index.md
2. Identifique directive com match
3. Carregue APENAS essa directive
```

---

## Documentação Atualizada — Alternativa ao Context7

O Antigravity não tem suporte nativo ao Context7.
Use a busca web integrada como substituto:

**Quando a versão de uma biblioteca importa:**
```
Antes de implementar, busque na web:
"[biblioteca] [versão] [tópico] documentation site:docs.[biblioteca].com"

Exemplo:
"Next.js 15 middleware authentication documentation site:nextjs.org"
"Prisma 5 one-to-many relations site:prisma.io"
```

**Ou rode no terminal e cole o resultado:**
```bash
npx ctx7 docs /vercel/next.js "middleware" --no-install
```

Quando usar: versão importa · primeira vez com a API · configuração/setup
Não usar: operações básicas · já consultou nesta sessão

---

## Roteamento de Modelos (Gemini)

| Tarefa | Modelo recomendado |
|--------|-------------------|
| Docs, testes, formatação | Gemini Flash |
| Código, implementação | Gemini Pro |
| Arquitetura, debugging difícil | Gemini Pro (contexto longo) |

---

## Frases Proibidas

| Proibido | Tokens | Substituto |
|---------|--------|-----------|
| "Vou ser feliz em ajudar..." | 8 | [execute] |
| "O motivo pelo qual isto..." | 7 | [causa direta] |
| "Eu recomendaria que..." | 7 | [afirme] |

---

## Memória de Sessão (sem comandos nativos)

O Antigravity não tem `/wrap-session` ou `/brief-session`.
Use estes prompts manualmente:

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

**Para features longas:**
```bash
python execution/handoff.py --create --tema "nome-feature"
python execution/handoff.py --brief
```

**Trocar do Antigravity para Claude Code:**
1. Peça para salvar: `Salve o contexto em .harness/memory/last-session.md`
2. No Claude Code: `/brief-session`

---

## Compressão de Histórico

Após 8 turnos:
```
python execution/compress-history.py --auto
```

Ou peça manualmente:
```
Resuma o histórico desta sessão mantendo apenas:
decisões tomadas, estado atual, próximos passos.
Salve em .harness/memory/last-session.md.
```

---

## SDLC no Antigravity

Sem slash commands nativos — use prompts diretos:

```
# Equivalente ao /spec
Leia directives/spec-driven.md e crie uma spec para [feature].

# Equivalente ao /plan
Leia .harness/index.md e decomponha [feature] em tarefas verificáveis.

# Equivalente ao /review
Leia agents/code-reviewer.md e revise as mudanças com postura cética.

# Equivalente ao /ship
Verifique o checklist em .claude/commands/ship.md antes de fazer deploy.
```

---

## Domínios Ativos

- [ ] SaaS Web              → `.harness/domains/saas.md`
- [ ] API / Backend         → `.harness/domains/api.md`
- [ ] Automação / Scripts   → `.harness/domains/automation.md`
- [ ] Jurídico / Financeiro → `.harness/domains/juridico-financeiro.md`

---

## Evolução do Harness

Erro encontrado → Hashimoto:
1. Corrija o código
2. Identifique onde o harness falhou
3. Atualize a directive correspondente
4. `python execution/self-correction.py --auto`
5. Commit: `harness(tipo): descrição`

---

*Bifrost v1.4.0 — Antigravity / Gemini*
