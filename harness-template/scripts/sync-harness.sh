#!/bin/bash
# sync-harness.sh — equivalente shell de scripts/sync-harness.py
# Para projetos sem Python instalado
# Uso: bash scripts/sync-harness.sh [--watch]
# Sincroniza AGENTS.md → CLAUDE.md e GEMINI.md automaticamente

GRN='\033[0;32m'; YEL='\033[1;33m'; BOLD='\033[1m'; NC='\033[0m'

sync() {
  [ ! -f "AGENTS.md" ] && echo "AGENTS.md não encontrado." && exit 1
  local changed=0
  if ! diff -q "AGENTS.md" "CLAUDE.md" &>/dev/null 2>&1; then
    cp AGENTS.md CLAUDE.md && echo -e "${GRN}✓${NC} CLAUDE.md sincronizado" && changed=1
  fi
  if ! diff -q "AGENTS.md" "GEMINI.md" &>/dev/null 2>&1; then
    cp AGENTS.md GEMINI.md && echo -e "${GRN}✓${NC} GEMINI.md sincronizado" && changed=1
  fi
  [ $changed -eq 0 ] && echo -e "${GRN}✓${NC} Espelhos já sincronizados"
}

if [ "${1}" = "--watch" ]; then
  echo -e "${BOLD}Bifrost Mirror Sync — watch mode${NC} (Ctrl+C para parar)"
  LAST=""
  while true; do
    CURR=$(md5sum AGENTS.md 2>/dev/null | cut -d' ' -f1)
    [ "$CURR" != "$LAST" ] && [ -n "$CURR" ] && sync && LAST="$CURR"
    sleep 2
  done
else
  sync
fi
