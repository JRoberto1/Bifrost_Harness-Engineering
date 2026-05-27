# Arquitetura do Bifrost

> Este arquivo descreve a arquitetura do sistema Bifrost — o harness em si.
> O agente lê este arquivo antes de qualquer decisão arquitetural.
> Atualize sempre que uma decisão estrutural for tomada (Regra de Hashimoto).

---

## Visão Geral

O Bifrost organiza o comportamento de agentes de IA em camadas independentes, cada uma com responsabilidade única.

```
┌────────────────────────────────────────────────────────┐
│                   RUNTIME DO AGENTE                    │
│      Claude Code · Antigravity · OpenCode · Cursor     │
└─────────────────────┬──────────────────────────────────┘
                      │ lê
┌─────────────────────▼──────────────────────────────────┐
│                CAMADA 0 — IDENTIDADE                   │
│          AGENTS.md · CLAUDE.md · GEMINI.md             │
│      regras fixas · hierarquia · permissões            │
└─────────────────────┬──────────────────────────────────┘
                      │ referencia
┌─────────────────────▼──────────────────────────────────┐
│             CAMADA 1 — DIRECTIVES (SOPs)               │
│                    directives/                         │
│      o QUE fazer · quando · em qual ordem              │
└─────────────────────┬──────────────────────────────────┘
                      │ orquestra
┌─────────────────────▼──────────────────────────────────┐
│          CAMADA 2 — ORQUESTRAÇÃO (.harness/doe/)       │
│      diretrizes.md · orquestracao.md · execucao.md     │
│      COMO o agente age · índice de carregamento        │
└─────────────────────┬──────────────────────────────────┘
                      │ invoca
┌─────────────────────▼──────────────────────────────────┐
│            CAMADA 3 — EXECUTION (scripts)              │
│                    execution/                          │
│      FAZ de forma determinística e confiável           │
└────────────────────────────────────────────────────────┘
```

**Regra absoluta:** uma camada só conhece a camada imediatamente abaixo. Nunca inverta.

---

## Hierarquia de Memória

O agente carrega contexto em ordem de prioridade, da mais estável à mais descartável:

```
L0 — AGENTS.md / CLAUDE.md / GEMINI.md   → sempre presente · NUNCA descartar
L1 — .harness/index.md                   → sempre presente · NUNCA descartar
L2 — .harness/domains/                   → carregado sob demanda
L3 — directives/ · skills/               → carregado por match com a tarefa
L4 — .harness/memory/last-session.md     → descartável após /wrap-session
```

Quando o contexto apertar → descarte de L4 para L0. Nunca o contrário.

---

## Fluxo de Decisão do Agente

```
Tarefa recebida
      │
      ▼
┌─────────────┐
│ Intent Gate │ ── classifica: Pesquisa · Implementação · Investigação · Correção · Revisão
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│  Carregar L1     │ ── lê .harness/index.md
└──────┬───────────┘
       │
       ▼
┌──────────────────┐     nenhum match
│ Match directive? │ ──────────────────── executa direto
└──────┬───────────┘
       │ sim
       ▼
┌──────────────────┐
│  Carrega L3      │ ── APENAS a directive com match
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Protocolo PEV    │ ── PLAN → EXECUTE → VERIFY
└──────┬───────────┘
       │ falha?
       ├── sim → volta ao PLAN com contexto de erro
       │
       ▼ sucesso
┌──────────────────┐
│   Hashimoto?     │ ── se foi correção: atualiza directive correspondente
└──────────────────┘
```

---

## Três Tiers de Permissão

```
┌──────────────────────────────────────────┐
│  ✅ VERDE — executa sem perguntar        │
│  Leitura · testes · geração em src/      │
├──────────────────────────────────────────┤
│  ⚠️  AMARELO — pergunta antes            │
│  Deleção · config · deps · git push      │
├──────────────────────────────────────────┤
│  🚫 VERMELHO — nunca executa             │
│  protected_paths · .env · git --hard     │
└──────────────────────────────────────────┘
```

Validação programática:
```bash
python execution/validate_action.py --action [ação] --target [alvo]
python execution/validate_action.py --list-rules
```

---

## Quality Gate

O pre-commit em `.harness/quality-gates/pre-commit` bloqueia:

| Verificação | O que detecta |
|-------------|---------------|
| Segredos | passwords, api_keys, tokens hardcoded |
| TypeScript `any` | sem `// harness-ignore` |
| Float monetário | valores monetários em ponto flutuante |
| `.env` commitado | sem ser `.example` |
| `console.log` solto | logs de debug em JS/TS |
| Protected paths | definidos em `.harness/config.json` |

---

## Ciclo de Vida de uma Sessão

```
início
  │
  ├── /brief-session    → lê last-session.md (~500 tokens em vez de 20k+)
  │
  │   [trabalho — Intent Gate → Lazy Load → PEV]
  │
  ├── /context-check    → comprime após 8+ turnos
  │
  └── /wrap-session     → salva last-session.md + handoff.json
```

Para features longas:
```bash
python execution/handoff.py --create --tema "nome-feature"   # salva estado estruturado
python execution/handoff.py --brief                          # retoma em novo agente
```

---

## Regra de Hashimoto

> Cada bug que não vira regra do harness é um bug que vai acontecer de novo.

```
1. Corrija o código
2. Identifique onde o harness falhou (qual directive estava faltando ou errada)
3. Atualize a directive correspondente
4. python execution/self-correction.py --auto
5. Commit: harness(tipo): descrição
```

---

## O que NUNCA Fazer

| Proibido | Motivo |
|---------|--------|
| Inverter dependências entre camadas | Quebra o isolamento do harness |
| Carregar todas as directives de uma vez | Desperdiça contexto — use Lazy Loading |
| Commitar `.env` ou credenciais | Bloqueado pelo pre-commit |
| Usar `any` em TypeScript | Bloqueado pelo quality gate |
| Modificar `AGENTS.md` sem instrução explícita | Arquivo de identidade do agente |
