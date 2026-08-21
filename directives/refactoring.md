---
id: refactoring
version: 1.0.0
triggers: ["refactor", "refatorar", "refatoração", "limpar código", "clean up", "reestruturar", "simplificar", "extrair", "rename"]
domain: universal
estimated_tokens: 680
compatible_runtimes: [claude-code, antigravity, opencode, cursor]
last_updated: 2026-05-28
---

# Directive: Refactoring

## Objetivo
Melhorar a estrutura interna do código sem alterar comportamento externo.
Refatoração mal feita quebra coisas que funcionavam.

## Regra Fundamental

Refatoração sem testes é reescrita disfarçada.
Se não há testes cobrindo o código a ser refatorado,
escreva os testes ANTES de refatorar.

## Quando Refatorar

### Reforate agora
- Função com mais de 40 linhas fazendo coisas diferentes
- Nome que não descreve o que faz
- Lógica duplicada em dois ou mais lugares
- Comentário extenso explicando código confuso
  (o comentário é sinal de que o código precisa ser reescrito, não explicado)
- Condicionais aninhadas com mais de 3 níveis

### Não refatore agora
- Código que vai ser deletado em breve
- Código que você não entende completamente
- "Eu faria diferente" sem um problema concreto
- Antes de um deadline

## Protocolo de Refatoração Segura

### Passo 1 — Caracterize antes de mudar
Execute os testes existentes. Anote a cobertura atual.
Se não há testes → escreva testes de caracterização primeiro
(testes que documentam o comportamento atual, não o desejado).

### Passo 2 — Mudança mínima
Faça uma mudança de cada vez:
- Rename: apenas renomear, sem mover
- Extract: apenas extrair, sem alterar lógica
- Move: apenas mover, sem renomear
Nunca combine múltiplos tipos de refatoração em um único commit.

### Passo 3 — Teste após cada mudança
Rode os testes após cada mudança pequena.
Se quebraram → revert imediato, entenda o motivo antes de continuar.

### Passo 4 — Commit atômico
Cada refatoração vira um commit próprio:
```
refactor(auth): extrai validateToken para módulo separado
refactor(auth): renomeia checkUser para verifyUserExists
```
Nunca misture refatoração com feature ou bugfix no mesmo commit.

## Catálogo de Refatorações Comuns

| Problema | Técnica | Exemplo |
|----------|---------|---------|
| Função longa | Extract Function | `processOrder()` → `validateOrder()` + `chargePayment()` + `sendConfirmation()` |
| Nome ruim | Rename | `data` → `userProfile` |
| Código duplicado | Extract Function / Extract Module | Mover lógica compartilhada para `utils/` |
| Condicionais complexas | Introduce Guard Clause | `if (!valid) return` no topo em vez de `if (valid) { ... }` |
| Parâmetros demais | Introduce Parameter Object | `(name, email, age, role)` → `(user: User)` |
| Switch/if-else longo | Replace with Polymorphism | Strategy pattern ou mapa de handlers |

## Regras do Agente

- Nunca refatore e adicione feature no mesmo PR
- Se a refatoração vai demorar mais de 1 hora → divida em etapas menores
- Documente no commit POR QUE refatorou, não COMO
- Se ao refatorar você encontrar um bug → corrija em um commit separado antes de continuar

## Output Esperado

ESCOPO: [o que vai ser refatorado]
TESTES ANTES: [cobertura atual]
TÉCNICA: [qual refatoração será usada]
COMMITS PLANEJADOS: [lista de commits atômicos]
RISCO: baixo | médio | alto

## Aprendizados
<!-- Atualize quando encontrar padrões de refatoração recorrentes -->
- [data] [padrão identificado e solução aplicada]
