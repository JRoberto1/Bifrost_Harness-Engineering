---
id: performance-audit
version: 1.0.0
bundle: essentials
description: Auditoria sistemática de performance em aplicações web e APIs
source: Bifrost original
---

# Skill: Performance Audit

## Quando usar
Investigação de lentidão, preparação para escala, revisão de código
crítico para performance.

## Web — Core Web Vitals

| Métrica | O que mede | Bom | Ruim |
|---------|-----------|-----|------|
| LCP | Maior conteúdo carregado | < 2.5s | > 4s |
| FID/INP | Responsividade ao input | < 100ms | > 300ms |
| CLS | Estabilidade visual | < 0.1 | > 0.25 |

### Como medir
- Lighthouse no Chrome DevTools (lab data)
- PageSpeed Insights (field data real)
- WebPageTest para análise aprofundada

### Causas comuns de LCP ruim
- Imagens sem width/height (causa reflow)
- Fonts bloqueando render (use font-display: swap)
- JavaScript no <head> sem defer/async
- TTFB alto (problema de servidor/CDN)

## API — Performance

### Identificar gargalos

```bash
# Medir tempo de resposta
curl -o /dev/null -s -w "%{time_total}\n" https://api.example.com/endpoint

# Com hey (load testing)
hey -n 1000 -c 50 https://api.example.com/endpoint
```

### Causas comuns
- N+1 queries (use query explain/analyze)
- Sem índices nas colunas de busca frequente
- Serialização de objetos grandes desnecessariamente
- Sem cache em dados que não mudam frequentemente

## Database

```sql
-- Identificar queries lentas (PostgreSQL)
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Ver plano de execução
EXPLAIN ANALYZE SELECT ...;
```

## Output Esperado
BASELINE: [métricas antes]
GARGALOS: [lista priorizada por impacto]
AÇÕES: [mudanças específicas com impacto estimado]
RESULTADO: [métricas depois]
