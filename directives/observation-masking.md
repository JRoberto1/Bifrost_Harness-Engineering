---
id: observation-masking
version: 1.0.0
triggers: ["log", "output longo", "masking", "placeholder", "ocultar", "resumir output"]
domain: universal
estimated_tokens: 700
compatible_runtimes: [claude-code, antigravity, opencode, cursor]
last_updated: 2026-05-27
---

# Directive: Observation Masking

## Objetivo
Substituir outputs longos por placeholders estruturados,
reduzindo consumo de tokens em 52% sem perder informação relevante.

## Quando Aplicar

Aplique masking sempre que um output tiver **mais de 20 linhas** ou
**mais de 1.000 tokens estimados**:

| Tipo de Output | Threshold | Aplicar masking |
|---------------|-----------|----------------|
| Logs de erro | > 20 linhas | Sempre |
| Output de testes | > 10 testes | Sempre |
| Resultado de grep/find | > 30 linhas | Sempre |
| Conteúdo de arquivo | > 100 linhas | Sempre |
| Stack trace | > 15 linhas | Sempre |
| Response de API | > 50 linhas | Sempre |

## Formato do Placeholder

```
[TIPO omitido — Resultado: STATUS | Detalhe em 1 linha]
```

**Campos obrigatórios:**
- `TIPO`: o que foi omitido (Logs, Output, Teste, Arquivo, Response)
- `Resultado`: PASS / FALHA / ERRO / OK / PARCIAL
- `Detalhe`: a informação mais relevante em uma linha

## Exemplos por Tipo

### Logs de build/erro
```
❌ Sem masking:
[2026-04-20 10:23:01] Starting build...
[2026-04-20 10:23:02] Compiling TypeScript...
[... 200 linhas de log ...]
[2026-04-20 10:23:45] ERROR: Cannot find module './auth'

✅ Com masking:
[Logs omitidos — 847 linhas | Resultado: FALHA | Erro: Cannot find module './auth' em index.ts:42]
```

### Resultado de testes
```
❌ Sem masking:
✓ deve criar contrato com dados válidos (23ms)
✓ deve validar campos obrigatórios (11ms)
[... 44 testes passando ...]
✗ deve rejeitar valor em float (FALHA)

✅ Com masking:
[Testes omitidos — 47 testes | Resultado: PARCIAL | 46 PASS, 1 FALHA: 'deve rejeitar valor em float']
```

### Conteúdo de arquivo longo
```
❌ Sem masking:
[conteúdo completo do arquivo com 300 linhas]

✅ Com masking:
[Arquivo omitido — src/services/contrato-service.ts | 312 linhas | Seção relevante carregada: linhas 45-67]
```

### Response de API
```
❌ Sem masking:
{ "contratos": [ { "id": "uuid-1", ... }, { "id": "uuid-2", ... }, ... 50 items ] }

✅ Com masking:
[Response omitida — GET /api/contratos | Status: 200 | 50 items retornados | Estrutura: {id, tipo, status, data}]
```

### Stack trace
```
❌ Sem masking:
Error: Cannot read property 'id' of undefined
    at ContratoService.gerar (/src/services/contrato-service.ts:89)
    at async handler (/src/app/api/contratos/route.ts:23)
    [... 15 linhas de stack ...]

✅ Com masking:
[Stack trace omitido | Erro: Cannot read 'id' of undefined | Origem: ContratoService.gerar linha 89]
```

## Quando NÃO aplicar masking

- Output é menor que 20 linhas
- O conteúdo completo é a própria tarefa (ex: "mostre o conteúdo do arquivo")
- Debug interativo onde cada linha importa
- Revisão jurídica onde omitir pode causar erro

## Aprendizados
- [data] [padrão identificado]
