# Directive: Memória de Sessão

## Objetivo
Garantir continuidade entre sessões com mínimo de tokens.
O agente retoma exatamente de onde parou sem reexplicação.

## Economia de Tokens

```
Sem Bifrost:  AGENTS.md + docs/ + histórico + reexplicação = 20k+ tokens
Com Bifrost:  last-session.md = ~500 tokens       ▓▓▓░░░░░░░░░ -97%
```

## Fluxo de Encerramento

**Claude Code:**
```
/wrap-session
/wrap-session nome-da-tarefa
```

**Qualquer outro runtime:**
```
Leia directives/session-memory.md e encerre a sessão
salvando o contexto em .harness/memory/last-session.md
```

### O que o wrap-session salva automaticamente

```markdown
# Sessão: [tema] — [data]

## Decisões Tomadas
- [decisão 1]

## Tarefas Concluídas
- [x] [tarefa]

## Tarefas Pendentes
- [ ] [tarefa] ← [prioridade]

## Próximo Passo Exato
[instrução específica para retomar]

## Aprendizados (Hashimoto)
- [se algum erro foi encontrado, qual regra deveria existir]
```

## Fluxo de Retomada

**Claude Code:**
```
/brief-session
```

**Qualquer outro runtime:**
```
Leia apenas .harness/memory/last-session.md
e me dê um briefing antes de qualquer ação
```

## Troca de Runtime

Quando trocar Claude Code → Antigravity (ou qualquer outro):

**1. Antes de sair:**
```
/wrap-session
```

**2. No novo runtime:**
```
Leia GEMINI.md e .harness/memory/last-session.md
Apresente um briefing e aguarde minha instrução
```

## Hooks Automáticos (Claude Code)

O agente DEVE executar automaticamente:
- **Ao iniciar sessão:** verificar se `last-session.md` existe e apresentar briefing
- **Ao encerrar sessão:** executar wrap mesmo sem comando explícito
- **A cada 8 turnos:** sugerir `/context-check --compress`

## Anti-Rationalization

❌ "Vou lembrar de onde parei" → Memória humana falha. Arquivo não.
❌ "É uma sessão curta, não precisa" → Sessões "curtas" viram longas.
❌ "Posso reexplicar no próximo dia" → Reexplicação desperdiça tokens e tempo.

## Aprendizados
- [data] [padrão de perda de contexto identificado]
