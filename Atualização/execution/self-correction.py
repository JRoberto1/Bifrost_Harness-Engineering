#!/usr/bin/env python3
"""
execution/self-correction.py — Bifrost v2.2.0
Analisa logs de erro da sessão e sugere automaticamente melhorias
para directives/harness-evolution.md (Regra de Hashimoto automática).

Uso:
    python execution/self-correction.py --auto
    python execution/self-correction.py --input .harness/memory/last-session.md
    python execution/self-correction.py --dry-run --input session.md
"""
import argparse, json, re, sys
from datetime import datetime, timezone
from pathlib import Path

VERSION      = "2.2.0"
EVOLUTION_MD = "directives/harness-evolution.md"
MEMORY_DIR   = ".harness/memory"
LAST_SESSION = f"{MEMORY_DIR}/last-session.md"

# ── Padrões de erro → sugestão de regra ──────────────────────
PATTERNS = [
    {
        "pattern": r"cannot find module|module not found|importerror",
        "categoria": "dependency",
        "sugestao": "Verifique dependências instaladas antes de executar qualquer script",
        "directive": "Sempre rode `npm install` ou `pip install -r requirements.txt` antes de iniciar",
    },
    {
        "pattern": r"typeerror|cannot read prop|undefined is not",
        "categoria": "typescript",
        "sugestao": "Tipo incorreto ou dado ausente — use Optional/undefined check explícito",
        "directive": "Nunca acesse propriedade aninhada sem verificar existência do objeto pai",
    },
    {
        "pattern": r"enoent|no such file|file not found",
        "categoria": "filesystem",
        "sugestao": "Arquivo não encontrado — verifique o path antes de ler",
        "directive": "Sempre verifique existência do arquivo antes de ler: `Path(x).exists()`",
    },
    {
        "pattern": r"permission denied|eacces",
        "categoria": "permission",
        "sugestao": "Sem permissão — arquivo protegido ou fora dos allowed_paths",
        "directive": "Consulte .harness/config.json protected_paths antes de escrever em qualquer arquivo",
    },
    {
        "pattern": r"git push|rejected|failed to push",
        "categoria": "git",
        "sugestao": "Push rejeitado — branch desatualizada ou protected",
        "directive": "Sempre rode `git pull --rebase` antes de `git push`",
    },
    {
        "pattern": r"api.*error|rate limit|429|timeout|connection refused",
        "categoria": "api",
        "sugestao": "Erro de API — timeout ou rate limit. Use retry com backoff",
        "directive": "Chamadas externas precisam de timeout + retry com exponential backoff",
    },
    {
        "pattern": r"syntax error|unexpected token|invalid json",
        "categoria": "syntax",
        "sugestao": "Erro de sintaxe — valide JSON/código antes de executar",
        "directive": "Valide sintaxe de arquivos gerados antes de salvar: `JSON.parse()` ou `ast.parse()`",
    },
    {
        "pattern": r"test.*fail|failing test|assertion error",
        "categoria": "test",
        "sugestao": "Teste falhou — escreva o teste ANTES de implementar (TDD)",
        "directive": "Nunca marque tarefa como concluída sem testes passando",
    },
    {
        "pattern": r"loop|retry.*infinit|max.*attempt|recursion",
        "categoria": "loop",
        "sugestao": "Loop infinito ou retry sem limite — adicione max_attempts",
        "directive": "Todo loop de retry precisa de: max_attempts, backoff e log de cada tentativa",
    },
]

def analyze(content: str) -> list[dict]:
    """Identifica padrões de erro no conteúdo da sessão."""
    findings = []
    seen = set()
    content_lower = content.lower()

    for p in PATTERNS:
        if re.search(p["pattern"], content_lower):
            key = p["categoria"]
            if key not in seen:
                seen.add(key)
                findings.append(p)

    return findings

def read_evolution() -> str:
    """Lê o arquivo harness-evolution.md atual."""
    p = Path(EVOLUTION_MD)
    return p.read_text(encoding="utf-8") if p.exists() else ""

def already_exists(evolution_content: str, directive: str) -> bool:
    """Verifica se a sugestão já está no arquivo."""
    return directive.lower()[:40] in evolution_content.lower()

