---
id: architecture
version: 1.0.0
triggers: ["arquitetura", "architecture", "adr", "decisão técnica", "design system", "estrutura", "padrão arquitetural", "monolito", "microsserviços", "camadas", "hexagonal", "clean architecture"]
domain: universal
estimated_tokens: 780
compatible_runtimes: [claude-code, antigravity, opencode, cursor]
last_updated: 2026-05-28
---

# Directive: Architecture

## Objetivo
Tomar e documentar decisões arquiteturais de forma deliberada,
rastreável e reversível quando possível.

## Regra Fundamental

Arquitetura ruim é difícil de reverter.
Toda decisão arquitetural deve ser explícita, documentada
com seu contexto e suas alternativas consideradas.

## Architecture Decision Records (ADR)

Todo decisão arquitetural significativa vira um ADR em docs/adr/.

### Formato padrão

```markdown
# ADR-001: [Título da decisão]

## Status
Proposto | Aceito | Depreciado | Substituído por ADR-XXX

## Contexto
O que motivou esta decisão? Qual o problema sendo resolvido?

## Decisão
O que foi decidido?

## Consequências
### Positivas
- [o que melhora]

### Negativas
- [o que piora ou fica mais complexo]

### Neutras
- [o que muda sem ser melhor ou pior]

## Alternativas consideradas
- **Alternativa A**: [descrição] — descartada porque [motivo]
- **Alternativa B**: [descrição] — descartada porque [motivo]
```

### Quando criar um ADR
- Escolha de framework ou linguagem principal
- Estratégia de banco de dados (SQL vs NoSQL, qual banco)
- Padrão de autenticação (JWT, sessions, OAuth)
- Estrutura de pastas e organização do código
- Estratégia de deploy e infraestrutura
- Qualquer decisão que seria difícil de reverter depois

## Padrões Arquiteturais — Quando Usar

### Monolito modular
Use quando: time pequeno, domínio novo, startup em validação
Evite quando: times independentes precisam de deploys separados

### Microsserviços
Use quando: times grandes e independentes, domínios bem definidos,
necessidade real de escala independente por serviço
Evite quando: o domínio ainda está sendo descoberto —
microsserviços com fronteiras erradas são piores que monolito

### Camadas (MVC / Clean Architecture)
Use quando: aplicação com lógica de negócio complexa
Regra: dependências sempre apontam para dentro
(UI → Application → Domain → nunca o contrário)

### Event-driven
Use quando: componentes precisam ser desacoplados,
auditoria é necessária, workflows assíncronos longos
Evite quando: a complexidade de debugging não vale o benefício

## Checklist de Decisão Arquitetural

Antes de propor uma mudança arquitetural:
- [ ] O problema atual está documentado e quantificado?
- [ ] Alternativas foram consideradas (mínimo 2)?
- [ ] O custo de implementação foi estimado?
- [ ] O custo de reversão foi considerado?
- [ ] O time foi consultado?
- [ ] Um ADR será criado?

## Regras do Agente

- Nunca proponha mudança arquitetural sem documentar o contexto
- Sempre apresente pelo menos 2 alternativas antes de recomendar
- Separe claramente: problema técnico vs problema organizacional
- Mudanças incrementais são preferíveis a reescritas totais
- "Funciona" é um critério válido para manter uma arquitetura

## Output Esperado

PROBLEMA: [o que motivou a discussão]
OPÇÕES: [mínimo 2 alternativas com trade-offs]
RECOMENDAÇÃO: [qual e por quê]
ADR: [número e título do ADR a ser criado]
RISCOS: [o que pode dar errado com a decisão]

## Aprendizados
<!-- Atualize quando encontrar decisões arquiteturais recorrentes -->
- [data] [decisão tomada e resultado]
