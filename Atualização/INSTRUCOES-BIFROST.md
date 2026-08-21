# INSTRUCOES-BIFROST.md
# Bifrost — Atualização Completa v2.6.0
# Todas as Fases: 0, 1, 2, 3, 4, 5, 6

> Leia este arquivo completamente antes de executar qualquer ação.
> Siga o Protocolo PEV: PLAN → EXECUTE → VERIFY
> Em caso de erro em qualquer passo → PARE e informe antes de continuar.

---

## CONTEXTO

Esta atualização consolida todas as melhorias do Bifrost de v2.0.0 a v2.6.0.
Todos os arquivos estão na pasta:
`C:\Workspace\Bifrost_Harness-Engineering\Atualização\`

Repositório destino:
`C:\Workspace\Bifrost_Harness-Engineering\`

---

## PLAN — Verificação inicial

Execute e mostre o output antes de qualquer cópia:

```powershell
cd C:\Workspace\Bifrost_Harness-Engineering
git status
git log --oneline -3
```

Confirme:
- [ ] Estou na pasta correta
- [ ] git status está limpo (working tree clean)
- [ ] A pasta `Atualização\` existe com arquivos

Se qualquer item falhar → pare e informe.

---

## EXECUTE — Copiar todos os arquivos

### BLOCO 1 — Raiz do projeto (substituir)

```powershell
Copy-Item "Atualização\README.md"        "README.md"        -Force
Copy-Item "Atualização\AGENTS.md"        "AGENTS.md"        -Force
Copy-Item "Atualização\CLAUDE.md"        "CLAUDE.md"        -Force
Copy-Item "Atualização\GEMINI.md"        "GEMINI.md"        -Force
Copy-Item "Atualização\CONTRIBUTING.md"  "CONTRIBUTING.md"  -Force
Copy-Item "Atualização\claude-progress.txt" "claude-progress.txt" -Force
```

### BLOCO 2 — Directives (novos e atualizados)

```powershell
if (!(Test-Path "directives")) { New-Item -ItemType Directory "directives" }

Copy-Item "Atualização\directives\diagnose.md"        "directives\diagnose.md"        -Force
Copy-Item "Atualização\directives\session-memory.md"  "directives\session-memory.md"  -Force
Copy-Item "Atualização\directives\office-hours.md"    "directives\office-hours.md"    -Force
Copy-Item "Atualização\directives\failure-taxonomy.md" "directives\failure-taxonomy.md" -Force
```

### BLOCO 3 — Execution (scripts)

```powershell
if (!(Test-Path "execution")) { New-Item -ItemType Directory "execution" }

Copy-Item "Atualização\execution\stats.js"           "execution\stats.js"           -Force
Copy-Item "Atualização\execution\self-correction.py" "execution\self-correction.py" -Force
Copy-Item "Atualização\execution\validate_action.py" "execution\validate_action.py" -Force
Copy-Item "Atualização\execution\handoff.py"         "execution\handoff.py"         -Force
```

### BLOCO 4 — Agents

```powershell
if (!(Test-Path "agents")) { New-Item -ItemType Directory "agents" }

Copy-Item "Atualização\agents\code-reviewer.md" "agents\code-reviewer.md" -Force
```

### BLOCO 5 — Claude Commands

```powershell
if (!(Test-Path ".claude\commands")) { New-Item -ItemType Directory -Path ".claude\commands" -Force }

Copy-Item "Atualização\.claude\commands\review.md" ".claude\commands\review.md" -Force
Copy-Item "Atualização\.claude\commands\ship.md"   ".claude\commands\ship.md"   -Force
```

### BLOCO 6 — .harness (estrutura completa)

```powershell
# index.md
Copy-Item "Atualização\.harness\index.md" ".harness\index.md" -Force

# DOE (camada de orquestração)
if (!(Test-Path ".harness\doe")) { New-Item -ItemType Directory ".harness\doe" }
Copy-Item "Atualização\.harness\doe\diretrizes.md"   ".harness\doe\diretrizes.md"   -Force
Copy-Item "Atualização\.harness\doe\orquestracao.md" ".harness\doe\orquestracao.md" -Force
Copy-Item "Atualização\.harness\doe\execucao.md"     ".harness\doe\execucao.md"     -Force

# Quality Gates
if (!(Test-Path ".harness\quality-gates")) { New-Item -ItemType Directory ".harness\quality-gates" }
Copy-Item "Atualização\.harness\quality-gates\pre-commit"     ".harness\quality-gates\pre-commit"     -Force
Copy-Item "Atualização\.harness\quality-gates\agent-judge.sh" ".harness\quality-gates\agent-judge.sh" -Force

# Skills
if (!(Test-Path ".harness\skills\context7")) { New-Item -ItemType Directory -Path ".harness\skills\context7" -Force }
Copy-Item "Atualização\.harness\skills\context7\SKILL.md" ".harness\skills\context7\SKILL.md" -Force

# Tests (Token Filter regression cases)
if (!(Test-Path ".harness\tests\context")) { New-Item -ItemType Directory -Path ".harness\tests\context" -Force }
Copy-Item "Atualização\.harness\tests\README.md"              ".harness\tests\README.md"              -Force
Copy-Item "Atualização\.harness\tests\context\DS-001.md"      ".harness\tests\context\DS-001.md"      -Force
Copy-Item "Atualização\.harness\tests\context\DS-002.md"      ".harness\tests\context\DS-002.md"      -Force
Copy-Item "Atualização\.harness\tests\context\DEP-001.md"     ".harness\tests\context\DEP-001.md"     -Force
Copy-Item "Atualização\.harness\tests\context\SEC-001.md"     ".harness\tests\context\SEC-001.md"     -Force
```

### BLOCO 7 — GitHub

```powershell
if (!(Test-Path ".github\workflows"))      { New-Item -ItemType Directory -Path ".github\workflows"      -Force }
if (!(Test-Path ".github\ISSUE_TEMPLATE")) { New-Item -ItemType Directory -Path ".github\ISSUE_TEMPLATE" -Force }

