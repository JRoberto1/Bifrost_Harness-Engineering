# Directive: Spec-Driven Development

## Objetivo
Garantir que especificação exista antes de qualquer código.
Spec não é burocracia — é o mapa que evita retrabalho.

## Quando Usar
- Início de qualquer feature nova
- Mudança significativa em feature existente
- Integração com sistema externo
- Qualquer coisa que afete mais de 3 arquivos

## Fluxo

```
1. Escreva a spec → /spec [feature]
2. Aguarde aprovação explícita
3. Decomponha em tarefas → /plan [feature]
4. Implemente uma tarefa por vez
5. Verifique cada critério antes da próxima
6. Revise antes de merge → /review
7. Deploy com checklist → /ship
```

## O que a Spec Deve Conter

```markdown
## Spec: [Nome]

### Visão Geral
[Uma frase: o que faz e por que existe]

### Problema
[O que está quebrado sem esta feature]

### Escopo — Inclui
- [item]

### Escopo — NÃO inclui
- [item] ← crítico para evitar scope creep

### Critérios de Aceitação
| Cenário | Dado | Quando | Então |

### Impacto Técnico
- Arquivos: [lista]
- Schema changes: [sim/não]
- Breaking changes: [sim/não]
```

## Anti-Rationalization

❌ "É urgente, não tem tempo para spec"
→ Urgência é a razão mais forte para ter spec. Código urgente sem spec vira dívida técnica urgente.

❌ "A feature é simples, sei exatamente o que fazer"
→ Simples no papel = complexo na implementação. Spec descobre a complexidade antes do código.

❌ "Já fiz features assim antes"
→ Contexto muda. Spec documenta as especificidades deste caso.

❌ "O cliente pode mudar de ideia de qualquer forma"
→ Spec é o contrato. Muda a spec, não o código sem spec.

## Aprendizados
- [data] [o que a spec teria evitado]
