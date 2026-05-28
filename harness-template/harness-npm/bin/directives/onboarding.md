---
id: onboarding
version: 1.0.0
triggers: ["onboarding", "novo desenvolvedor", "integração", "começar no projeto", "setup", "configurar ambiente", "primeiro dia", "novo membro", "entrar no time"]
domain: universal
estimated_tokens: 700
compatible_runtimes: [claude-code, antigravity, opencode, cursor]
last_updated: 2026-05-28
---

# Directive: Onboarding

## Objetivo
Integrar novos desenvolvedores ao projeto de forma rápida,
sistemática e com documentação que se mantém atualizada.

## Regra Fundamental

Onboarding lento é custo real.
Um novo desenvolvedor que leva 2 semanas para ser produtivo
custa mais do que 2 semanas de trabalho do time para
criar e manter um processo de onboarding bom.

## Protocolo de Onboarding

### Dia 1 — Ambiente e contexto
- [ ] Ambiente de desenvolvimento funcionando (rode o projeto localmente)
- [ ] Acesso a todos os sistemas necessários (repositório, CI, cloud, monitoramento)
- [ ] Leu docs/architecture.md (ou equivalente)
- [ ] Entendeu o domínio do negócio em 1 parágrafo
- [ ] Conhece o fluxo de trabalho (como abrir PR, processo de review)

### Semana 1 — Primeira contribuição
- [ ] Primeiro PR mergeado (bug fix pequeno ou melhoria de docs)
- [ ] Participou de pelo menos 1 code review como observador
- [ ] Entende os testes e sabe como rodá-los
- [ ] Conhece os principais pontos de entrada do código

### Mês 1 — Autonomia
- [ ] Consegue pegar uma task e estimá-la sozinho
- [ ] Sabe onde buscar ajuda (docs, pessoas, canais)
- [ ] Fez pelo menos 1 contribuição de feature
- [ ] Deu feedback sobre o onboarding (para melhorar para o próximo)

## O que o Agente Deve Saber sobre o Projeto

Antes de ajudar um novo desenvolvedor, leia:

1. `docs/architecture.md` — estrutura e decisões técnicas
2. `docs/stack.md` (se existir) — tecnologias e versões
3. `AGENTS.md` — regras do harness para este projeto
4. `README.md` — visão geral e instalação
5. `CONTRIBUTING.md` — processo de contribuição

## Criando Documentação de Onboarding

### ONBOARDING.md mínimo viável

```markdown
# Onboarding — [Nome do Projeto]

## Pré-requisitos
- Node.js X.X / Python X.X / etc
- Docker (opcional/obrigatório)
- Acesso a: [lista de sistemas]

## Setup em 5 minutos
1. Clone: git clone [url]
2. Instale dependências: [comando]
3. Configure o ambiente: cp .env.example .env
4. Rode localmente: [comando]
5. Verifique: [como saber que funcionou]

## Estrutura do projeto
[árvore simplificada com descrição de cada pasta]

## Fluxo de trabalho
[como pegar uma task, criar branch, abrir PR]

## Onde pedir ajuda
[canais, pessoas, documentação]
```

## Regras do Agente

- Nunca assuma que o novo desenvolvedor sabe o contexto — explique
- Links para documentação são preferíveis a explicações longas inline
- Se uma pergunta foi feita duas vezes → deve virar documentação
- Onboarding é oportunidade de descobrir documentação desatualizada

## Output Esperado

NÍVEL: iniciante no projeto | iniciante na stack | sênior onboarding
BLOQUEADORES: [o que impede de começar]
PRÓXIMO PASSO: [ação concreta e específica]
DOCS FALTANDO: [o que deveria existir mas não existe]

## Aprendizados
<!-- Atualize quando encontrar padrões de onboarding recorrentes -->
- [data] [padrão identificado e solução aplicada]
