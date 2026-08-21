#!/usr/bin/env python3
"""
execution/handoff.py — Bifrost v2.5.0
Gera handoff estruturado de duas formas:
  1. handoff.json — arquivo de estado para retomada
  2. WIP commit  — commit git com contexto estruturado (context-save)

O commit WIP sobrevive a crashes, troca de máquina e qualquer runtime
que consiga ler git log. O /ship remove WIP commits antes do PR.

Uso:
    python execution/handoff.py --create --tema "auth-jwt"
    python execution/handoff.py --wip --tema "auth-jwt"     ← commit WIP
    python execution/handoff.py --read
    python execution/handoff.py --brief
    python execution/handoff.py --restore                   ← lê último WIP
"""
import argparse, json, subprocess, sys
from datetime import datetime, timezone
from pathlib import Path

VERSION      = "2.5.0"
HANDOFF_FILE = ".harness/memory/handoff.json"
MEMORY_DIR   = ".harness/memory"

def run(cmd, check=False):
    try:
        return subprocess.check_output(
            cmd, shell=True, text=True, stderr=subprocess.DEVNULL
        ).strip()
    except Exception:
        return ""

def git_info() -> dict:
    return {
        "branch":          run("git branch --show-current"),
        "last_commit":     run("git log -1 --format='%h %s'"),
        "last_commit_hash": run("git log -1 --format='%H'"),
        "modified_files":  [f for f in run("git diff --name-only").split("\n") if f],
        "staged_files":    [f for f in run("git diff --cached --name-only").split("\n") if f],
    }

def read_progress() -> str:
    p = Path("claude-progress.txt")
    return p.read_text(encoding="utf-8")[:300] if p.exists() else ""

def read_last_session() -> str:
    p = Path(".harness/memory/last-session.md")
    return p.read_text(encoding="utf-8")[:300] if p.exists() else ""

# ── WIP Commit ────────────────────────────────────────────────
def create_wip_commit(tema: str, next_task: str = "", blockers: str = "",
                      decisions: list = None, failed: list = None) -> dict:
    """
    Cria um commit WIP com contexto estruturado no corpo.
    Compatível com qualquer runtime que leia git log.
    """
    git = git_info()

    if not git["branch"]:
        return {"status": "error", "erro": "Não está em um repositório git"}

    # Verifica se há mudanças para commitar
    has_changes = bool(git["modified_files"] or git["staged_files"])
    if not has_changes:
        return {"status": "skip", "motivo": "Sem mudanças para salvar em WIP commit"}

    # Monta o corpo estruturado do commit
    body = {
        "bifrost_handoff": True,
        "version": VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "tema": tema,
        "next_task": next_task or "[definir]",
        "blockers": blockers or "nenhum",
        "decisions": decisions or [],
        "failed_approaches": failed or [],
        "modified_files": git["modified_files"],
        "branch": git["branch"],
    }

    # Título e corpo do commit
    title = f"WIP: {tema}"
    gstack_context = f"\n[gstack-context]\n{json.dumps(body, ensure_ascii=False, indent=2)}\n[/gstack-context]"

    commit_msg = title + gstack_context

    try:
        # Stage tudo que foi modificado
        run("git add -A")
        subprocess.run(
            ["git", "commit", "-m", commit_msg],
            check=True, capture_output=True
        )
        hash_curto = run("git log -1 --format='%h'")
        return {
            "status": "success",
            "tipo": "wip_commit",
            "commit": hash_curto,
            "tema": tema,
            "branch": git["branch"],
            "mensagem": f"WIP commit criado: {hash_curto} — use 'python execution/handoff.py --restore' para retomar",
        }
    except subprocess.CalledProcessError as e:
        return {"status": "error", "erro": e.stderr.decode() if e.stderr else str(e)}

