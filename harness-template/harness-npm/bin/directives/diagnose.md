# Directive: Diagnóstico Sistemático de Falhas

## Objetivo
Rastrear falhas de forma estruturada antes de corrigir.
Correção sem diagnóstico é sintoma sem causa.

## Quando Usar
- Erro inesperado em produção ou testes
- Comportamento que "não deveria acontecer"
- Falha recorrente sem resolução duradoura
- Regressão após deploy

## Protocolo de Diagnóstico (5 Passos)

### Passo 1 — Reproduzir
```
Qual input/condição causa o erro?
O erro é determinístico ou intermitente?
Em qual ambiente ocorre? (dev / staging / prod)
```
Não avance sem reprodução confirmada.

### Passo 2 — Localizar
```
Em qual camada ocorre?
  Camada 1 (directive incorreta)?
  Camada 2 (decisão do agente)?
  Camada 3 (script com bug)?

Qual arquivo/função específica?
Qual linha do stack trace?
```

### Passo 3 — Reduzir
```
Qual é o menor exemplo que reproduz o problema?
Quais variáveis podem ser eliminadas?
O problema ocorre com dados mínimos?
```

### Passo 4 — Corrigir
```
Corrija apenas o que o diagnóstico apontou.
Não corrija outros problemas encontrados no caminho
(abra issues separadas para eles).
```

### Passo 5 — Proteger (Hashimoto)
```
Escreva um teste que falharia antes da correção.
Atualize a directive para prevenir recorrência.
Adicione ao quality gate se for verificável automaticamente.
```

## Formato de Saída

```markdown
## Diagnóstico: [descrição do problema]

**Reprodução:** [input/condição exata]
**Camada:** [1 / 2 / 3]
**Localização:** [arquivo:linha]
**Causa raiz:** [o que realmente causou]
**Correção aplicada:** [o que foi mudado]
**Proteção:** [teste adicionado / directive atualizada / quality gate]
```

## Anti-Rationalization

❌ "Sei qual é o problema, vou direto corrigir" → Pule diagnóstico = corrija sintoma, não causa
❌ "Não consigo reproduzir mas vou corrigir assim mesmo" → Correção sem reprodução é chute
❌ "Já corrigi, não preciso escrever teste" → Sem teste = sem proteção contra regressão
❌ "É um caso muito específico, não vai acontecer de novo" → Se aconteceu uma vez, vai acontecer de novo

## Aprendizados
<!-- Atualize aqui com padrões de falha recorrentes -->
- [data] [padrão identificado e proteção adicionada]
