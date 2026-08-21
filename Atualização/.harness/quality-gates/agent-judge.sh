#!/bin/bash
# ============================================================
# Bifrost — Agent Judge v2.2.0
# Auditor LLM leve (Haiku) que verifica se o código commitado
# segue as directives do projeto antes de permitir o commit.
#
# Requer: ANTHROPIC_API_KEY no ambiente
# Uso: chamado pelo pre-commit hook ou manualmente
#      bash .harness/quality-gates/agent-judge.sh
# ============================================================

set -e

GRN='\033[0;32m'; YEL='\033[1;33m'; RED='\033[0;31m'; BOLD='\033[1m'; NC='\033[0m'

# Verificar API key
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo -e "${YEL}⚠  Agent Judge desativado — ANTHROPIC_API_KEY não definida${NC}"
  echo "   Defina no .env ou exporte: export ANTHROPIC_API_KEY=sk-..."
  exit 0  # não bloqueia — é opcional
fi

# Verificar se há mudanças staged
STAGED=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null)
[ -z "$STAGED" ] && exit 0

# Coletar diff
DIFF=$(git diff --cached 2>/dev/null | head -200)
[ -z "$DIFF" ] && exit 0

# Coletar directives relevantes (só as pequenas — max 2k tokens)
DIRECTIVES=""
for f in directives/*.md; do
  [ -f "$f" ] || continue
  SIZE=$(wc -c < "$f" 2>/dev/null || echo 0)
  [ "$SIZE" -lt 3000 ] && DIRECTIVES+="### $f\n$(cat "$f")\n\n"
done

# Coletar tiers de permissão do AGENTS.md
TIERS=""
if [ -f "AGENTS.md" ]; then
  TIERS=$(grep -A 30 "Três Tiers de Permissão" AGENTS.md 2>/dev/null || echo "")
fi

echo -e "\n${BOLD}🧑‍⚖️  Agent Judge — Auditando com Claude Haiku...${NC}"

# Chamar a API
RESPONSE=$(curl -s https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d "{
    \"model\": \"claude-haiku-4-5-20251001\",
    \"max_tokens\": 300,
    \"messages\": [{
      \"role\": \"user\",
      \"content\": \"Você é um auditor de harness. Analise este diff e responda APENAS com JSON.\n\nDIFF:\n$(echo "$DIFF" | head -100 | sed 's/\"/\\\\"/g' | tr '\n' ' ')\n\nDIRECTIVES DO PROJETO:\n$(echo "$DIRECTIVES" | head -50 | sed 's/\"/\\\\"/g' | tr '\n' ' ')\n\nTIERS DE PERMISSÃO:\n$(echo "$TIERS" | sed 's/\"/\\\\"/g' | tr '\n' ' ')\n\nResponda SOMENTE com este JSON (sem texto adicional):\n{\\\"aprovado\\\": true/false, \\\"violacoes\\\": [\\\"lista de violações se houver\\\"], \\\"veredicto\\\": \\\"uma linha\\\"}\"
    }]
  }" 2>/dev/null)

# Extrair resultado
APPROVED=$(echo "$RESPONSE" | grep -o '"aprovado":[^,}]*' | grep -o 'true\|false' || echo "true")
VEREDICTO=$(echo "$RESPONSE" | grep -o '"veredicto":"[^"]*"' | sed 's/"veredicto":"//;s/"//' || echo "Auditoria concluída")
VIOLACOES=$(echo "$RESPONSE" | grep -o '"violacoes":\[[^]]*\]' | sed 's/"violacoes":\[//;s/\]//' || echo "")

if [ "$APPROVED" = "false" ]; then
  echo -e "${RED}❌ Agent Judge — REPROVADO${NC}"
  echo -e "   Veredicto: $VEREDICTO"
  if [ -n "$VIOLACOES" ]; then
    echo -e "   Violações:"
    echo "$VIOLACOES" | tr ',' '\n' | sed 's/^/     - /;s/"//g'
  fi
  echo ""
  echo -e "   ${YEL}Para forçar commit mesmo assim: git commit --no-verify${NC}"
  exit 1
else
  echo -e "${GRN}✓ Agent Judge — APROVADO${NC}"
  echo -e "  $VEREDICTO"
fi
