# DOE — Orquestração
# Camada 2: Como o Agente Planeja e Delega

## Padrão de Orquestração

```
ENTRADA: tarefa do usuário
      ↓
INTENT GATE: pesquisa / implementação / investigação / correção / revisão
      ↓
INDEX: leia .harness/index.md → identifique directive com match
      ↓
DIRECTIVE: carregue apenas a directive relevante
      ↓
PLAN: decomponha em tarefas com critérios verificáveis
      ↓
EXECUTE: use scripts de execution/ quando disponível
      ↓
VERIFY: valide cada critério antes de reportar
      ↓
SAÍDA: máximo 3 linhas de sucesso ou ERRO/CAUSA/AÇÃO
```

## Decisão: Agente vs Script

| Tarefa | Quem executa |
|--------|-------------|
| Compressão de histórico | `execution/compress-history.py` |
| Validação de ação crítica | `execution/validate_action.py` |
| Handoff estruturado | `execution/handoff.py` |
| Auto-correção Hashimoto | `execution/self-correction.py` |
| Raciocínio e decisão | Agente (Camada 2) |
| Classificação de intenção | Agente (Camada 2) |

## Sub-agentes

Quando delegar:
- Tarefa > 20k tokens estimados
- Tarefa independente do contexto atual

Template em `directives/subagent-dispatch.md`.

## Prompt do Planejador

```
Tarefa: [descrição]

Decomponha em:
| # | Tarefa | Arquivo | Critério Verificável | Depende de |

Apresente o plano. Aguarde aprovação antes de executar.
```
