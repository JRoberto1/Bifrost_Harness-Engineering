---
id: diagnose
version: 1.0.0
triggers: ["por que", "quebrou", "erro", "falhou", "não funciona", "debug", "investigar"]
domain: universal
estimated_tokens: 600
---

# Directive: Diagnose

## Objetivo
Investigar falhas de forma sistemática sem consumir contexto desnecessário.

## Protocolo de Investigação (4 passos)

### Passo 1 — Isolar o sintoma
Descreva o comportamento observado em 1 linha.
NÃO tente corrigir ainda.

### Passo 2 — Ler antes de agir
Antes de qualquer modificação:
- `grep -rn "termo relevante" src/`
- `head -30` do arquivo suspeito
- `git log --oneline -10` (o que mudou recentemente?)

### Passo 3 — Hipótese única
Formule UMA hipótese de causa raiz.
Se houver mais de uma → escolha a mais provável e teste primeiro.

### Passo 4 — Teste mínimo
Crie o menor teste possível que confirme ou refute a hipótese.
Se confirmada → corrija e aplique Hashimoto.
Se refutada → volte ao Passo 2 com nova informação.

## Regras
- Nunca "tente várias coisas" ao mesmo tempo
- Nunca modifique mais de 1 arquivo por hipótese
- Se após 3 hipóteses a causa ainda não for clara → use sub-agente com contexto limpo
- Marque qualquer suposição com `[VERIFICAR: motivo]`

## Output esperado

```
SINTOMA:    [1 linha]
HIPÓTESE:   [1 linha]
TESTE:      [comando ou ação]
RESULTADO:  CONFIRMADO | REFUTADO
AÇÃO:       [correção ou próxima hipótese]
```
