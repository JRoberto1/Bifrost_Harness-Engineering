#!/usr/bin/env node
// ============================================================
// Bifrost — harness-engineering stats
// Lê .harness/memory/ e mostra métricas da semana/mês/total
// Zero infra — só leitura de Markdown
// ============================================================

const fs   = require("fs");
const path = require("path");

const c = {
  reset:"\x1b[0m", bold:"\x1b[1m", green:"\x1b[32m",
  yellow:"\x1b[33m", blue:"\x1b[34m", cyan:"\x1b[36m",
  red:"\x1b[31m", dim:"\x1b[2m"
};

const MEMORY_DIR    = ".harness/memory";
const PROGRESS_FILE = "claude-progress.txt";

function bar(value, max, width=20) {
  const filled = Math.round((value / Math.max(max, 1)) * width);
  return `${"▓".repeat(filled)}${"░".repeat(width - filled)}`;
}

function parseSession(content, filename) {
  const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2})/);
  const date      = dateMatch ? new Date(dateMatch[1]) : null;

  const tokenMatch   = content.match(/(\d[\d,]+)\s*→\s*(\d[\d,]+)/);
  const tokensBefore = tokenMatch ? parseInt(tokenMatch[1].replace(/,/g,"")) : 0;
  const tokensAfter  = tokenMatch ? parseInt(tokenMatch[2].replace(/,/g,"")) : 0;

  const reductionMatch = content.match(/(\d+)%\s*menos\s*tokens/);
  const reduction      = reductionMatch ? parseInt(reductionMatch[1]) : 0;

  const doneCount    = (content.match(/\[x\]/gi) || []).length;
  const pendingCount = (content.match(/\[ \]/g)  || []).length;
  const errorCount   = (content.match(/ERRO:|FALHA:/gi) || []).length;
  const hashimotoCount = (content.match(/hashimoto|aprendizado/gi) || []).length;

  return { date, tokensBefore, tokensAfter, reduction, doneCount, pendingCount, errorCount, hashimotoCount };
}

function readSessions() {
  const memDir = path.join(process.cwd(), MEMORY_DIR);
  if (!fs.existsSync(memDir)) return [];

  return fs.readdirSync(memDir)
    .filter(f => f.endsWith(".md") && f !== "INDEX.md" && f !== "last-session.md")
    .map(f => {
      const content = fs.readFileSync(path.join(memDir, f), "utf8");
      return parseSession(content, f);
    })
    .filter(s => s.date)
    .sort((a,b) => a.date - b.date);
}

function readProgress() {
  const p = path.join(process.cwd(), PROGRESS_FILE);
  if (!fs.existsSync(p)) return null;
  const content = fs.readFileSync(p, "utf8");
  return {
    done:    (content.match(/^-[^(]/gm) || []).filter(l => content.indexOf("✅") < content.indexOf(l)).length,
    inProgress: (content.match(/🔄/g) || []).length,
    blocked:    (content.match(/🚧/g) || []).length,
    sessions:   parseInt(content.match(/Sessões:\s*(\d+)/) ?.[1] || "0"),
  };
}

function filterByDays(sessions, days) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return sessions.filter(s => s.date >= cutoff);
}

