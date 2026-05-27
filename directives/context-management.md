---
id: context-management
version: 1.0.0
triggers: ["contexto", "tokens", "janela", "compressão", "histórico", "limite"]
domain: universal
estimated_tokens: 600
compatible_runtimes: [claude-code, antigravity, opencode, cursor]
last_updated: 2026-05-27
---

# Directive: Gestão de Contexto e Tokens

## Objetivo
Manter o consumo de tokens sob controle durante sessões longas,
sem perder qualidade de resposta ou continuidade de trabalho.

## Quando Usar
- Sessão com mais de 8 turnos de conversa
- Tarefa que pode estourar o budget definido no AGENTS.md
- Antes de carregar múltiplos arquivos grandes
- Ao perceber respostas ficando verbosas ou repetitivas

## Fluxo de Compressão de Histórico

### Passo 1 — Detectar necessidade

Se qualquer condição abaixo for verdadeira, execute compressão:
- Conversa tem mais de 8 turnos
- Mensagens anteriores contêm raciocínio intermediário longo
- Conteúdo repetido em múltiplos turnos
- Budget de sessão acima de 60k tokens estimados

### Passo 2 — Executar compressão

Se Python disponível:
```bash
python execution/compress-history.py --auto
```

Se não disponível (Antigravity, OpenCode, etc.), aplique manualmente:

**Mantenha:**
- Decisões finais tomadas
- Estado atual do projeto
- Erros encontrados e como foram resolvidos
- Próximos passos definidos

**Descarte:**
- Raciocínio intermediário ("estou pensando em...")
- Confirmações verbosas ("entendido, vou fazer X como você pediu")
- Explicações de código já implementado
- Turnos de aprovação simples ("sim", "pode continuar", "ok")

### Passo 3 — Salvar estado comprimido

Salve o resumo em `.harness/memory/last-session.md`.

## Estratégia de Carregamento por Runtime

### Claude Code
```
- Usa prompt caching automático para AGENTS.md e directives estáticas
- Lazy loading via .harness/index.md
- Compressão via /wrap-session
```

### Antigravity (Gemini)
```
- Lazy loading via .harness/index.md (mesmo fluxo)
- Compressão manual: peça ao agente para resumir o histórico
- Use GEMINI.md em vez de AGENTS.md
```

### OpenCode / Cursor / Outros
```
- Lazy loading via .harness/index.md (mesmo fluxo)
- Compressão manual quando necessário
- Use AGENTS.md universal
```

## Regras de Output Conciso

Aplique em qualquer runtime:

```markdown
## Para o Agente

Formato de resposta obrigatório:
- Sucesso: máximo 3 linhas
- Erro: ERRO / CAUSA / AÇÃO (sem texto adicional)
- Código gerado: apenas o código, sem explicação antes
- Confirmação: "✓ feito" — sem repetir o pedido
```

## Quando NÃO comprimir

- Sessões de debugging ativo (o histórico de erros é contexto útil)
- Revisão de documentos jurídicos (todo contexto é relevante)
- Primeira sessão de um projeto novo (não há o que comprimir)

## Aprendizados
<!-- Atualize quando encontrar padrões de desperdício recorrentes -->
- [data] [padrão identificado e solução aplicada]
