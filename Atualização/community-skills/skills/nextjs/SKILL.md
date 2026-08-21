# SKILL: Next.js 14+ App Router
<!-- Bifrost Community Skill v1.0.0 -->

## Quando Usar
Projetos Next.js 14+ com App Router, Server Components e TypeScript.

## Regras Específicas

### Arquitetura
- Componentes de servidor por padrão — `use client` só quando necessário
- Rotas em `app/` · API routes em `app/api/`
- Dados: `fetch` nativo com cache · nunca `axios` sem justificativa
- Metadata: sempre definir `generateMetadata` em page.tsx

### Tipagem
- Props de Server Components são sempre `async`
- `SearchParams` tipado como `Promise<{[key: string]: string}>`
- Nunca `any` — use `unknown` e type guard

### Performance
- Imagens: sempre `next/image` com `width` e `height`
- Fontes: sempre `next/font` — nunca import direto de Google Fonts
- Loading: sempre `loading.tsx` em rotas com fetch
- Error: sempre `error.tsx` em rotas com fetch

### Segurança
- Server Actions validadas com Zod antes de persistir
- Headers de segurança em `next.config.js`
- Variáveis públicas: só `NEXT_PUBLIC_*`

## Quality Gates Adicionais
- [ ] Sem `use client` desnecessário em Server Components
- [ ] `next/image` em todas as imagens
- [ ] `loading.tsx` em todas as rotas com dados remotos
- [ ] Server Actions validadas com schema

## Anti-Rationalization
❌ "Vou usar `use client` para simplificar" → Server Components são mais eficientes
❌ "É só uma imagem pequena, posso usar `<img>`" → `next/image` otimiza automaticamente
❌ "Loading é opcional" → UX degradada sem feedback visual

## Aprendizados
- [data] [aprendizado específico do Next.js]