def render_suggestions(findings: list[dict], existing: str) -> str:
    """Gera o bloco de aprendizados para adicionar ao harness-evolution.md."""
    if not findings:
        return ""

    date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    lines = [f"\n<!-- Auto-gerado por self-correction.py em {date} -->"]

    new_count = 0
    for f in findings:
        if not already_exists(existing, f["directive"]):
            lines.append(f"- [{date}] [{f['categoria']}] {f['directive']}")
            new_count += 1

    return "\n".join(lines) if new_count > 0 else ""

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--auto",    action="store_true", help="Usa last-session.md automaticamente")
    p.add_argument("--input",   help="Arquivo de sessão para analisar")
    p.add_argument("--dry-run", action="store_true", help="Mostra sugestões sem gravar")
    args = p.parse_args()

    # Ler conteúdo da sessão
    source = args.input or (LAST_SESSION if args.auto else None)
    if not source or not Path(source).exists():
        print(json.dumps({"status": "skip", "motivo": "Nenhuma sessão para analisar"}))
        sys.exit(0)

    content  = Path(source).read_text(encoding="utf-8")
    findings = analyze(content)

    if not findings:
        print(json.dumps({
            "status": "clean",
            "motivo": "Nenhum padrão de erro encontrado — sessão limpa",
            "arquivo": source,
        }))
        sys.exit(0)

    existing    = read_evolution()
    suggestions = render_suggestions(findings, existing)

    if not suggestions:
        print(json.dumps({
            "status": "skip",
            "motivo": "Todas as sugestões já estão em harness-evolution.md",
            "padroes_encontrados": [f["categoria"] for f in findings],
        }))
        sys.exit(0)

    if args.dry_run:
        print("=== SUGESTÕES PARA harness-evolution.md ===")
        print(suggestions)
        print(json.dumps({
            "status": "dry_run",
            "padroes": [f["categoria"] for f in findings],
            "linhas_novas": suggestions.count("\n- "),
        }))
        sys.exit(0)

    # Gravar no harness-evolution.md
    evolution_path = Path(EVOLUTION_MD)
    if evolution_path.exists():
        original = evolution_path.read_text(encoding="utf-8")
        # Insere antes da última linha
        updated = original.rstrip() + "\n" + suggestions + "\n"
        evolution_path.write_text(updated, encoding="utf-8")
    else:
        print(json.dumps({"status": "error", "erro": f"{EVOLUTION_MD} não encontrado"}))
        sys.exit(1)

    print(json.dumps({
        "status": "success",
        "arquivo": EVOLUTION_MD,
        "padroes_detectados": [f["categoria"] for f in findings],
        "linhas_adicionadas": suggestions.count("\n- "),
        "mensagem": "Aprendizados registrados em harness-evolution.md (Hashimoto automático)",
    }, ensure_ascii=False))

if __name__ == "__main__":
    main()


def create_pr(findings: list, suggestions: str, branch: str = "") -> dict:
    """Cria branch + commit + abre PR via GitHub CLI."""
    import subprocess, shutil
    from datetime import datetime, timezone

    if not shutil.which("gh"):
        return {"status": "skip", "motivo": "GitHub CLI (gh) não instalado — instale em: https://cli.github.com"}

    date   = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M")
    branch = branch or f"harness/auto-correction-{date}"
    cats   = "-".join(sorted(set(f["categoria"] for f in findings)))
    title  = f"harness(auto): correções detectadas — {cats}"
    body   = "## Auto-correção Bifrost (Hashimoto Automático)\n\nPadrões detectados:\n"
    for f in findings:
        body += f"\n- **{f['categoria']}**: {f['sugestao']}"
    body += f"\n\n```\n{suggestions.strip()}\n```"
    body += "\n\n_Gerado por `execution/self-correction.py` — revise e aprove se correto._"

    try:
        subprocess.run(["git", "checkout", "-b", branch], check=True, capture_output=True)
        subprocess.run(["git", "add", "directives/harness-evolution.md"], check=True, capture_output=True)
        subprocess.run(["git", "commit", "-m", title], check=True, capture_output=True)
        subprocess.run(["git", "push", "-u", "origin", branch], check=True, capture_output=True)
        r = subprocess.run(
            ["gh", "pr", "create", "--title", title, "--body", body, "--head", branch],
            check=True, capture_output=True, text=True
        )
        return {"status": "success", "pr_url": r.stdout.strip(), "branch": branch}
    except subprocess.CalledProcessError as e:
        return {"status": "error", "erro": e.stderr.decode() if e.stderr else str(e)}


def main_v2():
    """Entry point v2.3.0 com --open-pr."""
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--auto",    action="store_true")
    p.add_argument("--input",   help="Arquivo de sessão")
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--open-pr", action="store_true", help="Abre PR automático (requer gh CLI)")
    args = p.parse_args()

    source = args.input or (LAST_SESSION if args.auto else None)
    if not source or not Path(source).exists():
        print(json.dumps({"status": "skip", "motivo": "Nenhuma sessão para analisar"}))
        sys.exit(0)

    content  = Path(source).read_text(encoding="utf-8")
    findings = analyze(content)

    if not findings:
        print(json.dumps({"status": "clean", "motivo": "Sessão limpa — nenhum padrão de erro"}))
        sys.exit(0)

    existing    = read_evolution()
    suggestions = render_suggestions(findings, existing)

    if not suggestions:
        print(json.dumps({"status": "skip", "motivo": "Todas as sugestões já existem"}))
        sys.exit(0)

    if args.dry_run:
        print(suggestions)
        sys.exit(0)

    evolution_path = Path(EVOLUTION_MD)
    if evolution_path.exists():
        original = evolution_path.read_text(encoding="utf-8")
        evolution_path.write_text(original.rstrip() + "\n" + suggestions + "\n", encoding="utf-8")
    else:
        print(json.dumps({"status": "error", "erro": f"{EVOLUTION_MD} não encontrado"}))
        sys.exit(1)

    output = {
        "status": "success",
        "arquivo": EVOLUTION_MD,
        "padroes": [f["categoria"] for f in findings],
        "linhas": suggestions.count("\n- "),
    }

    if args.open_pr:
        pr_result = create_pr(findings, suggestions)
        output["pr"] = pr_result

    print(json.dumps(output, ensure_ascii=False))

