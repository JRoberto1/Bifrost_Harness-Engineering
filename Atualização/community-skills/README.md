# Bifrost Community Skills

> Directives, domínios e skills criados pela comunidade para o [Bifrost](https://github.com/JRoberto1/Bifrost_Harness-Engineering).
> Instale qualquer skill com: `npx harness-engineering skill <nome>`

---

## O que é isso

O Bifrost é um harness universal para projetos de IA. Este repositório é onde a comunidade compartilha:

- **Directives** — SOPs para tecnologias específicas
- **Domínios** — regras de negócio por vertical
- **Skills** — habilidades especializadas por linguagem ou framework

---

## Skills Disponíveis

### Frameworks Web
| Skill | Descrição | Instalar |
|-------|-----------|---------|
| `nextjs` | Harness para Next.js 14+ com App Router | `npx harness-engineering skill nextjs` |
| `nuxtjs` | Harness para Nuxt 3 + Composition API | `npx harness-engineering skill nuxtjs` |
| `laravel` | Harness para Laravel 11 + Sail | `npx harness-engineering skill laravel` |
| `django` | Harness para Django 5 + DRF | `npx harness-engineering skill django` |

### Linguagens
| Skill | Descrição | Instalar |
|-------|-----------|---------|
| `python-fastapi` | FastAPI + Pydantic v2 + async | `npx harness-engineering skill python-fastapi` |
| `rust` | Rust com ownership rules no harness | `npx harness-engineering skill rust` |
| `golang` | Go com convenções idiomáticas | `npx harness-engineering skill golang` |

### Segurança
| Skill | Descrição | Instalar |
|-------|-----------|---------|
| `security-solidity` | Smart contracts com auditoria de segurança | `npx harness-engineering skill security-solidity` |
| `owasp-top10` | Harness focado em OWASP Top 10 | `npx harness-engineering skill owasp-top10` |
| `lgpd` | Regras de conformidade LGPD para projetos BR | `npx harness-engineering skill lgpd` |

### Domínios de Negócio
| Skill | Descrição | Instalar |
|-------|-----------|---------|
| `ecommerce` | Regras de e-commerce: catálogo, checkout, pagamento | `npx harness-engineering skill ecommerce` |
| `saude` | Harness para sistemas de saúde (LGPD + CFM) | `npx harness-engineering skill saude` |
| `fintech` | Regras financeiras BR: PIX, Open Finance, BCB | `npx harness-engineering skill fintech` |

---

## Como Contribuir

### 1. Estrutura de uma skill

```
skills/
└── nome-da-skill/
    ├── SKILL.md          ← instrução principal (obrigatório)
    ├── DIRECTIVE.md      ← SOP específico (opcional)
    ├── domain.md         ← regras de domínio (opcional)
    └── README.md         ← como usar (obrigatório)
```

### 2. Formato do SKILL.md

```markdown
# SKILL: [Nome]
<!-- Bifrost Community Skill -->

## Quando Usar
[Uma frase clara]

## Regras Específicas
- [regra 1]
- [regra 2]

## Quality Gates Adicionais
- [ ] [verificação específica desta skill]

## Anti-Rationalization
❌ "[desculpa comum]" → [por que não vale]

## Aprendizados
- [data] [aprendizado]
```

### 3. Abrir PR

1. Fork este repositório
2. Crie `skills/nome-da-skill/`
3. Siga o formato acima
4. Abra PR com título: `skill(nome): descrição curta`

---

## Regras da Comunidade

- Skills devem ser testadas em projetos reais antes do PR
- Sem dependências externas — zero infra, só Markdown
- Uma skill por PR
- Inglês ou Português — ambos aceitos

---

## Compatibilidade

Todas as skills são compatíveis com:

| Runtime | Suporte |
|---------|---------|
| Claude Code | ✅ nativo |
| Antigravity | ✅ via GEMINI.md |
| OpenCode | ✅ via AGENTS.md |
| Cursor | ✅ via .cursorrules |

---

*Parte do ecossistema [Bifrost Harness Engineering](https://github.com/JRoberto1/Bifrost_Harness-Engineering)*
