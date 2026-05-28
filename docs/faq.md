# FAQ — Bifrost Harness Engineering

## 1. Qual é a diferença entre Harness e CLI?

| | Harness | CLI |
|---|---|---|
| **O que é** | Arquivos no seu projeto | Instalador npm |
| **Versão atual** | v1.4.0 | v2.0.3 |
| **Onde vive** | `AGENTS.md`, `directives/`, `.harness/` | `npx harness-engineering` |
| **Como atualizar** | `git pull` + `sync-harness.py` | `npx harness-engineering upgrade` |

O **harness** define as regras do agente. O **CLI** instala e mantém essas regras.

---

## 2. Preciso usar Claude Code? Funciona com outros agentes?

Bifrost é runtime-agnostic. O arquivo principal é `AGENTS.md` — o harness funciona com:

- **Claude Code** → lê `CLAUDE.md` (gerado por `sync-harness.py`)
- **Antigravity** → lê `GEMINI.md` (gerado por `sync-harness.py`)
- **OpenCode** → lê `AGENTS.md` + `.opencode/instructions.md`
- **Cursor** → lê `.cursorrules`

Para adicionar suporte a um novo runtime: crie `scripts/overrides/<runtime>-overrides.md` e atualize `sync-harness.py`.

---

## 3. O que é a Regra de Hashimoto?

Quando o agente cometer um erro, você classifica o tipo e corrige o harness:

| Tipo | Nome | Onde corrigir |
|------|------|---------------|
| A | Harness Miss | Frontmatter da directive (trigger faltando) |
| B | Directive Incompleta | SOP não cobriu o edge case |
| C | Context Overflow | `execution/compress-history.py` |
| D | Hallucination | Regra de verificação na directive |
| E | Permission Violation | `.harness/config.json` |

Registre em `.harness/memory/hashimoto-log.md`. Cada erro melhora o harness.

---

## 4. Como adiciono regras específicas do meu projeto?

Edite `AGENTS.md` na seção **Regras Absolutas** e em seguida rode:

```bash
python scripts/sync-harness.py
```

Isso propaga as mudanças para `CLAUDE.md` e `GEMINI.md` automaticamente.

Para regras muito específicas de um domínio, crie uma directive em `directives/`:

```markdown
---
id: minha-directive
version: 1.0.0
triggers: ["palavra-chave", "outra-palavra"]
domain: saas
estimated_tokens: 400
compatible_runtimes: [claude-code]
last_updated: 2025-05-27
---

# Directive: Minha Regra

...conteúdo...
```

---

## 5. O que são protected_paths?

Caminhos que o agente **nunca deve modificar**, definidos em `.harness/config.json`:

```json
{
  "protected_paths": [
    ".env",
    ".env.*",
    "secrets/",
    "prisma/migrations/"
  ]
}
```

O CI verifica via `harness-check.yml`. Se o agente tentar modificar um path protegido, o quality gate bloqueia.

---

## 6. Como funciona a memória entre sessões?

Ao encerrar uma sessão com `/wrap-session`, o agente salva o estado em `.harness/memory/last-session.json`:

```json
{
  "session_id": "2025-05-27T14:32:00Z",
  "task_summary": "O que foi feito",
  "open_issues": ["O que ficou pendente"],
  "next_action": "Próximo passo concreto",
  "files_modified": ["lista de arquivos"]
}
```

Na próxima sessão, `/brief-session` carrega esse contexto em ~500 tokens.

---

## 7. O CI quebrou com "harness integrity check failed". O que fazer?

1. Rode localmente: `npx harness-engineering check`
2. Verifique o output — qual arquivo está faltando ou divergindo
3. Se `CLAUDE.md` diverge de `AGENTS.md`: rode `python scripts/sync-harness.py`
4. Se um arquivo do harness foi deletado: rode `npx harness-engineering` novamente para restaurar
5. Commite e faça push — o CI deve passar

---

## 8. Como atualizo o harness para uma versão nova?

```bash
# Verificar se há versão nova
npx harness-engineering upgrade

# Se houver versão nova, atualizar os arquivos do harness
git pull https://github.com/JRoberto1/Bifrost_Harness-Engineering main

# Sincronizar runtimes
python scripts/sync-harness.py

# Verificar integridade
npx harness-engineering check
```

O upgrade **nunca sobrescreve** customizações em `directives/` e `.harness/`.
