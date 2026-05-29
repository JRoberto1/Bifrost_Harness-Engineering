#!/usr/bin/env node
// ============================================================
// Bifrost — Harness Engineering CLI
// v3.0.0 — setup-hooks global, auto-save por commit
// ============================================================

const fs   = require("fs");
const path = require("path");
const https = require("https");
const readline = require("readline");

const VERSION = "3.0.0";
const TARGET  = process.cwd();

const c = {
  reset:"\x1b[0m", bold:"\x1b[1m", green:"\x1b[32m",
  yellow:"\x1b[33m", blue:"\x1b[34m", cyan:"\x1b[36m", red:"\x1b[31m"
};
const ok   = s => console.log(`  ${c.green}✓${c.reset} ${s}`);
const warn = s => console.log(`  ${c.yellow}⚠${c.reset} ${s}`);
const info = s => console.log(`  ${c.cyan}→${c.reset} ${s}`);

// Compara versões semver (sem dependência externa)
function semverGte(a,b){
  const pa=a.split(".").map(n=>parseInt(n,10)||0);
  const pb=b.split(".").map(n=>parseInt(n,10)||0);
  for(let i=0;i<3;i++){
    if((pa[i]||0)>(pb[i]||0))return true;
    if((pa[i]||0)<(pb[i]||0))return false;
  }
  return true; // equal
}

// Lê arquivo bundled do pacote (bin/directives/, bin/skills/, etc.)
function readBundledDir(dir, name){
  const f=path.join(__dirname,dir,name);
  try{return fs.readFileSync(f,"utf8");}catch(_){return "";}
}

// Directive constants — lidas de bin/directives/ (bundled no pacote npm)
const DIRECTIVE_SESSION_MEMORY    = readBundledDir("directives","session-memory.md");
const DIRECTIVE_CONTEXT_MGMT      = readBundledDir("directives","context-management.md");
const DIRECTIVE_OBS_MASKING       = readBundledDir("directives","observation-masking.md");
const DIRECTIVE_SUBAGENT          = readBundledDir("directives","subagent-dispatch.md");
const DIRECTIVE_HARNESS_EVOLUTION = readBundledDir("directives","harness-evolution.md");
const DIRECTIVE_DIAGNOSE          = readBundledDir("directives","diagnose.md");
const DIRECTIVE_HEALTH_CHECK      = readBundledDir("directives","health-check.md");
const DIRECTIVE_SPEC_DRIVEN       = readBundledDir("directives","spec-driven.md");
const DIRECTIVE_TESTING           = readBundledDir("directives","testing.md");
const DIRECTIVE_DEPLOYMENT        = readBundledDir("directives","deployment.md");
const DIRECTIVE_CODE_REVIEW       = readBundledDir("directives","code-review.md");
const DIRECTIVE_REFACTORING       = readBundledDir("directives","refactoring.md");
const DIRECTIVE_MOBILE            = readBundledDir("directives","mobile.md");
const DIRECTIVE_DATA_SCIENCE      = readBundledDir("directives","data-science.md");
const DIRECTIVE_ARCHITECTURE      = readBundledDir("directives","architecture.md");
const DIRECTIVE_ONBOARDING        = readBundledDir("directives","onboarding.md");

// Única interface readline — canal bidirecional: bufferiza linhas E resolvers
// Evita: (1) pausar stdin entre perguntas, (2) perder linhas em stdin piped
const _rl = readline.createInterface({input:process.stdin,output:process.stdout});
const _lines = [];    // linhas que chegaram antes do ask()
const _waiters = [];  // resolvers esperando linha
_rl.on("line", line => {
  if(_waiters.length) _waiters.shift()(line);
  else _lines.push(line);
});
_rl.on("close", () => { while(_waiters.length) _waiters.shift()(""); });
function _closeRl(){ if(!_rl.closed) _rl.close(); }

function ask(q, def="") {
  process.stdout.write(def?`${q} [${def}]: `:`${q}: `);
  return new Promise(r => {
    if(_lines.length) { r(_lines.shift().trim()||def); }
    else { _waiters.push(line => r(line.trim()||def)); }
  });
}
function askYN(q){return ask(`${q} [s/n]`,"n").then(a=>a.toLowerCase()==="s");}

function write(p,content,overwrite=false){
  const full=path.join(TARGET,p);
  fs.mkdirSync(path.dirname(full),{recursive:true});
  if(!overwrite&&fs.existsSync(full))return false;
  fs.writeFileSync(full,content,"utf8");
  return true;
}

// Lê skill do pacote npm (bin/skills/<name>.md) — MIT, antigravity-awesome-skills
function fetchSkill(name){
  const skillFile = path.join(__dirname, "skills", name + ".md");
  if(!fs.existsSync(skillFile)) return Promise.resolve(false);
  try { return Promise.resolve(fs.readFileSync(skillFile, "utf8")); }
  catch(_){ return Promise.resolve(false); }
}

