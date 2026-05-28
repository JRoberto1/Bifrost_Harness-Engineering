---
id: nextjs-patterns
version: 1.0.0
triggers: ["componente", "page", "route", "server component", "client component", "api route", "middleware"]
domain: saas
estimated_tokens: 700
compatible_runtimes: [claude-code, antigravity, opencode, cursor]
last_updated: 2025-05-27
---

# Directive: Next.js Patterns

## Objetivo
Garantir consistência em componentes, rotas e patterns do Next.js 14 App Router.

## Server vs Client Components

Padrão: todo componente é Server Component por padrão.
Use `'use client'` apenas quando necessário:
- Hooks de estado (useState, useEffect)
- Event handlers (onClick, onChange)
- Browser APIs (window, document)

Nunca adicione `'use client'` sem necessidade real.

## Estrutura de Arquivos

```
app/
  (auth)/           ← Route group sem URL
  [id]/             ← Dynamic route
    page.tsx        ← Server Component
    layout.tsx      ← Layout compartilhado
    loading.tsx     ← Suspense boundary
    error.tsx       ← Error boundary
components/
  ui/               ← Componentes reutilizáveis
  features/         ← Componentes de feature
```

## Regras

- Props de Server Components não são serializáveis — não passe funções
- Data fetching em Server Components — nunca em Client Components
- Erro de hidratação → verifique se há `'use client'` faltando
- `useRouter` só em Client Components

## Output esperado

Ao criar componente:
```
TIPO: Server | Client
MOTIVO: [por que esse tipo]
ARQUIVO: [caminho exato]
```
