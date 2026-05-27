"use strict";
const fs   = require("fs");
const path = require("path");

const TARGET = process.cwd();

const c = {
  reset:"\x1b[0m", bold:"\x1b[1m", green:"\x1b[32m",
  yellow:"\x1b[33m", cyan:"\x1b[36m", red:"\x1b[31m"
};

function printStats() {
  const line = "─".repeat(33);

  // Harness version from .harness/config.json
  let version = "?";
  try {
    const cfg = JSON.parse(
      fs.readFileSync(path.join(TARGET, ".harness", "config.json"), "utf8")
    );
    version = cfg.version || "?";
  } catch (_) {}

  // Count directives with frontmatter (files starting with ---)
  let directivesCount = 0;
  try {
    const dirPath = path.join(TARGET, "directives");
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith(".md"));
    for (const f of files) {
      const content = fs.readFileSync(path.join(dirPath, f), "utf8");
      if (content.trimStart().startsWith("---")) directivesCount++;
    }
  } catch (_) {}

  // Runtime detection
  let runtime = "Universal (AGENTS.md)";
  if (fs.existsSync(path.join(TARGET, "CLAUDE.md"))) {
    runtime = "Claude Code (CLAUDE.md)";
  } else if (fs.existsSync(path.join(TARGET, ".opencode", "instructions.md"))) {
    runtime = "OpenCode (AGENTS.md)";
  } else if (fs.existsSync(path.join(TARGET, "GEMINI.md"))) {
    runtime = "Antigravity (GEMINI.md)";
  }

  // Last sync date from mtime of CLAUDE.md or GEMINI.md
  let lastSync = "—";
  for (const f of ["CLAUDE.md", "GEMINI.md"]) {
    try {
      const stat = fs.statSync(path.join(TARGET, f));
      lastSync = stat.mtime.toISOString().slice(0, 10);
      break;
    } catch (_) {}
  }

  // Sessions: count ## headings in hashimoto-log.md + check last-session.json
  let sessions = 0;
  try {
    const logPath = path.join(TARGET, ".harness", "memory", "hashimoto-log.md");
    const log = fs.readFileSync(logPath, "utf8");
    sessions = (log.match(/^## /gm) || []).length;
  } catch (_) {}
  try {
    const jsonPath = path.join(TARGET, ".harness", "memory", "last-session.json");
    const s = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    if (s.session_id) sessions = Math.max(sessions, 1);
  } catch (_) {}

  // Integrity check
  const coreFiles = [
    "AGENTS.md", "directives", "execution",
    path.join(".harness", "index.md"),
    path.join(".harness", "config.json"),
  ];
  const intact = coreFiles.every(f => fs.existsSync(path.join(TARGET, f)));

  console.log(`\n${line}`);
  console.log(`  ${c.bold}Bifrost v${version} — Stats${c.reset}`);
  console.log(line);
  console.log(`  Directives:     ${c.cyan}${directivesCount} carregadas${c.reset}`);
  console.log(`  Runtime:        ${c.cyan}${runtime}${c.reset}`);
  console.log(`  Último sync:    ${c.cyan}${lastSync}${c.reset}`);
  console.log(`  Sessões:        ${c.cyan}${sessions} registradas${c.reset}`);
  console.log(`  Harness:        ${intact ? `${c.green}✓ íntegro` : `${c.red}✗ incompleto`}${c.reset}`);
  console.log(`${line}\n`);
}

module.exports = { printStats };
