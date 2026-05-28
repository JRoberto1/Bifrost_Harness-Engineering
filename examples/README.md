# Bifrost — Exemplo de Uso Real

Este exemplo mostra o Bifrost instalado em um projeto Next.js + TypeScript.
Não é código funcional — é a estrutura de arquivos e o conteúdo
personalizado que você teria após `npx harness-engineering`.

## Estrutura

```
examples/nextjs-typescript/
├── AGENTS.md               ← harness personalizado para Next.js
├── directives/
│   └── nextjs-patterns.md  ← directive customizada
├── .harness/
│   ├── config.json         ← protected paths do projeto
│   └── memory/
│       └── last-session.json ← sessão real preenchida
└── docs/
    └── stack.md            ← stack documentada para o agente
```
