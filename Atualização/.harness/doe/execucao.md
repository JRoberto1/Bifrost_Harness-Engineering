# DOE — Execução
# Camada 2→3: Como o Agente Chama Scripts Determinísticos

## Princípio

> Scripts determinísticos > agente improvisando.
> Se existe um script para a tarefa, use o script.

## Scripts Disponíveis

| Script | Uso | Quando |
|--------|-----|--------|
| `execution/compress-history.py` | Comprime histórico | Após 8 turnos |
| `execution/validate_action.py` | Valida ação crítica | Antes de escrever/deletar/executar |
| `execution/handoff.py` | Gera handoff JSON | Ao encerrar feature longa |
| `execution/self-correction.py` | Hashimoto automático | Após erro na sessão |
| `execution/stats.js` | Métricas de sessões | `npx harness-engineering stats` |

## Fluxo de Validação Antes de Agir

```bash
# Antes de qualquer ação crítica
python execution/validate_action.py --action [tipo] --target [arquivo]

# Resultados possíveis:
# {"status": "VALID"}          → pode executar
# {"status": "NEEDS_APPROVAL"} → pergunte ao usuário
# {"status": "INVALID"}        → nunca execute
```

## Template de Chamada de Script

```bash
# 1. Sempre dry-run primeiro
python execution/[script].py --dry-run --input "[valor]"

# 2. Após validar, execute
python execution/[script].py --input "[valor]"

# 3. Verifique saída JSON
# {"status": "success"} → ok
# {"status": "error"}   → reporte ERRO/CAUSA/AÇÃO
```

## Criar Novo Script

1. Verifique se já existe em `execution/`
2. Use `execution/SCRIPT-template.py` como base
3. Obrigatório: `--dry-run`, output JSON, tratamento de erro
