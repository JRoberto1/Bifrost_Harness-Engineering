---
id: deployment
version: 1.0.0
triggers: ["deploy", "deployment", "produção", "release", "vercel", "railway", "aws", "heroku", "docker", "ci/cd", "pipeline"]
domain: universal
estimated_tokens: 700
compatible_runtimes: [claude-code, antigravity, opencode, cursor]
last_updated: 2026-05-28
---

# Directive: Deployment & Release

## Objetivo
Checklist e protocolos para deploy seguro em qualquer plataforma,
com rollback definido e sem surpresas em produção.

## Quando Usar
- Antes de qualquer push para `main` / `production`
- Ao configurar pipeline de CI/CD pela primeira vez
- Ao executar `/ship` no Claude Code
- Ao fazer release de versão nova

## Checklist Pré-Deploy (obrigatório)

```
- [ ] /review executado e aprovado
- [ ] Todos os testes passando (CI verde)
- [ ] Sem console.log / print de debug em produção
- [ ] .env não commitado (verificar .gitignore)
- [ ] Variáveis de ambiente configuradas no provider
- [ ] Build local passa sem erros
- [ ] Migrations de banco aplicadas (se houver)
- [ ] Plano de rollback definido
- [ ] Janela de deploy comunicada (se sistema crítico)
```

## Protocolos por Plataforma

### Vercel (Next.js / frontend)
```bash
# Preview antes de produção
vercel                       # deploy preview
vercel --prod                # produção

# Verificar variáveis de ambiente
vercel env ls
```
- Sempre valide o preview URL antes de promover para produção
- Configure `vercel.json` para redirects e headers de segurança

### Railway / Render
```bash
# Deploy automático via git push para main
git push origin main

# Verificar logs após deploy
railway logs
```

### Docker
```bash
# Build e tag
docker build -t app:VERSION .

# Teste local antes de push
docker run --env-file .env app:VERSION

# Push para registry
docker push registry/app:VERSION
```

### GitHub Actions (CI/CD genérico)
```yaml
# Estrutura mínima recomendada
on:
  push:
    branches: [main]
jobs:
  deploy:
    steps:
      - run: npm test
      - run: npm run build
      - run: deploy-command
```

## Estratégia de Rollback

| Situação | Ação |
|----------|------|
| Bug crítico em < 5 min | Reverter para versão anterior imediatamente |
| Bug em feature específica | Feature flag off + hotfix |
| Corruption de dados | Restore de backup + postmortem |

Documente o rollback ANTES do deploy em `.harness/memory/last-session.json`.

## Variáveis de Ambiente

**Regra absoluta:** nunca commitar `.env` ou qualquer arquivo com segredos.

```
.env              → desenvolvimento local (no .gitignore)
.env.example      → template sem valores (commitado)
provider secrets  → produção (Vercel, Railway, AWS Secrets Manager)
```

## Janelas de Deploy

Para sistemas com usuários ativos, prefira deploys em:
- Horários de baixo tráfego (fora do horário comercial)
- Incrementais (Blue/Green, Canary) para sistemas críticos
- Nunca na sexta à tarde

## Aprendizados
<!-- Atualize com incidentes de produção e o que foi aprendido -->
- [data] [incidente ou aprendizado de deploy]
