# Directive: Gestão de Contexto e Tokens

## Objetivo
Manter consumo de tokens sob controle sem perder qualidade.
Contexto mal gerenciado é o principal custo oculto em projetos com IA.

## As 3 Estratégias de Compressão

### 1. Auto-Compaction (threshold ~70% da janela)
Disparada automaticamente quando o contexto atinge ~70% da janela.
```bash
python execution/compress-history.py --auto
```
Mantém: decisões, estado atual, erros relevantes.
Descarta: raciocínio intermediário, confirmações, verbose output.

### 2. Micro-Compaction (cirúrgica)
Comprime trechos específicos sem tocar no resto.
Use quando um bloco de mensagens específico está pesado mas o restante é útil.
```
"Comprima apenas as mensagens sobre [tópico X] mantendo o resto intacto"
```

### 3. Reactive-Compaction (por qualidade)
Dispara quando a qualidade das respostas degrada — o agente começa a repetir
informações, esquecer decisões anteriores ou responder de forma inconsistente.
```
Sinal: agente sugere algo já decidido e rejeitado antes
Ação: /context-check --compress imediatamente
```

## Fluxo de Decisão

```
Resposta degradou? ──→ Reactive-Compaction agora
        ↓ não
8+ turnos? ──────────→ Auto-Compaction agora
        ↓ não
Bloco específico pesado? → Micro-Compaction
        ↓ não
Continue normalmente
```

## Lazy Loading de Directives

```
Antes: AGENTS.md + todos os domínios = 15k tokens
Depois: AGENTS.md + index.md + 1 directive = 3k tokens  (-80%)
```

Sempre use `.harness/index.md` para identificar o que carregar.

## Progressive Disclosure

```bash
# ❌ Nunca
cat src/services/auth.ts          # carrega arquivo inteiro

# ✅ Sempre
grep -n "gerarToken" src/services/auth.ts    # só o relevante
head -30 src/services/auth.ts               # só o início
sed -n '45,70p' src/services/auth.ts        # só as linhas certas
```

## Observation Masking

Outputs > 20 linhas → sempre aplique placeholder:

```
[Logs omitidos — 847 linhas | Resultado: FALHA | Erro: timeout linha 42]
[Testes omitidos — 47 testes | Status: 46 PASS, 1 FALHA: 'valor em float']
[Response omitida — GET /api/contratos | 200 | 50 items | schema: {id, tipo}]
```

Isso é **52% mais barato** que pedir ao modelo para sumarizar.

## Roteamento de Modelos

| Tarefa | Modelo | Por quê |
|--------|--------|---------|
| Docs, testes, formatação | Haiku / Mini | mecânica — não precisa de raciocínio |
| Código, implementação | Sonnet / padrão | equilíbrio ideal |
| Arquitetura, debugging | Opus / Pro | precisa de raciocínio profundo |

**Claude Code:** use `/model-select` antes de iniciar.

## Aprendizados
- [data] [padrão de desperdício identificado e solução]