def restore_from_wip() -> str:
    """Lê o contexto do último WIP commit."""
    log = run("git log --format='%H %s' --all")
    for line in log.split("\n"):
        if "WIP:" in line:
            hash_full = line.split()[0]
            body = run(f"git show {hash_full} --format='%b' -s")
            if "[gstack-context]" in body:
                try:
                    raw = body.split("[gstack-context]")[1].split("[/gstack-context]")[0]
                    data = json.loads(raw)
                    return f"""# Restore do WIP Commit

**Commit:** {hash_full[:8]}
**Tema:** {data.get('tema', '?')}
**Branch:** {data.get('branch', '?')}
**Salvo em:** {data.get('timestamp', '?')[:10]}

## Próxima Tarefa
{data.get('next_task', '[não definida]')}

## Bloqueios
{data.get('blockers', 'nenhum')}

## Decisões Tomadas
{chr(10).join(f'- {d}' for d in data.get('decisions', [])) or '(nenhuma registrada)'}

## Abordagens que Falharam
{chr(10).join(f'- {f}' for f in data.get('failed_approaches', [])) or '(nenhuma)'}

## Arquivos Modificados
{chr(10).join(f'- {f}' for f in data.get('modified_files', [])) or '(nenhum)'}

---
Para remover WIP commits antes do PR: git rebase -i HEAD~N (squash os WIP)
O /ship faz isso automaticamente.
"""
                except Exception:
                    return f"WIP commit encontrado ({hash_full[:8]}) mas sem contexto estruturado."
    return "Nenhum WIP commit encontrado. Use: python execution/handoff.py --wip"

# ── Handoff JSON ──────────────────────────────────────────────
def create_handoff(tema: str, next_task: str = "", blockers: str = "") -> dict:
    Path(MEMORY_DIR).mkdir(parents=True, exist_ok=True)
    git = git_info()
    handoff = {
        "version": VERSION,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "tema": tema,
        "git": git,
        "context": {
            "last_session_preview": read_last_session(),
            "progress_preview": read_progress(),
            "next_task": next_task or "[definir]",
            "blockers": blockers or "nenhum",
        },
        "agent_instructions": {
            "start_with": f"Leia este handoff.json e o AGENTS.md. Sua primeira tarefa: {next_task or '[pergunte ao usuário]'}",
            "do_not": ["Reiniciar trabalho entregue", "Modificar protected_paths", "Push sem aprovação"],
            "verify_first": ["Testes passando", "Ler claude-progress.txt se existir"],
        }
    }
    Path(HANDOFF_FILE).write_text(
        json.dumps(handoff, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return handoff

def brief_prompt(handoff: dict) -> str:
    git = handoff.get("git", {})
    ctx = handoff.get("context", {})
    return f"""# Bifrost Handoff — {handoff.get('tema', 'projeto')}
Criado: {handoff.get('created_at', '')[:10]}

## Estado do Git
Branch: {git.get('branch', '?')}
Último commit: {git.get('last_commit', '?')}

## Próxima Tarefa
{ctx.get('next_task', '[pergunte ao usuário]')}

## Bloqueios
{ctx.get('blockers', 'nenhum')}

---
Leia também: AGENTS.md · claude-progress.txt · .harness/memory/last-session.md
"""

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--create",    action="store_true", help="Cria handoff.json")
    p.add_argument("--wip",       action="store_true", help="Cria WIP commit com contexto (context-save)")
    p.add_argument("--read",      action="store_true", help="Lê handoff.json")
    p.add_argument("--brief",     action="store_true", help="Prompt de retomada")
    p.add_argument("--restore",   action="store_true", help="Lê contexto do último WIP commit")
    p.add_argument("--tema",      default="sessão")
    p.add_argument("--next-task", default="")
    p.add_argument("--blockers",  default="")
    p.add_argument("--decisions", nargs="*", default=[])
    p.add_argument("--failed",    nargs="*", default=[])
    args = p.parse_args()

    if args.wip:
        r = create_wip_commit(args.tema, args.next_task, args.blockers,
                              args.decisions, args.failed)
        print(json.dumps(r, ensure_ascii=False))

    elif args.restore:
        print(restore_from_wip())

    elif args.create:
        h = create_handoff(args.tema, args.next_task, args.blockers)
        print(json.dumps({
            "status": "success", "arquivo": HANDOFF_FILE,
            "tema": args.tema, "git_branch": h["git"].get("branch","?"),
        }, ensure_ascii=False))

    elif args.read:
        p2 = Path(HANDOFF_FILE)
        if not p2.exists():
            print(json.dumps({"status": "not_found"}))
            sys.exit(1)
        print(p2.read_text(encoding="utf-8"))

    elif args.brief:
        p2 = Path(HANDOFF_FILE)
        if not p2.exists():
            print("Nenhum handoff.json. Rode: python execution/handoff.py --create")
            sys.exit(1)
        print(brief_prompt(json.loads(p2.read_text(encoding="utf-8"))))

    else:
        p.print_help()

if __name__ == "__main__":
    main()
