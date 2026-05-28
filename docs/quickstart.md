# Quickstart — Bifrost em 5 minutos

## Pré-requisito

Node.js 16+ instalado.

---

## 1. Instalar o harness

No diretório raiz do seu projeto:

```bash
npx harness-engineering
```

O instalador faz 4 perguntas:

```
? Nome do projeto: Meu App
? Stack principal: nextjs-14-typescript
? Runtime do agente: Claude Code
? Domínio de negócio: SaaS Web
```

O que é criado:

```
AGENTS.md               ← fonte canônica do harness
CLAUDE.md               ← para Claude Code
directives/             ← SOPs carregados sob demanda
.harness/
  config.json           ← protected paths e quality gate
  memory/
    last-session.json   ← memória entre sessões
    hashimoto-log.md    ← registro de erros → melhorias
scripts/
  sync-harness.py       ← sincroniza AGENTS.md → CLAUDE.md
```

---

## 2. Verificar integridade

```bash
npx harness-engineering check
```

Output esperado:

```
✓ AGENTS.md
✓ CLAUDE.md
✓ .harness/config.json
✓ directives/ (3 arquivos)
Harness íntegro.
```

---

## 3. Abrir o agente

No Claude Code (ou qualquer runtime compatível):

```
Leia CLAUDE.md completamente antes de qualquer ação.
```

O agente lê o harness e fica pronto para seguir as regras do seu projeto.

---

## 4. Sua primeira tarefa

Com o harness ativo, o agente:

- Aplica o **Protocolo PEV** automaticamente em tarefas com 3+ arquivos
- Carrega a **directive correta** quando o trigger é detectado
- Registra erros no **hashimoto-log.md** para melhorar o harness
- Salva contexto em **last-session.json** ao encerrar (`/wrap-session`)

---

## 5. Retomar na próxima sessão

```
/brief-session
```

O agente carrega o contexto da sessão anterior em ~500 tokens, em vez de reler tudo do zero.

---

## Próximos passos

- Customize `AGENTS.md` com as regras específicas do seu projeto
- Adicione directives em `directives/` para seus SOPs
- Veja o exemplo completo: [`examples/nextjs-typescript/`](../examples/nextjs-typescript/)
- Consulte o [FAQ](faq.md) para dúvidas comuns

---

## Referência rápida — comandos Claude Code

| Comando | Ação |
|---------|------|
| `/spec` | Escreva a spec antes de qualquer código |
| `/plan` | Decomponha em tarefas verificáveis |
| `/review` | Quality gate com viés do avaliador |
| `/ship` | Checklist completo antes de deploy |
| `/wrap-session` | Encerra sessão e salva contexto |
| `/brief-session` | Retoma sessão (~500 tokens) |
| `/context-check` | Audita e comprime contexto |