// Extrai descrição do frontmatter YAML de um arquivo de skill
function skillDesc(name){
  const skillFile = path.join(__dirname, "skills", name + ".md");
  if(!fs.existsSync(skillFile)) return "";
  try {
    const lines = fs.readFileSync(skillFile, "utf8").split("\n");
    for(const l of lines){
      const m = l.match(/^description:\s*["']?(.+?)["']?\s*$/);
      if(m) return m[1].slice(0, 60) + (m[1].length > 60 ? "…" : "");
    }
  } catch(_){}
  return "";
}

const BUNDLES = {
  essentials: ["brainstorming","debugging-strategies","doc-coauthoring","lint-and-validate","create-pr","performance-audit"],
  saas:       ["frontend-design","api-design-principles","lint-and-validate","create-pr","accessibility"],
  api:        ["api-design-principles","lint-and-validate","create-pr","performance-audit"],
  security:   ["security-auditor","lint-and-validate"],
};

// ── Conteúdo dos arquivos ──────────────────────────────────

function agentsMd(name,desc,stack,domains){
  const m=v=>v?"x":" ";
  return `# AGENTS.md — ${name}
<!-- Claude Code · Antigravity · OpenCode · Cursor · Copilot -->
<!-- Bifrost v${VERSION} -->

> Leia este arquivo completamente antes de qualquer ação.

## Identidade

Você é um agente de engenharia do projeto **${name}**.
${desc}

Stack: ${stack}

## Arquitetura de 3 Camadas

\`\`\`
Camada 1 — directives/      → SOPs: o QUE fazer
                ↓
Camada 2 — .harness/pev/    → Protocolo PEV: PLAN → EXECUTE → VERIFY
                ↓
Camada 3 — execution/       → Scripts determinísticos: FAZ
\`\`\`

## Regras Absolutas

1. Nunca avance sem validar o output da etapa anterior
2. Nunca invente — marque \`[VERIFICAR: motivo]\`
3. Nunca quebre a arquitetura de \`docs/architecture.md\`
4. Verifique \`execution/\` antes de criar script novo
5. Nunca use \`any\` em TypeScript nem ignore erros
6. Aplique o Protocolo PEV em tarefas com 3+ arquivos
7. Aplique a Regra de Hashimoto: cada erro melhora o harness
8. Classifique a intenção antes de executar (Intent Gate)

## Intent Gate

| Intenção | Ação |
|----------|------|
| Pesquisa | Responda direto, sem carregar directives |
| Implementação | Carregue directive + PEV |
| Investigação | Carregue \`directives/diagnose.md\` |
| Correção | Carregue directive + PEV + Hashimoto |
| Revisão | Carregue \`directives/observation-masking.md\` |

## Protocolo PEV

\`\`\`
PLAN    → critérios verificáveis antes de qualquer código
EXECUTE → dentro do plano aprovado
VERIFY  → falha = volta ao Plan com contexto de erro
\`\`\`

## Frases Proibidas

| Proibido | Tokens | Substituto |
|---------|--------|-----------|
| "Vou ser feliz em ajudar..." | 8 | [execute] |
| "O motivo pelo qual isto..." | 7 | [causa direta] |
| "Eu recomendaria que..." | 7 | [afirme] |
| "Claro, deixa eu ver isso" | 8 | [veja e responda] |

## Memória

Ao iniciar: leia \`.harness/memory/last-session.json\` se existir.
Ao encerrar: salve em \`.harness/memory/last-session.json\`.
Claude Code: \`/wrap-session\` e \`/brief-session\`.

## Domínios Ativos

- [${m(domains.saas)}] SaaS Web              → \`.harness/domains/saas.md\`
- [${m(domains.api)}] API / Backend         → \`.harness/domains/api.md\`
- [${m(domains.auto)}] Automação / Scripts   → \`.harness/domains/automation.md\`
- [${m(domains.jf)}] Jurídico / Financeiro → \`.harness/domains/juridico-financeiro.md\`

## Skills

> Instale: \`npx harness-engineering skill <nome>\`

*Bifrost v${VERSION} — ${new Date().toISOString().split("T")[0]}*
`;
}

const DOMAINS = {
  saas:`# Domínio: SaaS / Produto Web\n\n## Regras\n- Ações destrutivas exigem confirmação\n- JWT: máx 24h · Refresh em httpOnly cookie\n- Validação no cliente E servidor\n- Dados sensíveis fora dos logs\n\n## Quality Gates\n- [ ] Sem console.error em produção\n- [ ] Imagens com alt · Formulários acessíveis\n- [ ] Variáveis de ambiente validadas no startup\n`,
  api:`# Domínio: API / Backend\n\n## Regras\n- Versioning: /api/v1/\n- Envelope: { success, data, error, meta }\n- Rate limiting em endpoints públicos\n- SQL: sempre parametrizado\n\n## Quality Gates\n- [ ] Schema de validação em todos endpoints\n- [ ] Timeout em chamadas externas\n- [ ] Health check em /health\n`,
  automation:`# Domínio: Automações / Scripts\n\n## Regras\n- Idempotência: pode rodar N vezes\n- Falha explícita: nunca silenciosa\n- Estado persistido para retomada\n- --dry-run obrigatório\n\n## Quality Gates\n- [ ] Script tem --dry-run\n- [ ] Logs com job_id, step, timestamp\n- [ ] Retry com backoff exponencial\n`,
  jf:`# Domínio: Jurídico / Financeiro\n\n## Regras Absolutas\n- NUNCA gere cláusula sem base legal (CC/2002, CLT, LGPD)\n- NUNCA omita campos — use [DADO_AUSENTE: descrição]\n- Valores monetários: SEMPRE centavos (integer), nunca float\n- Cálculos: use biblioteca de precisão (Decimal.js)\n\n## Quality Gates\n- [ ] Identificação completa das partes\n- [ ] Cláusulas: objeto, valor, prazo, rescisão, foro\n- [ ] Para TI: cláusula de propriedade intelectual\n- [ ] Para dados pessoais: cláusula de LGPD\n- [ ] Nenhum [DADO_AUSENTE] no documento final\n- [ ] Todos os valores em centavos\n`,
};

const CONFIG_JSON = `{
  "$schema": "./.harness/config.schema.json",
  "version": "${VERSION}",
  "protected_paths": [".env", ".env.*", "secrets/", "credentials/", "terraform/", "infra/", "*.pem", "*.key"],
  "allowed_paths": ["src/", "app/", "components/", "lib/", "pages/", "directives/", "execution/", "docs/", "AGENTS.md", "CLAUDE.md", "GEMINI.md"],
  "tech_choice_mode": "ask",
  "session": { "auto_wrap_on_stop": true, "compress_after_turns": 8, "memory_path": ".harness/memory" },
  "quality_gate": { "block_secrets": true, "block_console_log": true, "block_typescript_any": true, "block_float_monetary": false, "block_env_commit": true }
}`;

const INDEX_MD = `# .harness/index.md — Índice Central do Bifrost\n<!-- v${VERSION} -->\n\n> Leia PRIMEIRO. Carregue apenas o que tiver match.\n\n## Directives\n\n| Arquivo | Palavras-chave | Quando carregar |\n|---------|---------------|----------------|\n| \`directives/session-memory.md\` | sessão, memória, retomar, parar, continuar | ao iniciar/encerrar |\n| \`directives/context-management.md\` | tokens, contexto, compressão, budget | ao gerenciar tokens |\n| \`directives/subagent-dispatch.md\` | subagente, delegar, tarefa pesada | tarefa > 20k tokens |\n| \`directives/observation-masking.md\` | log longo, output longo, masking | output > 20 linhas |\n| \`directives/harness-evolution.md\` | evolução, hashimoto, melhoria, erro recorrente | ao melhorar harness |\n| \`directives/diagnose.md\` | diagnóstico, investigar, por que quebrou | ao investigar falhas |\n| \`directives/health-check.md\` | saúde, verificar harness, integridade | ao iniciar sessão |\n| \`directives/spec-driven.md\` | spec, especificação, requisitos, antes de código | ao iniciar feature |\n| \`directives/testing.md\` | teste, tdd, cobertura, jest, pytest, vitest | ao escrever/revisar testes |\n| \`directives/deployment.md\` | deploy, produção, release, vercel, docker, ci/cd | antes de qualquer deploy |\n| \`directives/code-review.md\` | review, revisão, pr, pull request, feedback | ao revisar código |\n| \`directives/refactoring.md\` | refactor, refatorar, extrair, simplificar | ao refatorar código |\n| \`directives/mobile.md\` | mobile, react native, flutter, ios, android, expo | ao desenvolver mobile |\n| \`directives/data-science.md\` | pandas, jupyter, ml, dataset, análise de dados | ao analisar dados / ML |\n| \`directives/architecture.md\` | arquitetura, adr, decisão técnica, clean architecture | ao tomar decisões arquiteturais |\n| \`directives/onboarding.md\` | onboarding, novo desenvolvedor, setup, primeiro dia | ao integrar novo dev |\n\n## Domínios\n\n| Arquivo | Palavras-chave |\n|---------|---------------|\n| \`.harness/domains/saas.md\` | frontend, UI, autenticação, JWT, produto web |\n| \`.harness/domains/api.md\` | endpoint, API, REST, backend, rota |\n| \`.harness/domains/automation.md\` | script, automação, batch, pipeline |\n| \`.harness/domains/juridico-financeiro.md\` | contrato, cláusula, LGPD, valor, pagamento |\n\n## Camada 2 — Protocolo PEV\n\n| Arquivo | Quando usar |\n|---------|------------|\n| \`.harness/pev/pev.md\` | antes de qualquer tarefa complexa — PLAN → EXECUTE → VERIFY |\n`;

const LAST_SESSION_JSON = `{
  "$schema": "https://bifrost.harness/session-schema/v1",
  "session_id": "",
  "timestamp": "",
  "runtime": "",
  "harness_version": "${VERSION}",
  "task_summary": "",
  "context_level_at_close": "",
  "open_items": [],
  "decisions_made": [],
  "files_modified": [],
  "next_action": "",
  "hashimoto_events": []
}`;

const HASHIMOTO_LOG = `# Hashimoto Log\n| Data | Tipo | Descrição | Arquivo Corrigido |\n|------|------|-----------|-------------------|\n`;

const SESSION_SCHEMA = `# Session Schema v1\nSchema de memória entre sessões — veja docs/session-schema.md\nno repositório Bifrost para documentação completa.\nhttps://github.com/JRoberto1/Bifrost_Harness-Engineering/blob/main/docs/session-schema.md\n`;

const GITATTRIBUTES = `* text=auto eol=lf\n*.md text eol=lf\n*.py text eol=lf\n*.json text eol=lf\n*.yml text eol=lf\n`;

const POST_COMMIT_HOOK = `#!/bin/sh
# Bifrost Global Hook v1.0.0
# Atualiza last-session.json automaticamente após cada commit
# Instalado por: npx harness-engineering setup-hooks

HARNESS_DIR=".harness/memory"
SESSION_FILE="$HARNESS_DIR/last-session.json"

# Só executa se o projeto tiver o Bifrost instalado
if [ ! -f ".harness/VERSION" ]; then
  exit 0
fi

# Garante que a pasta existe
mkdir -p "$HARNESS_DIR"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
FILES=$(git diff-tree --no-commit-id -r --name-only HEAD 2>/dev/null | tr '\\n' ',' | sed 's/,$//')
COMMIT_MSG=$(git log -1 --pretty=%B 2>/dev/null | head -1 | sed 's/"/\\\\"/g')
HARNESS_VERSION=$(cat .harness/VERSION 2>/dev/null | grep -o 'v[0-9.]*' || echo "unknown")

# Formata files como array JSON
if [ -z "$FILES" ]; then
  FILES_JSON="[]"
else
  FILES_JSON="[\\"$(echo "$FILES" | sed 's/,/\\",\\"/g')\\"]"
fi

cat > "$SESSION_FILE" << ENDJSON
{
  "\\$schema": "https://bifrost.harness/session-schema/v1",
  "session_id": "\${TIMESTAMP}",
  "timestamp": "\${TIMESTAMP}",
  "runtime": "claude-code",
  "harness_version": "\${HARNESS_VERSION}",
  "task_summary": "\${COMMIT_MSG}",
  "context_level_at_close": "L2",
  "open_items": [],
  "decisions_made": [],
  "files_modified": \${FILES_JSON},
  "next_action": "Continuar desenvolvimento — ver último commit para contexto",
  "hashimoto_events": []
}
ENDJSON

echo "✓ Bifrost: last-session.json atualizado"
`;

// ── Detecção de stack ─────────────────────────────────────────
function detectStack(){
  const cwd=process.cwd();
  const exists=f=>fs.existsSync(path.join(cwd,f));
  const readJSON=f=>{try{return JSON.parse(fs.readFileSync(path.join(cwd,f),"utf8"));}catch{return null;}};

  const result={name:"",stack:"",domains:{saas:false,api:false,automation:false,jf:false},bundle:"essentials",confidence:{}};

  // Nome do projeto
  const pkg=readJSON("package.json");
  if(pkg?.name){
    result.name=pkg.name.replace(/^@[^/]+\//,"");
    result.confidence.name="package.json";
  }

  // Framework principal
  const deps={...pkg?.dependencies,...pkg?.devDependencies};

  if(exists("next.config.js")||exists("next.config.ts")||exists("next.config.mjs")||deps.next){
    result.stack="Next.js";result.confidence.stack="next.config.* ou deps";
  } else if(exists("vite.config.js")||exists("vite.config.ts")||deps.vite){
    result.stack=deps.react?"React + Vite":deps.vue?"Vue + Vite":"Vite";result.confidence.stack="vite.config.*";
  } else if(exists("nuxt.config.js")||exists("nuxt.config.ts")||deps.nuxt){
    result.stack="Nuxt.js";result.confidence.stack="nuxt.config.*";
  } else if(deps.express||deps.fastify||deps.hono){
    result.stack=`Node.js + ${deps.express?"Express":deps.fastify?"Fastify":"Hono"}`;result.confidence.stack="package.json deps";
  } else if(exists("pyproject.toml")||exists("requirements.txt")){
    result.stack="Python";result.confidence.stack="pyproject.toml / requirements.txt";
    try{
      const req=fs.readFileSync(path.join(cwd,"requirements.txt"),"utf8");
      if(req.includes("fastapi"))result.stack="Python + FastAPI";
      else if(req.includes("django"))result.stack="Python + Django";
      else if(req.includes("flask"))result.stack="Python + Flask";
    }catch{}
  } else if(exists("Cargo.toml")){
    result.stack="Rust";result.confidence.stack="Cargo.toml";
  } else if(exists("go.mod")){
    result.stack="Go";result.confidence.stack="go.mod";
  } else if(deps.react){
    result.stack="React";result.confidence.stack="package.json deps";
  }

  // Domínios
  if(exists("prisma")||deps.prisma||deps["@prisma/client"]){
    result.domains.saas=true;result.confidence.saas="prisma/";
  }
  if(deps.stripe||deps["@stripe/stripe-js"]){
    result.domains.saas=true;result.domains.jf=true;result.confidence.jf="stripe nas deps";
  }
  if(deps.express||deps.fastify||deps.hono||deps.axios||deps["@trpc/server"]){
    result.domains.api=true;result.confidence.api="deps de servidor/cliente HTTP";
  }
  if(exists(".github/workflows")||exists("Dockerfile")||exists("docker-compose.yml")||exists("docker-compose.yaml")){
    result.domains.automation=true;result.confidence.automation="workflows/ ou Dockerfile";
  }

  // Bundle sugerido
  if(result.domains.saas&&result.stack.includes("Next"))result.bundle="saas";
  else if(result.domains.api)result.bundle="api";
  else result.bundle="essentials";

  return result;
}

// ── writeHarnessFiles — lógica de escrita reutilizável ────────
async function writeHarnessFiles({name,desc,stack,domains,skipFiles=[]}){
  const skip=new Set(skipFiles);
  // Normaliza automation/auto
  const dom={saas:!!domains.saas,api:!!domains.api,auto:!!(domains.auto??domains.automation),jf:!!domains.jf};

  // Core
  const agents=agentsMd(name,desc,stack,dom);
  if(!skip.has("AGENTS.md")){
    write("AGENTS.md",agents,true);write("CLAUDE.md",agents,true);write("GEMINI.md",agents,true);
    ok("AGENTS.md · CLAUDE.md · GEMINI.md");
  }

  write(".harness/VERSION",VERSION,true);ok(".harness/VERSION");
  write(".harness/index.md",INDEX_MD,true);ok(".harness/index.md");
  write(".harness/config.json",CONFIG_JSON,true);ok(".harness/config.json");
  write(".harness/memory/last-session.json",LAST_SESSION_JSON,true);
  write(".harness/memory/hashimoto-log.md",HASHIMOTO_LOG,true);
  ok(".harness/memory/");

  // Domínios
  if(dom.saas){write(".harness/domains/saas.md",DOMAINS.saas,true);ok("domain: saas");}
  if(dom.api) {write(".harness/domains/api.md",DOMAINS.api,true);ok("domain: api");}
  if(dom.auto){write(".harness/domains/automation.md",DOMAINS.automation,true);ok("domain: automation");}
  if(dom.jf)  {write(".harness/domains/juridico-financeiro.md",DOMAINS.jf,true);ok("domain: juridico-financeiro");}

  // PEV
  write(".harness/pev/pev.md",`# PEV — Plan · Execute · Verify\n\nPLAN    → critérios verificáveis antes de qualquer código\nEXECUTE → dentro do plano aprovado\nVERIFY  → falha = volta ao Plan com contexto de erro\n`,true);
  ok(".harness/pev/pev.md");

  // SKILL template
  write(".harness/skills/SKILL-template.md",`# SKILL: [NOME]\n\n## Quando Usar\n[Descreva]\n\n## Procedimento\n1. [Passo 1]\n\n## Output\n[Descreva]\n`,true);

  // Directives — 16 SOPs reais + template
  const DIRECTIVES_LIST=[
    ["session-memory.md",      DIRECTIVE_SESSION_MEMORY],
    ["context-management.md",  DIRECTIVE_CONTEXT_MGMT],
    ["observation-masking.md", DIRECTIVE_OBS_MASKING],
    ["subagent-dispatch.md",   DIRECTIVE_SUBAGENT],
    ["harness-evolution.md",   DIRECTIVE_HARNESS_EVOLUTION],
    ["diagnose.md",            DIRECTIVE_DIAGNOSE],
    ["health-check.md",        DIRECTIVE_HEALTH_CHECK],
    ["spec-driven.md",         DIRECTIVE_SPEC_DRIVEN],
    ["testing.md",             DIRECTIVE_TESTING],
    ["deployment.md",          DIRECTIVE_DEPLOYMENT],
    ["code-review.md",         DIRECTIVE_CODE_REVIEW],
    ["refactoring.md",         DIRECTIVE_REFACTORING],
    ["mobile.md",              DIRECTIVE_MOBILE],
    ["data-science.md",        DIRECTIVE_DATA_SCIENCE],
    ["architecture.md",        DIRECTIVE_ARCHITECTURE],
    ["onboarding.md",          DIRECTIVE_ONBOARDING],
  ];
  for(const[f,content] of DIRECTIVES_LIST){
    if(content) write(`directives/${f}`,content,true);
  }
  write("directives/DIRECTIVE-template.md",`# Directive: [NOME]\n\n## Objetivo\n[Uma frase]\n\n## Fluxo\n1. [Passo]\n\n## Aprendizados\n- [data] [aprendizado]\n`,true);
  ok("directives/ (16 directives + template)");

  // Execution
  write("execution/SCRIPT-template.py",`#!/usr/bin/env python3\n"""Script determinístico — Camada 3 do Bifrost.\nUso: python execution/SCRIPT-template.py --input "valor" [--dry-run]\n"""\nimport argparse,json,sys\n\ndef main():\n    p=argparse.ArgumentParser()\n    p.add_argument("--input",required=True)\n    p.add_argument("--dry-run",action="store_true")\n    args=p.parse_args()\n    if args.dry_run:\n        print(json.dumps({"status":"success","dry_run":True,"simulacao":args.input}))\n        sys.exit(0)\n    print(json.dumps({"status":"success","resultado":args.input}))\n\nif __name__=="__main__":main()\n`,true);
  ok("execution/SCRIPT-template.py");

  // Claude commands
  const cmds={
    "spec.md":`# /spec — Spec-Driven Development\n\nEscreva a spec ANTES de qualquer código.\n\n## Instrução\nCrie um documento de spec com: visão geral, problema, escopo (inclui/não inclui), critérios de aceitação, impacto técnico.\nSalve em docs/specs/[nome].md. Aguarde aprovação antes de implementar.\n\n## Anti-Rationalization\n❌ "É urgente" → Urgência é motivo para ter spec, não para pular\n❌ "É simples" → Spec descobre complexidade antes do código\n`,
    "plan.md":`# /plan — Decomposição em Tarefas\n\nDecomponha em tarefas com critérios verificáveis.\n\n## Instrução\nLeia a spec em docs/specs/ se existir. Crie tabela com: tarefa, arquivo(s), critério verificável, dependência.\nAguarde aprovação antes de executar.\n\n## Anti-Rationalization\n❌ "As tarefas são óbvias" → Se é óbvio, leva 2min escrever. Escreva.\n❌ "Posso fazer tudo de uma vez" → Tarefas grandes = contexto pesado = erros\n`,
    "review.md":`# /review — Code Review Multi-Dimensional\n\nQuality gate antes de merge.\n\n## 5 Dimensões\n1. Correção — faz o que a spec diz?\n2. Legibilidade — nomes claros, responsabilidade única?\n3. Arquitetura — segue as camadas?\n4. Segurança — inputs validados, sem credenciais hardcoded?\n5. Performance — sem N+1, sem loops desnecessários?\n\n## Anti-Rationalization\n❌ "Eu escrevi, sei que está certo" → Revisão existe por isso\n❌ "Testes passam, está bom" → Testes passam código errado o tempo todo\n`,
    "ship.md":`# /ship — Checklist de Produção\n\nNão faça deploy sem este checklist.\n\n## Checklist\n- [ ] /review executado e aprovado\n- [ ] Todos os testes passando\n- [ ] Sem console.log em produção\n- [ ] .env não commitado\n- [ ] docs/architecture.md atualizado se houve decisão nova\n- [ ] Build passa localmente\n- [ ] Plano de rollback definido\n\n## Anti-Rationalization\n❌ "É urgente, vou pular alguns" → Urgência não cancela segurança\n❌ "É só um hotfix" → Hotfixes sem checklist geram hotfixes de hotfix\n`,
    "wrap-session.md":`# /wrap-session — Encerrar Sessão\n\nSalva o contexto antes de parar. Usa ~500 tokens na próxima sessão em vez de 20k.\n\n## Instrução\nResuma: decisões tomadas, tarefas concluídas, tarefas pendentes (com prioridade), próximo passo exato, aprendizados Hashimoto.\nSalve em .harness/memory/last-session.json e em .harness/memory/YYYY-MM-DD-[tema].md.\n`,
    "brief-session.md":`# /brief-session — Retomar Sessão\n\nLê o contexto salvo. Economiza 97% dos tokens de reintrodução.\n\n## Instrução\nLeia .harness/memory/last-session.json. Apresente: o que foi concluído, o que está pendente, próximo passo. Aguarde instrução antes de executar.\n`,
    "context-check.md":`# /context-check — Verificar Contexto\n\n## Instrução\nReporte: directives carregadas, turnos desta sessão, tokens estimados.\nSe --compress: execute python execution/compress-history.py --auto\n`,
    "model-select.md":`# /model-select — Selecionar Modelo\n\n## Tabela\n| Tarefa | Modelo |\n|--------|--------|\n| Docs, testes, formatação | Haiku / Mini |\n| Código, implementação | Sonnet / padrão |\n| Arquitetura, debugging | Opus / Pro |\n\n## Instrução\nSe o usuário passou uma descrição, classifique e recomende em 2 linhas.\n`,
  };
  for(const[f,content] of Object.entries(cmds))write(`.claude/commands/${f}`,content,true);
  ok(".claude/commands/ (8 comandos)");

  // Docs
  write("docs/architecture.md",`# Arquitetura\n\n> Preencha com a stack REAL do projeto.\n\n## Stack\n\n| Camada | Tecnologia |\n|--------|----------|\n| Frontend | ${stack} |\n\n## Camadas e Dependências\n\n\`\`\`\n[descreva as camadas]\n\`\`\`\n\n## ADRs\n\n### ADR-001: [Decisão]\n**Data:** | **Status:** Aceita\n**Contexto:** [por quê]\n**Decisão:** [o que]\n`,true);
  write("docs/domain-rules.md",`# Regras de Domínio\n\n> Preencha com as regras de negócio REAIS.\n> Atualize sempre que encontrar uma regra nova (Hashimoto).\n\n## Schemas\n\n\`\`\`typescript\n// defina seus tipos aqui\n\`\`\`\n\n## Regras de Negócio\n\n### RN-001: [Nome]\n**Descrição:** [o que impõe]\n**Motivo:** [por que existe]\n`,true);
  write("docs/coding-standards.md",`# Padrões de Código\n\n## Regras\n- Sem \`any\` em TypeScript\n- Erros tratados explicitamente\n- Logs estruturados\n- Commits: \`tipo(escopo): descrição\`\n  - feat, fix, docs, refactor, test, harness\n`,true);
  ok("docs/ (architecture, domain-rules, coding-standards)");
  write("docs/session-schema.md",SESSION_SCHEMA,true);
  write(".gitattributes",GITATTRIBUTES,true);
  ok(".gitattributes · docs/session-schema.md");

  // Agents
  write("agents/code-reviewer.md",`# Agente: Code Reviewer\n\nRevisor sênior com framework de 5 dimensões: Correção · Legibilidade · Arquitetura · Segurança · Performance.\n\n## Ferramentas\nRead, Bash(grep:*), Bash(npm test:*), Bash(npm run lint:*)\n`,true);
  write("agents/security-auditor.md",`# Agente: Security Auditor\n\nAuditor focado em OWASP Top 10. Viés: tudo é vulnerável até provar o contrário.\n\n## Ferramentas\nRead, Bash(grep:*) — NUNCA Write ou Edit\n`,true);
  ok("agents/ (code-reviewer, security-auditor)");

  // .tmp + .gitignore
  fs.mkdirSync(path.join(TARGET,".tmp"),{recursive:true});
  write(".tmp/.gitkeep","# Temporários\n",true);
  const gi=path.join(TARGET,".gitignore");
  const toAdd=[".env",".env.*","!.env.example",".tmp/",".harness/skills/.index-cache.json"];
  let existing=fs.existsSync(gi)?fs.readFileSync(gi,"utf8"):"";
  const newLines=toAdd.filter(l=>!existing.includes(l));
  if(newLines.length)fs.appendFileSync(gi,"\n# Bifrost\n"+newLines.join("\n")+"\n");
  ok(".gitignore atualizado");
}

// ── Instalar ─────────────────────────────────────────────────
async function cmdInstall(){
  console.log(`\n${c.bold}╔══════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}║    🌉 Bifrost Harness v${VERSION}          ║${c.reset}`);
  console.log(`${c.bold}╚══════════════════════════════════════╝${c.reset}\n`);

  if(fs.existsSync(path.join(TARGET,".harness/VERSION"))){
    const v=fs.readFileSync(path.join(TARGET,".harness/VERSION"),"utf8").trim();
    warn(`Bifrost ${v} já instalado.`);
    info(`Instalar skills: npx harness-engineering skill --bundle essentials`);
    info(`Verificar: npx harness-engineering check`);
    return;
  }

  console.log(`${c.bold}[ 1/4 ] Sobre o projeto\n${c.reset}`);
  const name  = await ask("Nome do projeto");
  const desc  = await ask("Descrição em uma linha");
  const stack = await ask("Stack (ex: Next.js + Node + PostgreSQL)","não definida");

  console.log(`\n${c.bold}[ 2/4 ] Domínios ativos\n${c.reset}`);
  const domains={
    saas: await askYN("  SaaS / Produto Web?"),
    api:  await askYN("  API / Backend?"),
    auto: await askYN("  Automação / Scripts?"),
    jf:   await askYN("  Jurídico / Financeiro?"),
  };

  console.log(`\n${c.bold}[ 3/4 ] Instalando arquivos...\n${c.reset}`);
  await writeHarnessFiles({name,desc,stack,domains});

  // Skills essenciais
  console.log(`\n${c.bold}[ 4/4 ] Instalando skills essenciais...\n${c.reset}`);
  const bundle=domains.saas?"saas":"essentials";
  const skills=BUNDLES[bundle];
  let installed=0;
  for(const skill of skills){
    process.stdout.write(`  ${skill}... `);
    const s=await fetchSkill(skill);
    if(s){
      fs.writeFileSync(path.join(TARGET,".harness","skills",skill+".md"),s);
      console.log(`${c.green}✓${c.reset}`);
      installed++;
    } else {
      console.log(`${c.yellow}não encontrada${c.reset}`);
    }
  }
  if(installed===0){
    console.log(`\n  ${c.yellow}⚠${c.reset} Nenhuma skill instalada.`);
    console.log(`  Rode: ${c.cyan}npx harness-engineering skill --bundle essentials${c.reset}\n`);
  }

  // Registrar skills no AGENTS.md
  const ap=path.join(TARGET,"AGENTS.md");
  if(fs.existsSync(ap)&&installed>0){
    let content=fs.readFileSync(ap,"utf8");
    if(!content.includes("## Skills Instaladas")){
      content+="\n\n## Skills Instaladas\n\n> Instale mais: `npx harness-engineering skill --bundle essentials`\n\n";
      for(const s of skills)content+=`- \`.harness/skills/${s}/SKILL.md\`\n`;
      fs.writeFileSync(ap,content);
      fs.writeFileSync(path.join(TARGET,"CLAUDE.md"),content);
      fs.writeFileSync(path.join(TARGET,"GEMINI.md"),content);
    }
  }

  console.log(`\n${c.bold}╔══════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}║      🌉 Bifrost Instalado!           ║${c.reset}`);
  console.log(`${c.bold}╚══════════════════════════════════════╝${c.reset}\n`);
  console.log(`  Projeto: ${c.blue}${name}${c.reset}`);
  console.log(`  Skills:  ${c.blue}use 'npx harness-engineering skill --list'${c.reset}\n`);
  console.log(`${c.bold}  Próximos passos:${c.reset}`);
  info(`Abra ${c.cyan}AGENTS.md${c.reset} e leia as regras do harness`);
  info(`No Claude Code: leia ${c.cyan}CLAUDE.md${c.reset} antes de qualquer tarefa`);
  info(`No Antigravity: leia ${c.cyan}GEMINI.md${c.reset} antes de qualquer tarefa`);
  info(`Verificar instalação: ${c.cyan}npx harness-engineering check${c.reset}`);
  info(`Ver métricas: ${c.cyan}npx harness-engineering stats${c.reset}`);
  info(`Automação avançada: ${c.cyan}git clone https://github.com/JRoberto1/Bifrost_Harness-Engineering${c.reset}`);
  console.log();

  // Configurar hook global automaticamente
  console.log('\n  Configurando hook git global...');
  await cmdSetupHooks().catch(() => {
    console.log('  ⚠ Hook não configurado — rode: npx harness-engineering setup-hooks');
  });

  _closeRl();
}

// ── Adopt ─────────────────────────────────────────────────────
async function cmdAdopt(){
  console.log(`\n${c.bold}🌉 Bifrost Adopt${c.reset} — adaptando harness ao projeto existente\n`);

  // Detectar stack
  process.stdout.write(`  ${c.cyan}Analisando projeto...${c.reset}`);
  const detected=detectStack();
  console.log(" feito.\n");

  // Mostrar detecções
  const hasDetection=detected.name||detected.stack||Object.values(detected.domains).some(Boolean);
  if(hasDetection){
    console.log("  O que encontrei:\n");
    if(detected.name) console.log(`  📦 Nome:    ${c.blue}${detected.name}${c.reset} (${detected.confidence.name})`);
    if(detected.stack)console.log(`  🔧 Stack:   ${c.blue}${detected.stack}${c.reset} (${detected.confidence.stack})`);
    const domList=Object.entries(detected.domains).filter(([,v])=>v).map(([k])=>k);
    if(domList.length)console.log(`  🎯 Domínios: ${c.blue}${domList.join(", ")}${c.reset}`);
    console.log(`  📦 Bundle sugerido: ${c.cyan}${detected.bundle}${c.reset}\n`);
  } else {
    console.log(`  ${c.yellow}Nenhuma stack detectada automaticamente.${c.reset}\n`);
  }

  // Confirmar nome
  const defaultName=detected.name||path.basename(process.cwd());
  const projectName=await ask("Nome do projeto",defaultName);

  // Confirmar stack
  const projectStack=await ask("Stack principal (ex: Next.js, Django, Go)",detected.stack||"não definida");

  // Confirmar domínios (s/n com sugestão baseada na detecção)
  console.log();
  const domainLabels={saas:"SaaS / produto web",api:"API / integrações",automation:"Automação / CI-CD",jf:"Jurídico / financeiro"};
  const finalDomains={saas:false,api:false,auto:false,jf:false};
  for(const[key,label] of Object.entries(domainLabels)){
    const suggested=detected.domains[key]?"s":"n";
    const ans=await ask(`  Domínio: ${label}?`,suggested);
    const val=ans.toLowerCase()==="s"||ans.toLowerCase()==="y";
    if(key==="automation")finalDomains.auto=val;
    else finalDomains[key]=val;
  }

  // Harness existente?
  const harnessExists=fs.existsSync(path.join(TARGET,".harness","VERSION"));
  if(harnessExists){
    console.log(`\n  ${c.yellow}⚠${c.reset} Harness detectado neste projeto.`);
    const over=await ask("  Atualizar arquivos de infra (preserva AGENTS.md)?","s");
    if(!over.toLowerCase().startsWith("s")){
      console.log(`\n  Operação cancelada.\n`);_closeRl();return;
    }
  }

  // Instalar arquivos
  console.log(`\n${c.bold}  Instalando harness...\n${c.reset}`);
  const agentsExists=fs.existsSync(path.join(TARGET,"AGENTS.md"));
  const skipFiles=agentsExists?["AGENTS.md","CLAUDE.md","GEMINI.md"]:[];
  if(agentsExists)console.log(`  ${c.cyan}ℹ${c.reset} AGENTS.md existente preservado — atualize manualmente com sua stack.\n`);

  await writeHarnessFiles({
    name:projectName,
    desc:`Projeto ${projectStack}`,
    stack:projectStack,
    domains:finalDomains,
    skipFiles
  });

  // Skills
  const bundleAns=await ask(`\n  Instalar bundle "${detected.bundle}"?`,"s");
  if(bundleAns.toLowerCase().startsWith("s")){
    const bundleSkills=BUNDLES[detected.bundle]||BUNDLES.essentials;
    console.log(`\n  Instalando bundle ${c.cyan}${detected.bundle}${c.reset}...\n`);
    const skillsDir=path.join(TARGET,".harness","skills");
    if(!fs.existsSync(skillsDir))fs.mkdirSync(skillsDir,{recursive:true});
    let installed=0;
    for(const skillName of bundleSkills){
      const content=await fetchSkill(skillName);
      if(content){
        fs.writeFileSync(path.join(skillsDir,skillName+".md"),content);
        console.log(`  ${c.green}✓${c.reset} ${skillName}`);
        installed++;
      }
    }
    if(installed===0)console.log(`  ${c.yellow}⚠${c.reset} Nenhuma skill instalada.\n`);
  }

  // Welcome
  console.log(`\n${c.bold}╔══════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}║      🌉 Bifrost Adotado!             ║${c.reset}`);
  console.log(`${c.bold}╚══════════════════════════════════════╝${c.reset}\n`);
  console.log(`  Projeto: ${c.blue}${projectName}${c.reset}`);
  console.log(`  Stack:   ${c.blue}${projectStack||"não detectada"}${c.reset}\n`);
  console.log(`${c.bold}  Próximos passos:${c.reset}`);
  if(agentsExists)info(`Revise ${c.cyan}AGENTS.md${c.reset} e ajuste as regras para seu projeto`);
  else info(`Abra ${c.cyan}AGENTS.md${c.reset} e leia as regras do harness`);
  info(`No Claude Code: leia ${c.cyan}CLAUDE.md${c.reset} antes de qualquer tarefa`);
  info(`Verificar: ${c.cyan}npx harness-engineering check${c.reset}`);
  info(`Ver métricas: ${c.cyan}npx harness-engineering stats${c.reset}`);
  info(`Automação avançada: ${c.cyan}git clone https://github.com/JRoberto1/Bifrost_Harness-Engineering${c.reset}`);
  console.log();

  // Configurar hook global automaticamente
  console.log('\n  Configurando hook git global...');
  await cmdSetupHooks().catch(() => {
    console.log('  ⚠ Hook não configurado — rode: npx harness-engineering setup-hooks');
  });

  _closeRl();
}

// ── Skill ────────────────────────────────────────────────────
async function cmdSkill(args){
  if(!fs.existsSync(path.join(TARGET,".harness/VERSION"))){
    console.log(`\n${c.red}Bifrost não instalado.${c.reset} Rode: npx harness-engineering\n`);return;
  }
  if(!args.length||args[0]==="--list"){
    console.log(`\n${c.bold}Skills disponíveis${c.reset} (fonte: antigravity-awesome-skills · MIT)\n`);
    const seen=new Set();
    for(const[bundle,skills]of Object.entries(BUNDLES)){
      console.log(`${c.bold}Bundle: ${c.cyan}${bundle}${c.reset}`);
      const last=skills.length-1;
      skills.forEach((sk,i)=>{
        const prefix=i===last?"└──":"├──";
        if(seen.has(sk)){
          // Skill já mostrada em bundle anterior
          const firstBundle=Object.entries(BUNDLES).find(([,v])=>v.includes(sk)&&v!==skills)?.[0];
          console.log(`  ${prefix} ${sk} ${c.yellow}(ver ${firstBundle||"essentials"})${c.reset}`);
        } else {
          const desc=skillDesc(sk);
          console.log(`  ${prefix} ${c.green}${sk}${c.reset}${desc?` — ${desc}`:""}`);
          seen.add(sk);
        }
      });
      console.log();
    }
    console.log(`Instalar bundle: ${c.cyan}npx harness-engineering skill --bundle essentials${c.reset}`);
    console.log(`Instalar skill:  ${c.cyan}npx harness-engineering skill brainstorming${c.reset}`);
    console.log(`Atribuição: https://github.com/sickn33/antigravity-awesome-skills\n`);
    return;
  }
  let skillNames=[];
  if(args[0]==="--bundle"){
    const b=args[1]||"essentials";
    skillNames=BUNDLES[b]||[];
    if(!skillNames.length){console.log(`\n${c.red}Bundle '${b}' não existe.${c.reset}\n`);return;}
    console.log(`\nInstalando bundle '${c.cyan}${args[1]}${c.reset}' (${skillNames.length} skills)...\n`);
  }else{skillNames=[args[0]];console.log(`\nInstalando '${c.cyan}${args[0]}${c.reset}'...\n`);}
  let installed=0;
  const skillsDir=path.join(TARGET,".harness","skills");
  if(!fs.existsSync(skillsDir))fs.mkdirSync(skillsDir,{recursive:true});
  for(const skill of skillNames){
    process.stdout.write(`  ${skill}... `);
    const s=await fetchSkill(skill);
    if(s){
      fs.writeFileSync(path.join(skillsDir,skill+".md"),s);
      console.log(`${c.green}✓${c.reset}`);
      installed++;
    } else {
      console.log(`${c.yellow}não encontrada${c.reset}`);
      console.log(`    Disponíveis: ${c.cyan}npx harness-engineering skill --list${c.reset}`);
    }
  }
  if(installed===0){
    console.log(`\n  ${c.yellow}⚠${c.reset} Nenhuma skill instalada. Rode: ${c.cyan}npx harness-engineering skill --list${c.reset}\n`);
  }
  // Registrar
  const ap=path.join(TARGET,"AGENTS.md");
  if(fs.existsSync(ap)){
    let content=fs.readFileSync(ap,"utf8");
    if(!content.includes("## Skills Instaladas"))content+="\n\n## Skills Instaladas\n\n";
    for(const s of skillNames){
      if(!content.includes(s))content+=`- \`.harness/skills/${s}/SKILL.md\`\n`;
    }
    fs.writeFileSync(ap,content);
    for(const m of["CLAUDE.md","GEMINI.md"])
      if(fs.existsSync(path.join(TARGET,m)))fs.writeFileSync(path.join(TARGET,m),content);
  }
  console.log(`\n${c.green}✅ ${installed}/${skillNames.length} instaladas${c.reset}\n`);
}

// ── Check ─────────────────────────────────────────────────────
function cmdCheck(){
  console.log(`\n${c.bold}🌉 Bifrost Check${c.reset}\n${"=".repeat(30)}\n`);
  const checks=[
    ["AGENTS.md","AGENTS.md"],["CLAUDE.md","CLAUDE.md"],["GEMINI.md","GEMINI.md"],
    ["directives/","directives"],["execution/","execution"],
    [".harness/index.md",".harness/index.md"],[".harness/config.json",".harness/config.json"],
    [".harness/pev/pev.md",".harness/pev/pev.md"],[".harness/skills/",".harness/skills"],
    ["docs/architecture.md","docs/architecture.md"],
    ["docs/domain-rules.md","docs/domain-rules.md"],
    ["docs/coding-standards.md","docs/coding-standards.md"],
    [".claude/commands/spec.md",".claude/commands/spec.md"],
    [".claude/commands/wrap-session.md",".claude/commands/wrap-session.md"],
    ["directives/session-memory.md","directives/session-memory.md"],
    ["directives/harness-evolution.md","directives/harness-evolution.md"],
  ];
  let issues=0;
  for(const[label,p] of checks){
    const exists=fs.existsSync(path.join(TARGET,p));
    if(exists)ok(label); else{console.log(`  ${c.red}✗${c.reset} ${label}`);issues++;}
  }
  const sd=path.join(TARGET,".harness/skills");
  const sc=fs.existsSync(sd)?fs.readdirSync(sd).filter(f=>f.endsWith(".md")&&f!=="SKILL-template.md").length:0;
  sc>0?ok(`${sc} skill(s) instalada(s)`):warn("Sem skills — rode: npx harness-engineering skill --bundle essentials");
  console.log(`\n${"=".repeat(30)}`);
  if(issues===0)console.log(`${c.green}✅ Bifrost íntegro${c.reset}\n`);
  else console.log(`${c.red}❌ ${issues} problema(s)${c.reset} — rode: npx harness-engineering\n`);
}

// ── Upgrade ──────────────────────────────────────────────────
async function cmdUpgrade(args=[]){
  const force=args.includes("--force");
  const cwd=process.cwd();

  // Versão local do harness instalado no projeto
  let current="?";
  try{
    current=fs.readFileSync(path.join(cwd,".harness","VERSION"),"utf8").trim();
  }catch(_){
    try{
      const cfg=JSON.parse(fs.readFileSync(path.join(cwd,".harness","config.json"),"utf8"));
      current=cfg.version||"?";
    }catch(_){}
  }

  console.log(`\n${c.bold}🌉 Bifrost Upgrade${c.reset}\n${"=".repeat(30)}\n`);
  info(`CLI instalado: v${VERSION}`);
  info(`Harness no projeto: ${current}`);
  process.stdout.write(`  Verificando npm... `);

  const latest=await new Promise(resolve=>{
    const req=https.get(
      "https://registry.npmjs.org/harness-engineering/latest",
      {headers:{"Accept":"application/json"}},
      res=>{
        let data="";
        res.on("data",chunk=>data+=chunk);
        res.on("end",()=>{try{resolve(JSON.parse(data).version||null);}catch(_){resolve(null);}});
      }
    );
    req.on("error",()=>resolve(null));
    req.setTimeout(5000,()=>{req.destroy();resolve(null);});
  });

  if(!latest){
    console.log(`${c.yellow}offline${c.reset}`);
    warn("Não foi possível verificar versão no npm.");
    if(force)info("Use upgrade --force quando online para aplicar atualização.");
    console.log();
    return;
  }
  console.log(`${c.green}ok${c.reset}`);

  const isUpToDate=VERSION===latest||
    semverGte(VERSION,latest);

  if(isUpToDate&&!force){
    console.log(`\n  ${c.green}✓${c.reset} Bifrost já está na versão mais recente (v${latest})\n`);
    return;
  }

  if(!isUpToDate&&!force){
    console.log(`\n  ${c.yellow}Nova versão disponível:${c.reset} v${VERSION} → v${latest}`);
    console.log(`  Para atualizar: ${c.cyan}npx harness-engineering@latest upgrade --force${c.reset}`);
    console.log(`  ${c.yellow}⚠${c.reset} O upgrade não sobrescreve customizações em ${c.cyan}directives/${c.reset} e ${c.cyan}.harness/${c.reset}\n`);
    return;
  }

  // ── --force: aplicar atualização ─────────────────────────────
  if(!fs.existsSync(path.join(cwd,".harness","VERSION"))){
    console.log(`\n  ${c.red}✗${c.reset} Harness não encontrado neste diretório.`);
    info(`Use ${c.cyan}npx harness-engineering${c.reset} para instalar.\n`);
    return;
  }

  console.log(`\n  Atualizando harness para v${latest}...\n`);

  // Atualiza .harness/VERSION
  fs.writeFileSync(path.join(cwd,".harness","VERSION"),VERSION);
  ok(".harness/VERSION atualizado");

  // Atualiza campo version em .harness/config.json (sem sobrescrever o resto)
  const configPath=path.join(cwd,".harness","config.json");
  if(fs.existsSync(configPath)){
    try{
      const cfg=JSON.parse(fs.readFileSync(configPath,"utf8"));
      cfg.version=VERSION;
      fs.writeFileSync(configPath,JSON.stringify(cfg,null,2),"utf8");
      ok(".harness/config.json versão atualizada");
    }catch(_){warn("Não foi possível atualizar .harness/config.json");}
  }

  console.log(`\n  ${c.cyan}ℹ${c.reset} Arquivos preservados (suas customizações):`);
  console.log(`    ${c.cyan}AGENTS.md · CLAUDE.md · GEMINI.md${c.reset}`);
  console.log(`    ${c.cyan}directives/ · .harness/memory/ · docs/${c.reset}\n`);
  console.log(`  ${c.green}✓${c.reset} Harness atualizado para v${VERSION}\n`);
  info(`Para atualizar os arquivos de infra: ${c.cyan}npx harness-engineering adopt${c.reset}`);
  console.log();
}

// ── Doctor ───────────────────────────────────────────────────
async function cmdDoctor(){
  console.log(`\n${c.bold}🌉 Bifrost Doctor${c.reset} — diagnóstico do ambiente\n`);

  const checks=[];
  const cwd=process.cwd();
  const {execSync}=require("child_process");
  const run=cmd=>{try{return execSync(cmd,{stdio:"pipe"}).toString().trim();}catch{return null;}};

  // Check 1 — Node.js versão
  const nodeVer=process.version;
  const nodeMajor=parseInt(nodeVer.slice(1).split(".")[0]);
  checks.push({label:"Node.js 16+",ok:nodeMajor>=16,detail:nodeVer,
    fix:"Instale Node.js 16+ em https://nodejs.org"});

  // Check 2 — Python disponível
  const pythonVer=run("python --version")||run("python3 --version");
  checks.push({label:"Python 3.x",ok:!!pythonVer,detail:pythonVer||"não encontrado",
    fix:"Instale Python em https://python.org/downloads"});

  // Check 3 — Git instalado
  const gitVer=run("git --version");
  checks.push({label:"Git",ok:!!gitVer,detail:gitVer||"não encontrado",
    fix:"Instale Git em https://git-scm.com"});

  // Check 4 — Harness instalado
  const harnessPath=path.join(cwd,".harness","VERSION");
  const harnessOk=fs.existsSync(harnessPath);
  const harnessDetail=harnessOk?fs.readFileSync(harnessPath,"utf8").trim():"não encontrado";
  checks.push({label:"Harness instalado",ok:harnessOk,detail:harnessDetail,
    fix:"Execute npx harness-engineering para instalar"});

  // Check 5 — Arquivos obrigatórios
  const required=["AGENTS.md",".harness/index.md",".harness/config.json",".harness/pev/pev.md"];
  const missing=required.filter(f=>!fs.existsSync(path.join(cwd,f)));
  checks.push({
    label:"Arquivos obrigatórios",
    ok:missing.length===0,
    detail:missing.length===0?`${required.length}/${required.length} presentes`:`faltando: ${missing.join(", ")}`,
    fix:"Execute npx harness-engineering check para detalhes"
  });

  // Check 6 — Versão do CLI vs npm
  process.stdout.write(`  Verificando versão do CLI... `);
  let latestVer=VERSION;
  try{
    latestVer=await new Promise(resolve=>{
      const req=https.get(
        "https://registry.npmjs.org/harness-engineering/latest",
        {headers:{"Accept":"application/json"}},
        res=>{
          let data="";
          res.on("data",chunk=>data+=chunk);
          res.on("end",()=>{try{resolve(JSON.parse(data).version||VERSION);}catch{resolve(VERSION);}});
        }
      );
      req.on("error",()=>resolve(VERSION));
      req.setTimeout(5000,()=>{req.destroy();resolve(VERSION);});
    });
  }catch{latestVer=VERSION;}
  process.stdout.write("\r                                    \r"); // limpa linha
  const isLatest=VERSION===latestVer||
    semverGte(VERSION,latestVer);
  checks.push({
    label:`CLI v${VERSION}`,
    ok:isLatest,
    detail:isLatest?"versão mais recente":`v${latestVer} disponível`,
    fix:`Execute npx harness-engineering@latest upgrade --force`
  });

  // Imprimir resultados
  const line="─".repeat(50);
  console.log(line);
  for(const ch of checks){
    const icon=ch.ok?`${c.green}✓${c.reset}`:`${c.red}✗${c.reset}`;
    const label=ch.label.padEnd(28);
    console.log(`  ${icon} ${label} ${ch.detail}`);
  }
  console.log(line);

  const failures=checks.filter(ch=>!ch.ok);
  if(failures.length===0){
    console.log(`\n  ${c.green}✓${c.reset} Ambiente íntegro — tudo funcionando.\n`);
  }else{
    console.log(`\n  ${c.yellow}${failures.length} problema(s) encontrado(s):${c.reset}\n`);
    for(const f of failures)console.log(`  ${c.cyan}→${c.reset} ${f.label}: ${f.fix}`);
    console.log();
  }
}

// ── Setup Hooks ──────────────────────────────────────────────
async function cmdSetupHooks() {
  const os = require('os');
  const { execSync } = require('child_process');

  console.log('\n🌉 Bifrost Setup Hooks — configurando hook global\n');

  // Determinar pasta de hooks global
  const homeDir = os.homedir();
  const hooksDir = path.join(homeDir, '.config', 'git', 'hooks');
  const hookFile = path.join(hooksDir, 'post-commit');

  // Criar pasta se não existir
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
    console.log(`  ✓ Criada pasta: ${hooksDir}`);
  }

  // Escrever o hook
  fs.writeFileSync(hookFile, POST_COMMIT_HOOK);
  console.log(`  ✓ Hook criado: ${hookFile}`);

  // Tornar executável (Unix/Mac/Git Bash)
  try {
    fs.chmodSync(hookFile, '755');
  } catch (e) {
    // Windows sem Git Bash — tudo bem, Git usa o arquivo mesmo assim
  }

  // Configurar git global hooksPath
  // Usar forward slashes para compatibilidade Windows/Unix
  const hooksPathForGit = hooksDir.replace(/\\/g, '/');

  try {
    execSync(`git config --global core.hooksPath "${hooksPathForGit}"`, {
      stdio: 'pipe'
    });
    console.log(`  ✓ git config --global core.hooksPath configurado`);
  } catch (e) {
    console.log(`  ✗ Erro ao configurar git: ${e.message}`);
    console.log(`    Execute manualmente:`);
    console.log(`    git config --global core.hooksPath "${hooksPathForGit}"`);
  }

  // Verificar configuração
  try {
    const configured = execSync('git config --global core.hooksPath', {
      stdio: 'pipe'
    }).toString().trim();
    console.log(`\n  ✓ Verificado: core.hooksPath = ${configured}`);
  } catch (e) {
    console.log(`  ⚠ Não foi possível verificar a configuração`);
  }

  console.log(`
  ✓ Hook global instalado com sucesso!

  O que acontece agora:
  → A cada git commit em projetos com Bifrost instalado,
    .harness/memory/last-session.json é atualizado automaticamente
  → Funciona em qualquer projeto onde npx harness-engineering
    foi executado
  → Projetos sem .harness/VERSION são ignorados silenciosamente

  Para desativar:
  git config --global --unset core.hooksPath
`);
}

// ── Entry point ───────────────────────────────────────────────
(async()=>{
  const[,,cmd,...rest]=process.argv;
  switch(cmd){
    case"adopt":   await cmdAdopt();break;
    case"skill":   await cmdSkill(rest);break;
    case"check":   cmdCheck();break;
    case"stats":   require("./stats.js").printStats();break;
    case"upgrade": await cmdUpgrade(rest);break;
    case"doctor":       await cmdDoctor();break;
    case"setup-hooks":  await cmdSetupHooks();break;
    case"--version":case"-v": console.log(`bifrost-harness v${VERSION}`);break;
    case"--help":case"-h":
      console.log(`\n${c.bold}🌉 Bifrost Harness Engineering v${VERSION}${c.reset}\n\nnpx harness-engineering               Instala o Bifrost (projeto novo)\nnpx harness-engineering adopt         Detecta stack e adota em projeto existente\nnpx harness-engineering skill <nome>  Instala uma skill\nnpx harness-engineering skill --bundle <bundle>\nnpx harness-engineering skill --list   Lista disponíveis\nnpx harness-engineering check          Verifica integridade\nnpx harness-engineering stats          Exibe métricas do harness\nnpx harness-engineering doctor         Diagnóstico do ambiente (Node, Python, Git, harness)\nnpx harness-engineering upgrade        Verifica atualizações disponíveis\nnpx harness-engineering upgrade --force Aplica atualização, preserva customizações\nnpx harness-engineering setup-hooks    Configura hook git global para auto-save de sessão\n\n${c.bold}Bundles:${c.reset} essentials · saas · api · security\n`);break;
    default: await cmdInstall();
  }
})();
