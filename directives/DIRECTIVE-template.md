---
id: DIRECTIVE-template
version: 1.0.0
triggers: ["criar directive", "nova directive", "template directive", "SOP"]
domain: universal
estimated_tokens: 400
compatible_runtimes: [claude-code, antigravity, opencode, cursor]
last_updated: 2026-05-27
---

# Directive: [NOME DA TAREFA]
<!-- Camada 1: Define O QUE fazer. Não modifique sem permissão explícita. -->

## Objetivo
[Uma frase clara descrevendo o resultado esperado desta directive]

## Quando Usar
[Descreva as situações em que esta directive deve ser acionada]

## Entradas Necessárias
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|------------|-----------|
| `input_1` | string | sim | [descrição] |
| `input_2` | number | não | [descrição, valor padrão se houver] |

## Ferramentas / Scripts a Usar
```
execution/nome-do-script.py   → [o que faz]
execution/outro-script.sh     → [o que faz]
```
> Verifique `execution/` antes de criar scripts novos.

## Fluxo de Execução
```
1. [Primeira ação — ex: validar entradas]
2. [Segunda ação — ex: chamar execution/script.py com parâmetros X]
3. [Terceira ação — ex: verificar output]
4. [Quarta ação — ex: salvar resultado em .tmp/ ou entregar na nuvem]
```

## Saída Esperada
```json
{
  "status": "success | error | needs_review",
  "resultado": {},
  "arquivo_gerado": "caminho ou URL",
  "erros": []
}
```

## Edge Cases e Comportamento Esperado
| Situação | Comportamento |
|---------|--------------|
| Input vazio | [o que fazer] |
| API indisponível | [retry com backoff, máx 3 tentativas] |
| Timeout | [acionar fallback ou notificar] |
| [Caso específico do domínio] | [comportamento] |

## Critério de Sucesso
[Como saber que esta directive foi executada com sucesso]

## Aprendizados (Self-Annealing)
<!-- Atualize aqui quando descobrir edge cases, limites de API, etc. -->
<!-- Não apague entradas antigas — são memória do sistema -->

- [data] [aprendizado adquirido]
