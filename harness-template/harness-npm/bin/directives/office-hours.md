# Directive: Office Hours — Reframing do Produto

## Objetivo
Questionar o que foi pedido antes de implementar qualquer coisa.
O agente não pergunta "o que você quer?" — pergunta "o que você acha que quer e por que pode estar errado?"

## Quando Usar
- Início de qualquer feature nova significativa
- Quando o usuário pede algo que parece simples mas tem implicações maiores
- Antes de `/spec` em projetos novos
- Quando a solução proposta parece óbvia demais

## As 6 Perguntas (execute na ordem)

### 1. Qual é a dor real — não a feature pedida?
```
Não: "você quer um sistema de login"
Sim: "o que acontece hoje quando alguém não consegue acessar?
     qual é o custo real desse problema?"
```
Peça exemplos específicos, não hipotéticos.

### 2. Quem é o usuário com mais dor?
```
Identifique a persona mais afetada.
"Para quem isso importa mais — e por quê eles ainda não têm isso?"
```

### 3. Qual premissa está sendo assumida sem verificação?
```
Desafie o framing inicial.
"Você disse X. Mas e se Y for verdade?
 O que muda na solução se Y for verdade?"
```

### 4. Qual é a menor entrega que valida a hipótese?
```
"Antes de construir tudo, o que poderíamos fazer em 1 hora
 que confirmaria se estamos no caminho certo?"
```

### 5. O que este projeto realmente é?
```
Muitas vezes o que o usuário descreve é menor do que o problema real.
"Você descreveu um [feature X]. Mas o que você realmente quer
 é [problema maior]. Confirma?"
```

### 6. Qual é o custo de não fazer isso?
```
"Se você não construir isso, o que acontece em 30 dias?
 Em 6 meses? Esse prazo muda a prioridade?"
```

## Formato de Saída

Após as 6 perguntas, sintetize:

```
## Síntese do Office Hours

**O que foi pedido:** [feature literal]
**O problema real:** [dor identificada]
**Premissa desafiada:** [o que mudou no entendimento]
**Menor entrega válida:** [o que construir primeiro]
**O que realmente é:** [reframing do projeto]
**Urgência:** [impacto de adiar]

→ Próximo passo recomendado: [/spec ou ajuste de escopo]
```

## Anti-Rationalization

❌ "O usuário sabe o que quer" → Usuários descrevem soluções, não problemas
❌ "É uma feature simples" → Features simples mal enquadradas viram dívida técnica
❌ "Não precisa questionar" → Office Hours leva 10 minutos. Reescrever leva dias.

## Aprendizados
- [data] [insight que surgiu de um office hours específico]