function printStats() {
  console.log(`\n${c.bold}╔══════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}║   🌉 Bifrost — Relatório de Sessões      ║${c.reset}`);
  console.log(`${c.bold}╚══════════════════════════════════════════╝${c.reset}\n`);

  const version = fs.existsSync(".harness/VERSION")
    ? fs.readFileSync(".harness/VERSION","utf8").trim() : "?";
  console.log(`  ${c.dim}Harness v${version} · ${new Date().toLocaleDateString("pt-BR")}${c.reset}\n`);

  const all     = readSessions();
  const week    = filterByDays(all, 7);
  const month   = filterByDays(all, 30);

  if (all.length === 0) {
    console.log(`  ${c.yellow}Nenhuma sessão encontrada em ${MEMORY_DIR}/${c.reset}`);
    console.log(`  Use /wrap-session para começar a registrar.\n`);
    return;
  }

  // ── Resumo ────────────────────────────────────────────
  console.log(`${c.bold}  [ Sessões ]${c.reset}`);
  console.log(`  Total:    ${c.cyan}${all.length}${c.reset} sessões registradas`);
  console.log(`  Semana:   ${c.cyan}${week.length}${c.reset} sessões`);
  console.log(`  Mês:      ${c.cyan}${month.length}${c.reset} sessões`);

  // ── Tokens ────────────────────────────────────────────
  const totalBefore  = all.reduce((s,x) => s + x.tokensBefore, 0);
  const totalAfter   = all.reduce((s,x) => s + x.tokensAfter,  0);
  const avgReduction = all.reduce((s,x) => s + x.reduction, 0) / Math.max(all.length,1);
  const saved        = totalBefore - totalAfter;

  console.log(`\n${c.bold}  [ Tokens ]${c.reset}`);
  if (totalBefore > 0) {
    console.log(`  Economizados: ${c.green}${saved.toLocaleString()}${c.reset} tokens (${Math.round(avgReduction)}% médio)`);
    console.log(`  ${bar(saved, totalBefore)} ${Math.round(avgReduction)}%`);
    console.log(`  Antes:  ${totalBefore.toLocaleString()} tokens`);
    console.log(`  Depois: ${totalAfter.toLocaleString()} tokens`);
  } else {
    console.log(`  ${c.dim}Dados de tokens não disponíveis ainda${c.reset}`);
    console.log(`  ${c.dim}(execute compress-history.py para registrar)${c.reset}`);
  }

  // ── Produtividade ─────────────────────────────────────
  const totalDone    = all.reduce((s,x) => s + x.doneCount,    0);
  const totalPending = all.reduce((s,x) => s + x.pendingCount, 0);
  const totalErrors  = all.reduce((s,x) => s + x.errorCount,   0);
  const totalH       = all.reduce((s,x) => s + x.hashimotoCount, 0);
  const successRate  = totalDone > 0
    ? Math.round((totalDone / (totalDone + totalErrors)) * 100) : 0;

  console.log(`\n${c.bold}  [ Produtividade ]${c.reset}`);
  console.log(`  Tarefas concluídas: ${c.green}${totalDone}${c.reset}`);
  console.log(`  Tarefas pendentes:  ${c.yellow}${totalPending}${c.reset}`);
  console.log(`  Erros encontrados:  ${c.red}${totalErrors}${c.reset}`);
  console.log(`  Taxa de sucesso:    ${c.cyan}${successRate}%${c.reset}  ${bar(successRate, 100, 15)}`);
  console.log(`  Aprendizados (Hashimoto): ${c.cyan}${totalH}${c.reset}`);

  // ── Esta semana ───────────────────────────────────────
  if (week.length > 0) {
    const weekDone   = week.reduce((s,x) => s + x.doneCount, 0);
    const weekErrors = week.reduce((s,x) => s + x.errorCount, 0);
    console.log(`\n${c.bold}  [ Esta Semana ]${c.reset}`);
    console.log(`  Sessões:  ${week.length}`);
    console.log(`  Tarefas:  ${c.green}${weekDone} concluídas${c.reset}`);
    console.log(`  Erros:    ${c.red}${weekErrors}${c.reset}`);
  }

  // ── Progress ──────────────────────────────────────────
  const progress = readProgress();
  if (progress) {
    console.log(`\n${c.bold}  [ claude-progress.txt ]${c.reset}`);
    console.log(`  Entregue:     ${c.green}${progress.done}${c.reset} itens`);
    console.log(`  Em andamento: ${c.yellow}${progress.inProgress}${c.reset}`);
    console.log(`  Bloqueios:    ${c.red}${progress.blocked}${c.reset}`);
    console.log(`  Total sessões: ${progress.sessions}`);
  }

  // ── Saúde do harness ──────────────────────────────────
  console.log(`\n${c.bold}  [ Saúde do Harness ]${c.reset}`);
  const checks = [
    [".harness/index.md",          "Índice de lazy loading"],
    [".harness/config.json",       "Config com protected paths"],
    ["directives/session-memory.md","Memória de sessão"],
    ["directives/diagnose.md",     "Diagnóstico sistemático"],
    ["execution/compress-history.py","Compressor de histórico"],
    ["claude-progress.txt",        "Progress tracker"],
  ];
  let issues = 0;
  for (const [file, label] of checks) {
    const exists = fs.existsSync(path.join(process.cwd(), file));
    if (exists) {
      console.log(`  ${c.green}✓${c.reset} ${label}`);
    } else {
      console.log(`  ${c.red}✗${c.reset} ${label} ${c.dim}(${file})${c.reset}`);
      issues++;
    }
  }

  console.log(`\n${"═".repeat(46)}`);
  if (issues === 0) {
    console.log(`  ${c.green}✅ Harness íntegro${c.reset} · ${all.length} sessões · ${totalDone} tarefas entregues\n`);
  } else {
    console.log(`  ${c.yellow}⚠️  ${issues} arquivo(s) faltando${c.reset} · rode: npx harness-engineering\n`);
  }
}

module.exports = { printStats };

if (require.main === module) printStats();
