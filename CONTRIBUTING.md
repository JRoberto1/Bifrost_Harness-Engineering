# Contribuindo com o Bifrost

Bifrost melhora quando as pessoas que o usam reportam o que aprenderam.
Este guia mostra como contribuir — seguindo o próprio protocolo do harness.

## Formas de contribuir

| Tipo | O que é | Como fazer |
|------|---------|------------|
| 🐛 Bug no harness | Comportamento inesperado do agente | Abra uma issue com o template Bug Report |
| 📋 Nova directive | SOP que resolve um problema recorrente | Abra uma issue com o template Directive Proposal |
| 🎯 Nova skill | Capacidade específica para um domínio | Abra uma issue com o template Skill Request |
| 📝 Melhoria de docs | Correção ou expansão de documentação | PR direto com o template padrão |
| 🔧 Melhoria de scripts | build-harness.py, sync-harness.py | PR com testes locais documentados |

## Antes de abrir um PR

Execute localmente e confirme que passa:

```bash
python scripts/build-harness.py --check
python scripts/sync-harness.py --check
```

O CI vai rodar os mesmos checks — PRs que falham no CI não são revisados.

## Adicionando uma directive

1. Crie `directives/nome-da-directive.md`
2. Adicione o frontmatter obrigatório no topo:

```yaml
---
id: nome-da-directive
version: 1.0.0
triggers: ["palavra1", "palavra2", "palavra3"]
domain: universal | saas | api | automation | juridico-financeiro
estimated_tokens: 600
compatible_runtimes: [claude-code, antigravity, opencode, cursor]
last_updated: YYYY-MM-DD
---
```

3. Regenere o índice:
```bash
python scripts/build-harness.py
python scripts/sync-harness.py
```

4. Confirme que o --check passa antes de commitar

## Convenção de commits

```
feat(directive): adiciona diagnose para investigação de falhas
fix(ci): corrige ordenação case-sensitive no build-harness
harness(tipo-B): directive session-memory não cobria retomada parcial
docs(readme): atualiza seção de compatibilidade
```

## Protocolo de review

Todo PR passa pelo Protocolo PEV antes de ser mergeado:
- **PLAN** — a mudança está descrita na issue ou no PR?
- **EXECUTE** — o código faz o que a descrição diz?
- **VERIFY** — o CI passa? Os checks locais passam?

## Dúvidas

Abra uma Discussion antes de abrir um PR para mudanças grandes.
Para bugs simples e melhorias de docs, PR direto é bem-vindo.
