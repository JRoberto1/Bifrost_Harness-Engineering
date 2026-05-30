# Session Schema v1

Schema canônico para `.harness/memory/last-session.json`.
Gerado por `/wrap-session` (Claude Code) ou manualmente com base em `directives/session-memory.md`.

## Campos Obrigatórios

| Campo | Tipo | Descrição |
|-------|------|-----------|
| session_id | string | UUID ou timestamp ISO — identifica a sessão |
| timestamp | ISO-8601 | Quando a sessão foi encerrada |
| runtime | enum | `claude-code` · `antigravity` · `opencode` · `cursor` |
| harness_version | string | Versão do Bifrost em uso |
| task_summary | string | O que foi feito em 1-2 frases |
| context_level_at_close | enum | `L0` · `L1` · `L2` · `L3` · `L4` |
| open_items | array | Tarefas não concluídas — cada item: `{ "id", "description", "priority" }` |
| decisions_made | array | Decisões arquiteturais — cada item: `{ "decision", "rationale" }` |
| files_modified | array | Arquivos alterados na sessão |
| next_action | string | Primeira ação recomendada na próxima sessão |
| hashimoto_events | array | Erros que melhoraram o harness — cada item: `{ "type", "file_fixed" }` |

## Exemplo Preenchido

```json
{
  "$schema": "https://bifrost.harness/session-schema/v1",
  "session_id": "2026-05-27T20:00:00Z",
  "timestamp": "2026-05-27T20:45:00Z",
  "runtime": "claude-code",
  "harness_version": "1.7.0",
  "task_summary": "Sprint 3: sync canônico, taxonomia Hashimoto e session schema",
  "context_level_at_close": "L1",
  "open_items": [],
  "decisions_made": [
    { "decision": "AGENTS.md como fonte canônica", "rationale": "evita divergência manual entre runtime files" }
  ],
  "files_modified": [
    "scripts/sync-harness.py",
    "directives/harness-evolution.md",
    ".harness/memory/last-session.json"
  ],
  "next_action": "Executar python scripts/sync-harness.py após modificar AGENTS.md",
  "hashimoto_events": []
}
```

## Compatibilidade

Runtimes sem suporte a JSON podem continuar usando `.harness/memory/last-session.md`
seguindo o template em `directives/session-memory.md`. O JSON é preferido quando disponível.
