#!/usr/bin/env python3
"""
execution/validate_action.py — Bifrost v2.3.0
Valida ações críticas antes de executar — implementação programática
dos Três Tiers de Permissão do AGENTS.md.

Retorna: VALID | INVALID | NEEDS_APPROVAL

Uso:
    python execution/validate_action.py --action write_file --target src/auth.ts
    python execution/validate_action.py --action execute_command --cmd "npm install"
    python execution/validate_action.py --action delete_file --target .env
    python execution/validate_action.py --action api_call --method POST --url /api/users
    python execution/validate_action.py --list-rules
"""
import argparse, json, sys, re
from pathlib import Path

VERSION = "2.3.0"
CONFIG  = ".harness/config.json"

# ── Carregar config ───────────────────────────────────────────
def load_config() -> dict:
    p = Path(CONFIG)
    if not p.exists():
        return {"protected_paths": [], "allowed_paths": []}
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return {"protected_paths": [], "allowed_paths": []}

# ── Resultado ─────────────────────────────────────────────────
def result(status: str, reason: str, action: str = "", tier: str = "") -> dict:
    return {
        "status": status,           # VALID | INVALID | NEEDS_APPROVAL
        "reason": reason,
        "action": action,
        "tier":   tier,             # green | yellow | red
        "version": VERSION,
    }

# ── Verificações por tipo de ação ─────────────────────────────

def validate_write(target: str, config: dict) -> dict:
    """Tier: escrever/criar arquivos."""
    t = target.replace("\\", "/")

    # RED — nunca
    for p in config.get("protected_paths", []):
        p = p.replace("\\", "/")
        pat = p.replace(".", "\\.").replace("*", ".*")
        if re.match(f"^{pat}", t) or t == p.rstrip("/"):
            return result("INVALID",
                f"'{target}' está em protected_paths — NUNCA pode ser modificado",
                "write_file", "red")

    # GREEN — allowed
    for p in config.get("allowed_paths", []):
        p = p.replace("\\", "/")
        if t.startswith(p.rstrip("/")):
            return result("VALID",
                f"'{target}' está em allowed_paths — pode escrever sem pedir",
                "write_file", "green")

    # YELLOW — fora dos dois → perguntar
    return result("NEEDS_APPROVAL",
        f"'{target}' não está em allowed_paths nem protected_paths — pergunte antes",
        "write_file", "yellow")


def validate_delete(target: str, config: dict) -> dict:
    """Tier: deletar arquivos — sempre NEEDS_APPROVAL no mínimo."""
    t = target.replace("\\", "/")

    for p in config.get("protected_paths", []):
        p = p.replace("\\", "/")
        pat = p.replace(".", "\\.").replace("*", ".*")
        if re.match(f"^{pat}", t) or t == p.rstrip("/"):
            return result("INVALID",
                f"'{target}' está em protected_paths — NUNCA pode ser deletado",
                "delete_file", "red")

    return result("NEEDS_APPROVAL",
        f"Deletar '{target}' requer aprovação explícita do usuário",
        "delete_file", "yellow")


def validate_command(cmd: str, config: dict) -> dict:
    """Tier: executar comandos no terminal."""
    cmd_lower = cmd.lower().strip()

    # RED — destrutivos irreversíveis
    NEVER = [
        ("git reset --hard",   "reset destrutivo do git"),
        ("git push --force",   "force push"),
        ("rm -rf /",           "delete recursivo de raiz"),
        ("drop table",         "drop de tabela SQL"),
        ("drop database",      "drop de database SQL"),
        ("format",             "formatação de disco"),
        ("> /dev/",            "write em device file"),
    ]
    for pattern, desc in NEVER:
        if pattern in cmd_lower:
            return result("INVALID",
                f"Comando '{cmd}' contém operação irreversível: {desc}",
                "execute_command", "red")

    # YELLOW — requerem aprovação
    APPROVAL = [
        ("npm install",   "instala dependências"),
        ("pip install",   "instala pacotes Python"),
        ("git commit",    "cria commit"),
        ("git push",      "envia para remote"),
        ("git merge",     "merge de branches"),
        ("docker",        "operação Docker"),
        ("kubectl",       "operação Kubernetes"),
        ("terraform",     "operação de infra"),
        ("rm ",           "delete de arquivo"),
        ("del ",          "delete Windows"),
        ("curl",          "chamada HTTP"),
        ("wget",          "download de arquivo"),
    ]
    for pattern, desc in APPROVAL:
        if pattern in cmd_lower:
            return result("NEEDS_APPROVAL",
                f"'{cmd}' é uma operação que requer aprovação: {desc}",
                "execute_command", "yellow")

    # GREEN — testes, lint, leitura
    SAFE = ["npm test", "pytest", "npm run lint", "eslint", "ruff",
            "cat ", "ls ", "grep ", "find ", "head ", "tail ", "wc "]
    for pattern in SAFE:
        if cmd_lower.startswith(pattern.strip()):
            return result("VALID",
                f"'{cmd}' é operação segura de leitura/teste",
                "execute_command", "green")

    return result("NEEDS_APPROVAL",
        f"Comando não classificado: '{cmd}' — pergunte antes por segurança",
        "execute_command", "yellow")


