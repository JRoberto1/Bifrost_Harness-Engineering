# Stack — E-commerce Next.js

## Versões

| Tecnologia | Versão | Papel |
|------------|--------|-------|
| Next.js | 14.2.x | Framework full-stack (App Router) |
| React | 18.3.x | UI library |
| TypeScript | 5.4.x | Tipagem estática |
| Tailwind CSS | 3.4.x | Estilização utilitária |
| Prisma | 5.14.x | ORM — acesso ao banco |
| PostgreSQL | 16 | Banco de dados principal |
| Stripe | 16.x SDK | Processamento de pagamentos |
| NextAuth.js | 5.x (beta) | Autenticação |
| Zod | 3.23.x | Validação de schemas |

## Estrutura de Rotas

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (checkout)/
│   ├── checkout/page.tsx
│   └── checkout/success/page.tsx
├── (shop)/
│   ├── page.tsx                    ← catálogo
│   └── products/[slug]/page.tsx    ← produto
├── admin/
│   └── dashboard/page.tsx
└── api/
    ├── auth/[...nextauth]/route.ts
    ├── checkout/create-intent/route.ts
    └── stripe/webhook/route.ts
```

## Banco de Dados

ORM: Prisma com PostgreSQL.

Modelos principais:
- `User` — autenticação + perfil
- `Product` — catálogo com variantes
- `Order` — pedido com status de pagamento
- `OrderItem` — itens do pedido

Schema em: `prisma/schema.prisma`

Migrations em: `prisma/migrations/` — **nunca edite manualmente**.

## Regras de Acesso ao Banco

- Sempre via Prisma Client — nunca SQL raw sem comentário explicativo
- Queries de leitura em Server Components (sem round-trip cliente)
- Mutations via Server Actions ou Route Handlers
- Transações para operações multi-tabela (ex: criar Order + OrderItems)

## Variáveis de Ambiente

| Variável | Onde | Obrigatória |
|----------|------|-------------|
| `DATABASE_URL` | `.env.local` | Sim |
| `NEXTAUTH_SECRET` | `.env.local` | Sim |
| `STRIPE_SECRET_KEY` | `.env.local` | Sim |
| `STRIPE_WEBHOOK_SECRET` | `.env.local` | Sim |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `.env.local` | Sim |

Nunca commite `.env.local`. Arquivo protegido pelo `.harness/config.json`.

## Convenções

- Monetary values: sempre `number` inteiro em centavos — nunca `float`
- Datas: sempre `Date` ou ISO string — nunca timestamp Unix diretamente
- IDs: sempre `string` (CUID do Prisma) — nunca `number` auto-increment
- Erros de API: sempre retornar `{ error: string }` com HTTP status correto
