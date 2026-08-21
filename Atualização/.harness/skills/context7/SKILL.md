# SKILL: Context7 — Documentação Atualizada
<!-- Bifrost Community Skill v1.0.0 -->
<!-- Compatível: Claude Code · OpenCode · Cursor · Antigravity (via web) -->

## Objetivo
Buscar documentação atualizada e específica de versão antes de implementar
com qualquer biblioteca externa. Elimina APIs alucinadas e código desatualizado.

## Quando Ativar (regra seletiva — não use para tudo)

### ✅ USE quando
- A versão da biblioteca importa (Next.js 14 vs 15, Pydantic v1 vs v2, Prisma 5 vs 6)
- Você não usou essa API específica nos últimos 30 minutos de sessão
- A tarefa envolve configuração, middleware, auth, ou setup de biblioteca
- O usuário menciona uma versão específica de biblioteca
- Você não tem certeza da sintaxe atual

### ❌ NÃO USE para
- Operações básicas de linguagem (`map`, `filter`, `async/await`)
- Bibliotecas nativas do Node/Python (sem versão crítica)
- Bibliotecas que você já consultou nesta sessão
- Consultas genéricas sem contexto de versão

## Por Runtime

### Claude Code (nativo)

```bash
# Setup único (uma vez por máquina)
npx ctx7 setup --claude

# Uso durante o trabalho
ctx7 library nextjs               # encontra o ID da biblioteca
ctx7 docs /vercel/next.js "middleware authentication"
ctx7 docs /prisma/prisma "one-to-many relations"
ctx7 docs /colinhacks/zod "form validation v3"
```

A skill instalada pelo `ctx7 setup` faz o Claude Code buscar docs automaticamente
quando você menciona uma biblioteca. Não é necessário pedir explicitamente.

### OpenCode

```bash
# Setup único
npx ctx7 setup --opencode

# Uso idêntico ao Claude Code
ctx7 docs /[biblioteca] "[query específica]"
```

### Cursor

```bash
# Setup único
npx ctx7 setup --cursor

# Uso via MCP — automático quando mencionada a biblioteca
```

### Antigravity (sem suporte nativo — use web search)

O Antigravity não tem suporte nativo ao Context7. Use a busca web integrada:

```
# Em vez de ctx7, peça ao agente:
"Busque a documentação oficial do Next.js 15 sobre middleware
e use a versão atual da API antes de implementar."

# Ou rode no terminal antes da sessão e cole o resultado:
npx ctx7 docs /vercel/next.js "middleware" --no-install
```

## Bibliotecas mais usadas — IDs Context7

| Biblioteca | ID Context7 |
|-----------|------------|
| Next.js | `/vercel/next.js` |
| React | `/facebook/react` |
| Prisma | `/prisma/prisma` |
| Zod | `/colinhacks/zod` |
| Tailwind | `/tailwindlabs/tailwindcss` |
| Supabase | `/supabase/supabase` |
| FastAPI | `/tiangolo/fastapi` |
| Pydantic | `/pydantic/pydantic` |
| Drizzle | `/drizzle-team/drizzle-orm` |
| tRPC | `/trpc/trpc` |
| ShadCN UI | `/shadcn-ui/ui` |

## Formato de uso no prompt

```
# Antes de implementar, Claude Code vai automaticamente:
ctx7 docs /vercel/next.js "app router middleware JWT"

# Resultado injetado no contexto (~2-5k tokens)
# → agente implementa com API correta e atual
```

## Impacto em Tokens

```
Sem Context7:
  erro de API desatualizada → 3-5 turnos de correção = 15-30k tokens
Com Context7:
  ~3k tokens de docs → implementação correta na 1ª vez
  Saldo: -12 a -27k tokens por implementação com erro evitado
```

## Aprendizados
- [data] [biblioteca que causou erro sem Context7 — vale adicionar ao uso padrão]