def validate_api(method: str, url: str, config: dict) -> dict:
    """Tier: chamadas de API externas."""
    method = method.upper()

    if method == "GET":
        return result("VALID",
            f"GET {url} é operação de leitura — pode executar",
            "api_call", "green")

    return result("NEEDS_APPROVAL",
        f"{method} {url} tem efeitos colaterais — requer aprovação antes",
        "api_call", "yellow")


def validate_git(operation: str, config: dict) -> dict:
    """Tier: operações git."""
    op = operation.lower()

    NEVER_OPS = ["reset --hard", "push --force", "push -f", "rebase -i"]
    for n in NEVER_OPS:
        if n in op:
            return result("INVALID",
                f"git {operation} é operação destrutiva irreversível",
                "git", "red")

    SAFE_OPS = ["status", "log", "diff", "branch", "show", "fetch"]
    for s in SAFE_OPS:
        if op.startswith(s):
            return result("VALID",
                f"git {operation} é operação de leitura",
                "git", "green")

    return result("NEEDS_APPROVAL",
        f"git {operation} modifica o repositório — requer aprovação",
        "git", "yellow")


RULES_SUMMARY = """
╔══════════════════════════════════════════════════════════╗
║   Bifrost — Três Tiers de Permissão (validate_action)   ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ✅ VALID (GREEN) — pode sem pedir                       ║
║     • Ler arquivos (cat, grep, head)                     ║
║     • Rodar testes (npm test, pytest)                    ║
║     • Escrever em allowed_paths                          ║
║     • Chamadas GET                                       ║
║     • git status/log/diff                                ║
║                                                          ║
║  ⚠️  NEEDS_APPROVAL (YELLOW) — perguntar antes           ║
║     • Deletar qualquer arquivo                           ║
║     • npm install, pip install                           ║
║     • git commit, push, merge                            ║
║     • Chamadas POST/PUT/DELETE                           ║
║     • Arquivos fora de allowed_paths                     ║
║                                                          ║
║  🚫 INVALID (RED) — nunca                               ║
║     • Arquivos em protected_paths                        ║
║     • git reset --hard, push --force                     ║
║     • Comandos destrutivos irreversíveis                 ║
║     • DROP TABLE/DATABASE                                ║
╚══════════════════════════════════════════════════════════╝
"""

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--action", choices=["write_file","delete_file","execute_command",
                                        "api_call","git"], help="Tipo de ação")
    p.add_argument("--target",  help="Arquivo alvo (write/delete)")
    p.add_argument("--cmd",     help="Comando a executar")
    p.add_argument("--method",  help="Método HTTP (GET/POST/etc)")
    p.add_argument("--url",     help="URL da API")
    p.add_argument("--operation", help="Operação git")
    p.add_argument("--list-rules", action="store_true", help="Mostra todas as regras")
    args = p.parse_args()

    if args.list_rules:
        print(RULES_SUMMARY)
        sys.exit(0)

    if not args.action:
        p.print_help()
        sys.exit(1)

    config = load_config()

    if args.action == "write_file":
        if not args.target:
            print(json.dumps({"status":"INVALID","reason":"--target obrigatório"}))
            sys.exit(1)
        r = validate_write(args.target, config)

    elif args.action == "delete_file":
        if not args.target:
            print(json.dumps({"status":"INVALID","reason":"--target obrigatório"}))
            sys.exit(1)
        r = validate_delete(args.target, config)

    elif args.action == "execute_command":
        if not args.cmd:
            print(json.dumps({"status":"INVALID","reason":"--cmd obrigatório"}))
            sys.exit(1)
        r = validate_command(args.cmd, config)

    elif args.action == "api_call":
        if not args.method or not args.url:
            print(json.dumps({"status":"INVALID","reason":"--method e --url obrigatórios"}))
            sys.exit(1)
        r = validate_api(args.method, args.url, config)

    elif args.action == "git":
        if not args.operation:
            print(json.dumps({"status":"INVALID","reason":"--operation obrigatório"}))
            sys.exit(1)
        r = validate_git(args.operation, config)

    print(json.dumps(r, ensure_ascii=False))

    # Exit code: 0=VALID, 1=INVALID, 2=NEEDS_APPROVAL
    codes = {"VALID": 0, "INVALID": 1, "NEEDS_APPROVAL": 2}
    sys.exit(codes.get(r["status"], 1))

if __name__ == "__main__":
    main()