Copy-Item "Atualização\.github\workflows\harness-check.yml"          ".github\workflows\harness-check.yml"          -Force
Copy-Item "Atualização\.github\ISSUE_TEMPLATE\bug_report.md"         ".github\ISSUE_TEMPLATE\bug_report.md"         -Force
Copy-Item "Atualização\.github\ISSUE_TEMPLATE\feature_request.md"    ".github\ISSUE_TEMPLATE\feature_request.md"    -Force
```

### BLOCO 8 — Community Skills

```powershell
if (!(Test-Path "community-skills\skills\nextjs"))       { New-Item -ItemType Directory -Path "community-skills\skills\nextjs"       -Force }
if (!(Test-Path "community-skills\skills\python-fastapi")) { New-Item -ItemType Directory -Path "community-skills\skills\python-fastapi" -Force }
if (!(Test-Path "community-skills\skills\lgpd"))          { New-Item -ItemType Directory -Path "community-skills\skills\lgpd"          -Force }

Copy-Item "Atualização\community-skills\README.md"                        "community-skills\README.md"                        -Force
Copy-Item "Atualização\community-skills\skills\nextjs\SKILL.md"           "community-skills\skills\nextjs\SKILL.md"           -Force
Copy-Item "Atualização\community-skills\skills\python-fastapi\SKILL.md"   "community-skills\skills\python-fastapi\SKILL.md"   -Force
Copy-Item "Atualização\community-skills\skills\lgpd\SKILL.md"             "community-skills\skills\lgpd\SKILL.md"             -Force
```

### BLOCO 9 — Instalar pre-commit hook

```powershell
Copy-Item ".harness\quality-gates\pre-commit" ".git\hooks\pre-commit" -Force
```

No Git Bash ou WSL, dar permissão de execução:
```bash
chmod +x .git/hooks/pre-commit
chmod +x .harness/quality-gates/pre-commit
chmod +x .harness/quality-gates/agent-judge.sh
```

---

## VERIFY — Confirmar todos os arquivos

```powershell
# Verificar arquivos principais
Select-String -Path "README.md"  -Pattern "Use the agent you want"
Select-String -Path "AGENTS.md"  -Pattern "5 Princípios Arquiteturais"
Select-String -Path "AGENTS.md"  -Pattern "Versão: 2.6.0"
Select-String -Path "CLAUDE.md"  -Pattern "v2.6.0"
Select-String -Path "GEMINI.md"  -Pattern "v2.6.0"

# Verificar estrutura de pastas
Test-Path ".harness\doe\diretrizes.md"
Test-Path ".harness\quality-gates\pre-commit"
Test-Path ".harness\skills\context7\SKILL.md"
Test-Path ".harness\tests\context\DS-001.md"
Test-Path ".harness\index.md"
Test-Path "execution\stats.js"
Test-Path "execution\validate_action.py"
Test-Path "execution\handoff.py"
Test-Path "directives\failure-taxonomy.md"
Test-Path "directives\office-hours.md"
Test-Path ".github\workflows\harness-check.yml"
Test-Path "community-skills\skills\nextjs\SKILL.md"
Test-Path ".git\hooks\pre-commit"
```

Todos devem retornar `True` ou match. Se algum falhar → pare e informe.

---

## COMMIT

Após todas as verificações passarem:

```powershell
git add -A
git commit -m "feat: Bifrost v2.6.0 — atualização completa (fases 0-6)

- 5 Princípios Arquiteturais oficiais
- Posicionamento: 'Use the agent you want'
- Token Filter semântico no .harness/index.md
- Regression cases DS-001, DS-002, DEP-001, SEC-001
- Failure Taxonomy A/B/C/D/E/U
- Auto-Hashimoto no pre-commit v2.6.0
- directives: office-hours, failure-taxonomy, diagnose, session-memory
- execution: stats.js, self-correction, validate_action, handoff (WIP commits)
- agents: code-reviewer com viés do avaliador
- community-skills: Next.js, FastAPI, LGPD
- .harness/doe: diretrizes, orquestracao, execucao
- .github: CI harness-check + issue templates
- CONTRIBUTING.md com changelog semântico e anti-directive hell"

git push origin main
```

---

## CONFIRMAÇÃO FINAL

Após o push, execute:

```powershell
git log --oneline -1
git status
```

Informe o resultado. O esperado é:
```
[hash] feat: Bifrost v2.6.0 — atualização completa (fases 0-6)
On branch main — nothing to commit, working tree clean
```

Se tudo passar → informe:
**"✅ Bifrost v2.6.0 instalado com sucesso"**

---

## EM CASO DE ERRO

Se qualquer passo falhar:

```powershell
# Reverter tudo
git checkout -- .
git clean -fd
```

Depois informe qual bloco falhou e o erro exato.

---

## APÓS A INSTALAÇÃO — Próximos passos manuais

1. **npm publish** (fazer você mesmo no PowerShell):
```powershell
cd "C:\Users\leegr\Downloads\harness-npm\harness-npm"
npm publish --access public
```

2. **Context7** (se ainda não instalado):
```powershell
cd "C:\Workspace\Bifrost_Harness-Engineering"
npx ctx7 setup --claude
```

3. **Verificar smoke test**:
```powershell
npx harness-engineering check
```

---

*Este documento pode ser descartado após instalação confirmada.*
