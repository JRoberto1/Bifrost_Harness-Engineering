#!/usr/bin/env python3
"""
sync-harness.py — Gera CLAUDE.md e GEMINI.md a partir de AGENTS.md.
AGENTS.md é a fonte canônica. Nunca edite CLAUDE.md ou GEMINI.md diretamente.
Uso: python scripts/sync-harness.py
"""

import sys
import difflib
from pathlib import Path

ROOT = Path(__file__).parent.parent
AGENTS_PATH = ROOT / "AGENTS.md"
CLAUDE_PATH = ROOT / "CLAUDE.md"
GEMINI_PATH = ROOT / "GEMINI.md"

# ── Blocos exatos de AGENTS.md que serão substituídos ────────────────────────

AGENTS_HEADER = """\
# AGENTS.md — Bifrost Universal Harness
<!-- Claude Code · Antigravity · OpenCode · Cursor · Copilot -->
<!-- Versão: 1.4.0 -->

> Leia este arquivo completamente antes de qualquer ação.
> Arquivo universal — lido por qualquer runtime.
> Claude Code: use CLAUDE.md · Antigravity: use GEMINI.md"""

AGENTS_L0 = "L0 — AGENTS.md              → regras fixas · sempre presente · nunca descartar"

AGENTS_ROUTING = """\
## Roteamento de Modelos

| Tarefa | Modelo |
|--------|--------|
| Docs, testes, formatação | Haiku / Flash |
| Código, implementação | Sonnet / Pro |
| Arquitetura, debugging | Opus / Pro longo |

### Budget por Tipo de Tarefa

| Tipo | Max Contexto | Max Output |
|------|-------------|-----------|
| Análise simples | 8k | 1k |
| Geração de código | 20k | 4k |
| Revisão de documento | 30k | 6k |
| Debug complexo | 40k | 8k |

---"""

AGENTS_SESSION = """\
## Memória de Sessão

**Ao iniciar:** leia `.harness/memory/last-session.md` se existir.
**Ao encerrar:** salve contexto em `.harness/memory/last-session.md`.
**Formato JSON:** salve em `.harness/memory/last-session.json` (schema: `docs/session-schema.md`)

**Claude Code:** `/wrap-session` e `/brief-session`
**Outros runtimes:** leia `directives/session-memory.md`

---"""

AGENTS_FOOTER = "*Bifrost v1.4.0 — Universal*"

# ── Blocos de substituição por runtime ───────────────────────────────────────

CLAUDE_HEADER = """\
# CLAUDE.md — Bifrost Universal Harness
<!-- Runtime: Claude Code -->
<!-- Versão: 1.4.0 -->

> Leia este arquivo completamente antes de qualquer ação.
> Este arquivo é específico para Claude Code — para outros runtimes use GEMINI.md ou AGENTS.md."""

CLAUDE_L0 = "L0 — CLAUDE.md              → sempre presente · nunca descartar"

CLAUDE_ROUTING = """\
## Roteamento de Modelos

| Tarefa | Modelo |
|--------|--------|
| Docs, testes, formatação | Haiku |
| Código, implementação | Sonnet |
| Arquitetura, debugging difícil | Opus |

---"""

CLAUDE_SESSION = """\
## Memória de Sessão

**Ao iniciar:** leia `.harness/memory/last-session.md` se existir.
**Ao encerrar:** execute `/wrap-session`.
**Formato JSON:** salve em `.harness/memory/last-session.json` (schema: `docs/session-schema.md`)
**Compressão:** `/context-check --compress` após 8 turnos.
Comandos disponíveis: `/wrap-session` · `/brief-session` · `/context-check`

---"""

CLAUDE_FOOTER = "*Bifrost v1.4.0 — Claude Code*"

GEMINI_HEADER = """\
# GEMINI.md — Bifrost Universal Harness
<!-- Runtime: Antigravity · Gemini CLI · OpenCode -->
<!-- Versão: 1.4.0 -->

> Leia este arquivo completamente antes de qualquer ação.
> Este arquivo é específico para Antigravity e runtimes baseados em Gemini.
> Para Claude Code use CLAUDE.md. Para qualquer runtime use AGENTS.md."""

GEMINI_L0 = "L0 — GEMINI.md              → sempre presente · nunca descartar"

GEMINI_ROUTING = """\
## Roteamento de Modelos (Gemini)

| Tarefa | Modelo recomendado |
|--------|-------------------|
| Tarefas mecânicas | Flash / Flash-Lite |
| Código e implementação | Pro (padrão) |
| Arquitetura e debugging | Pro (extended thinking) ou Ultra |

---"""

