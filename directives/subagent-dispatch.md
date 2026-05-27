---
id: subagent-dispatch
version: 1.0.0
triggers: ["sub-agente", "tarefa pesada", "contexto independente", "delegar", "paralelo"]
domain: universal
estimated_tokens: 600
compatible_runtimes: [claude-code, antigravity, opencode, cursor]
last_updated: 2026-05-27
---

# Directive: Despacho de Sub-agentes

## Objetivo
Delegar tarefas pesadas para sub-agentes isolados, preservando
o contexto do agente principal e reduzindo consumo de tokens.

## Quando Usar

Dispare um sub-agente quando **qualquer** condição abaixo for verdadeira:

| Condição | Exemplo |
|----------|---------|
| Tarefa > 20k tokens estimados | Auditar repositório inteiro |
| Tarefa independente do histórico | Gerar documentação de um módulo |
| Tarefa envolve repositório/biblioteca externa | Analisar dependências |
| Tarefa repetitiva que pode ser paralelizada | Testes de múltiplos endpoints |
| Tarefa de análise sem decisão | Verificar conformidade de todos os contratos |

## Fluxo de Despacho

```
1. Identifique que a tarefa qualifica para sub-agente
2. Defina o input mínimo necessário (não mande contexto desnecessário)
3. Defina o output esperado (máximo 2.000 tokens de retorno)
4. Dispare o sub-agente com contexto isolado
5. Receba apenas o resumo destilado
6. Continue o trabalho principal com o resumo
```

## Template de Despacho

```
SUB-AGENTE: [nome da tarefa]
CONTEXTO: [apenas o que este sub-agente precisa saber]
TAREFA: [instrução específica e única]
OUTPUT ESPERADO: [formato e tamanho máximo do retorno]
PROIBIDO: [o que não fazer — evita escopo creep]
```

## Exemplos Reais

### Auditoria de módulo
```
SUB-AGENTE: auditoria-contratos
CONTEXTO: Sistema de geração de contratos jurídicos BR
TAREFA: Analise src/services/contrato-service.ts e identifique
        violações das regras em .harness/domains/juridico-financeiro.md
OUTPUT ESPERADO: Lista de violações em máximo 1.500 tokens
PROIBIDO: Não corrija — apenas identifique e descreva
```

### Geração de testes
```
SUB-AGENTE: gerador-testes
CONTEXTO: [schema da função a ser testada]
TAREFA: Gere testes unitários para a função gerarContrato()
        cobrindo: happy path, campos ausentes, valores inválidos
OUTPUT ESPERADO: Arquivo de teste completo
PROIBIDO: Não modifique a implementação
```

## Observation Masking no Retorno

Quando o sub-agente retornar output longo, aplique masking:

```
[Auditoria omitida — 847 linhas | Resumo: 3 violações em contrato-service.ts]
[Testes omitidos — 200 linhas | Status: gerados, aguardando review]
```

## Quando NÃO usar sub-agente

- Tarefas que dependem do histórico da sessão atual
- Tarefas de menos de 5k tokens estimados
- Decisões arquiteturais (precisam do contexto completo)
- Debugging interativo (requer ida e volta)

## Aprendizados
- [data] [padrão identificado]
