# Directive: Observation Masking

## Objetivo
Substituir outputs longos por placeholders estruturados.
52% mais barato que pedir ao modelo para sumarizar.

## Quando Aplicar

| Tipo | Threshold | Ação |
|------|-----------|------|
| Logs de build/erro | > 20 linhas | Sempre masking |
| Resultado de testes | > 10 testes | Sempre masking |
| Conteúdo de arquivo | > 100 linhas | Sempre masking |
| Stack trace | > 15 linhas | Sempre masking |
| Response de API | > 50 linhas | Sempre masking |

## Formato

```
[TIPO omitido — Resultado: STATUS | Detalhe em 1 linha]
```

## Exemplos

```
[Logs omitidos — 847 linhas | Resultado: FALHA | Erro: timeout linha 42]
[Testes omitidos — 47 testes | Status: 46 PASS, 1 FALHA: 'valor em float']
[Arquivo omitido — src/service.ts 312 linhas | Seção carregada: linhas 45-67]
[Response omitida — GET /api/contratos | 200 | 50 items | {id, tipo, status}]
[Stack trace omitido | Erro: Cannot read 'id' of undefined | Origem: linha 89]
```

## Quando NÃO aplicar

- Output menor que 20 linhas
- O conteúdo completo É a tarefa ("mostre o arquivo X")
- Debug interativo onde cada linha importa
- Revisão jurídica onde omitir causa erro

## Anti-Rationalization

❌ "Preciso ver tudo para entender" → O placeholder tem o essencial
❌ "É só um arquivo pequeno" → 100 linhas = ~1.500 tokens desperdiçados
❌ "O log pode ter informação importante" → O placeholder captura resultado e causa

## Aprendizados
- [data] [padrão de output longo identificado]
