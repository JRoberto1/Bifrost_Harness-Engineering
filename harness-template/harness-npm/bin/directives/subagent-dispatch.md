# Directive: Despacho de Sub-agentes

## Objetivo
Delegar tarefas pesadas para sub-agentes isolados.
Eles processam em janela própria e retornam apenas resumo destilado.

## Quando Usar

| Condição | Exemplo |
|----------|---------|
| Tarefa > 20k tokens estimados | Auditar repositório inteiro |
| Tarefa independente do histórico | Gerar docs de um módulo |
| Repositório ou biblioteca externa | Analisar dependências |
| Tarefa repetitiva paralelizável | Testes de múltiplos endpoints |

## Template de Despacho

```
SUB-AGENTE: [nome da tarefa]
CONTEXTO: [apenas o que este sub-agente precisa saber]
TAREFA: [instrução específica e única]
OUTPUT ESPERADO: [formato e tamanho máximo — max 2.000 tokens]
PROIBIDO: [o que não fazer — evita scope creep]
```

## Exemplos

### Auditoria de módulo
```
SUB-AGENTE: auditoria-contratos
CONTEXTO: Sistema de contratos jurídicos BR
TAREFA: Analise src/services/contrato-service.ts e identifique
        violações das regras em .harness/domains/juridico-financeiro.md
OUTPUT ESPERADO: Lista de violações em máximo 1.500 tokens
PROIBIDO: Não corrija — apenas identifique
```

### Geração de testes
```
SUB-AGENTE: gerador-testes
CONTEXTO: [schema da função]
TAREFA: Gere testes unitários cobrindo happy path, campos ausentes, valores inválidos
OUTPUT ESPERADO: Arquivo de teste completo
PROIBIDO: Não modifique a implementação
```

## Observation Masking no Retorno

Sempre aplique masking no retorno do sub-agente se > 20 linhas:
```
[Auditoria omitida — 847 linhas | Resumo: 3 violações em contrato-service.ts]
```

## Quando NÃO usar sub-agente

- Tarefas que dependem do histórico atual
- Tarefas < 5k tokens estimados
- Decisões arquiteturais (precisam do contexto completo)
- Debug interativo (requer ida e volta)

## Anti-Rationalization

❌ "Vou fazer tudo no contexto principal" → Contexto pesado = respostas degradadas
❌ "O sub-agente vai perder contexto" → Isso é o ponto — contexto isolado = resultado limpo

## Aprendizados
- [data] [padrão de tarefa que se beneficiou de sub-agente]
