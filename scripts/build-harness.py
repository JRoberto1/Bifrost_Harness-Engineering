#!/usr/bin/env python3
"""
build-harness.py — Auto-gera .harness/index.md a partir dos frontmatters de directives/

Uso:
  python scripts/build-harness.py          → gera/atualiza .harness/index.md
  python scripts/build-harness.py --check  → verifica se index.md está atualizado (exit 1 se divergir)
"""

import sys
import os
import re
import difflib
from pathlib import Path

DIRECTIVES_DIR = Path(__file__).parent.parent / "directives"
INDEX_PATH = Path(__file__).parent.parent / ".harness" / "index.md"

HEADER = """<!-- AUTO-GERADO por scripts/build-harness.py — NÃO EDITE MANUALMENTE -->
<!-- v1.4.0 -->

# Bifrost — Índice de Directives

| Directive | Domínio | Triggers | Tokens est. | Runtimes |
|-----------|---------|----------|-------------|----------|
"""

FOOTER = """
---
*Atualizado automaticamente. Para regenerar: `python scripts/build-harness.py`*
"""


def parse_frontmatter(content: str) -> dict:
    """Extrai frontmatter YAML de um arquivo markdown."""
    match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
    if not match:
        return {}

    fm = {}
    block = match.group(1)

    for line in block.splitlines():
        if ":" not in line:
            continue
        key, _, val = line.partition(":")
        key = key.strip()
        val = val.strip()

        # Parse listas YAML simples: [a, b, c]
        if val.startswith("[") and val.endswith("]"):
            items = [i.strip().strip('"').strip("'") for i in val[1:-1].split(",") if i.strip()]
            fm[key] = items
        else:
            fm[key] = val.strip('"').strip("'")

    return fm


def build_index() -> str:
    """Gera o conteúdo completo do index.md."""
    # Parse tudo primeiro, depois ordena por id.lower() — determinístico em qualquer SO
    entries = []
    for path in DIRECTIVES_DIR.glob("*.md"):
        content = path.read_text(encoding="utf-8")
        fm = parse_frontmatter(content)
        if fm.get("id"):
            entries.append((path, fm))

    entries.sort(key=lambda x: x[1].get("id", "").lower())

    rows = []
    for path, fm in entries:
        directive_id = fm.get("id", path.stem)
        domain = fm.get("domain", "—")
        triggers = fm.get("triggers", [])
        tokens = fm.get("estimated_tokens", "—")
        runtimes = fm.get("compatible_runtimes", [])

        # Formata triggers: primeiros 3 + "..." se houver mais
        if isinstance(triggers, list):
            shown = triggers[:3]
            trigger_str = ", ".join(f"`{t}`" for t in shown)
            if len(triggers) > 3:
                trigger_str += f" +{len(triggers) - 3}"
        else:
            trigger_str = str(triggers)

        # Formata runtimes: abreviado
        if isinstance(runtimes, list):
            runtime_str = ", ".join(runtimes)
        else:
            runtime_str = str(runtimes)

        rows.append(f"| [{directive_id}](../directives/{path.name}) | {domain} | {trigger_str} | {tokens} | {runtime_str} |")

    return HEADER + "\n".join(rows) + FOOTER


def normalize(content: str) -> str:
    """Remove timestamp-sensitive lines e normaliza line endings para comparação estável."""
    lines = content.replace("\r", "").splitlines()
    filtered = [l for l in lines if not l.startswith("*Atualizado")]
    return "\n".join(filtered).strip()


def main():
    check_mode = "--check" in sys.argv

    generated = build_index()

    if check_mode:
        if not INDEX_PATH.exists():
            print("ERRO: .harness/index.md não existe. Execute: python scripts/build-harness.py")
            sys.exit(1)

        existing = INDEX_PATH.read_text(encoding="utf-8")

        gen_norm = normalize(generated)
        ex_norm = normalize(existing)

        if gen_norm != ex_norm:
            print("ERRO: .harness/index.md está desatualizado.")
            print("Execute: python scripts/build-harness.py")
            print()

            diff = difflib.unified_diff(
                ex_norm.splitlines(keepends=True),
                gen_norm.splitlines(keepends=True),
                fromfile="index.md (atual)",
                tofile="index.md (gerado)",
                n=2,
            )
            print("".join(list(diff)[:60]))
            sys.exit(1)
        else:
            print("OK: .harness/index.md está atualizado.")
            sys.exit(0)
    else:
        INDEX_PATH.parent.mkdir(parents=True, exist_ok=True)
        INDEX_PATH.write_text(generated, encoding="utf-8")

        count = generated.count("\n| [")
        print(f"OK: .harness/index.md gerado com {count} directive(s).")


if __name__ == "__main__":
    main()