GEMINI_SESSION = """\
## Memória de Sessão

Este runtime não tem comandos nativos de sessão. Use estes prompts manualmente:

**Ao iniciar:**
```
Execute: Leia .harness/memory/last-session.md e me dê um briefing
do estado anterior antes de qualquer ação.
```

**Ao encerrar:**
```
Execute: Leia directives/session-memory.md e salve o contexto atual
em .harness/memory/last-session.md seguindo o template da directive.
```

**Formato JSON:** salve em `.harness/memory/last-session.json` (schema: `docs/session-schema.md`)
**Compressão:** `python execution/compress-history.py --auto` após 8 turnos.

---"""

GEMINI_FOOTER = "*Bifrost v1.4.0 · runtime: Gemini / Antigravity*"


# ── Geração ──────────────────────────────────────────────────────────────────

def generate(agents: str, header: str, l0: str, routing: str,
             session: str, footer: str) -> str:
    out = agents
    out = out.replace(AGENTS_HEADER, header, 1)
    out = out.replace(AGENTS_L0, l0, 1)
    out = out.replace(AGENTS_ROUTING, routing, 1)
    out = out.replace(AGENTS_SESSION, session, 1)
    out = out.replace(AGENTS_FOOTER, footer, 1)
    return out


def generate_claude(agents: str) -> str:
    return generate(agents, CLAUDE_HEADER, CLAUDE_L0,
                    CLAUDE_ROUTING, CLAUDE_SESSION, CLAUDE_FOOTER)


def generate_gemini(agents: str) -> str:
    return generate(agents, GEMINI_HEADER, GEMINI_L0,
                    GEMINI_ROUTING, GEMINI_SESSION, GEMINI_FOOTER)


# ── Verificação ───────────────────────────────────────────────────────────────

def normalize(content: str) -> str:
    return content.replace("\r", "").strip()


def diff_files(path: Path, generated: str) -> list[str]:
    if not path.exists():
        return [f"ERRO: {path.name} não existe\n"]
    existing = normalize(path.read_text(encoding="utf-8"))
    gen_norm = normalize(generated)
    if existing == gen_norm:
        return []
    return list(difflib.unified_diff(
        existing.splitlines(keepends=True),
        gen_norm.splitlines(keepends=True),
        fromfile=f"{path.name} (atual)",
        tofile=f"{path.name} (gerado de AGENTS.md)",
        n=2,
    ))[:60]


# ── Main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    check_mode = "--check" in sys.argv
    dry_run = "--dry-run" in sys.argv

    if not AGENTS_PATH.exists():
        print("ERRO: AGENTS.md não encontrado")
        sys.exit(1)

    agents = AGENTS_PATH.read_text(encoding="utf-8")

    claude_out = generate_claude(agents)
    gemini_out = generate_gemini(agents)

    # Sanity check: se a substituição falhou (string não encontrada),
    # o output seria idêntico ao AGENTS.md — o que é claramente errado.
    for name, out, marker in [
        ("CLAUDE.md", claude_out, "<!-- Runtime: Claude Code -->"),
        ("GEMINI.md", gemini_out, "<!-- Runtime: Antigravity"),
    ]:
        if marker not in out:
            print(f"ERRO: substituição falhou para {name} — AGENTS.md pode ter sido editado.")
            print(f"  Esperado: {marker!r}")
            sys.exit(1)

    if dry_run:
        print("── CLAUDE.md (dry-run, primeiras 20 linhas) ──")
        print("\n".join(claude_out.splitlines()[:20]))
        print("\n── GEMINI.md (dry-run, primeiras 20 linhas) ──")
        print("\n".join(gemini_out.splitlines()[:20]))
        return

    if check_mode:
        errors = False
        for path, out in [(CLAUDE_PATH, claude_out), (GEMINI_PATH, gemini_out)]:
            d = diff_files(path, out)
            if d:
                print(f"ERRO: {path.name} está fora de sync com AGENTS.md")
                print("Execute: python scripts/sync-harness.py")
                print("".join(d))
                errors = True
            else:
                print(f"✓ {path.name} em sync")
        opencode_overrides = ROOT / "scripts" / "overrides" / "opencode-overrides.md"
        if opencode_overrides.exists():
            print("✓ OpenCode: usa AGENTS.md diretamente")
        else:
            print("⚠ scripts/overrides/opencode-overrides.md ausente")
        sys.exit(1 if errors else 0)

    CLAUDE_PATH.write_text(claude_out, encoding="utf-8")
    GEMINI_PATH.write_text(gemini_out, encoding="utf-8")
    print("✓ CLAUDE.md gerado · ✓ GEMINI.md gerado · ✓ OpenCode: usa AGENTS.md diretamente")


if __name__ == "__main__":
    main()
