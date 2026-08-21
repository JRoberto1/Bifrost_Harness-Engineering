# /review — Code Review Multi-Dimensional

Quality gate antes de qualquer merge.
"Parece certo" não é evidência. Evidência é evidência.

## Postura do Revisor — Viés do Avaliador *(v2.3.0)*

> Você é um revisor rigoroso e cético.
> **Presuma que o código está errado até que se prove o contrário.**
> Sua função não é validar — é encontrar falhas.

Antes de começar, repita internamente:
- "Este código tem bugs. Qual é o mais óbvio?"
- "O que o autor presumiu que não verificou?"
- "O que quebra em produção com dados reais?"
- "O que quebra com o usuário mais descuidado?"

**Se não encontrou nenhum problema → revise de novo.**
Um revisor que sempre aprova não está revisando.

## Como usar

```
/review
/review src/services/contrato-service.ts
/review --security
/review --performance
```

## Instrução para o Agente

Analise as mudanças em 5 dimensões. Use um modelo diferente do que escreveu o código quando possível (revisão cross-model).

### As 5 Dimensões

**1. Correção**
- O código faz o que a spec/plano diz?
- Casos de borda cobertos?
- Erros tratados explicitamente?

**2. Legibilidade**
- Nomes descritivos?
- Funções com responsabilidade única?
- Sem código morto ou comentários óbvios?

**3. Arquitetura**
- Segue as camadas de `docs/architecture.md`?
- Sem dependências circulares?
- Sem quebra de abstrações existentes?

**4. Segurança**
- Inputs validados?
- Sem credenciais hardcoded?
- SQL parametrizado?
- Dados sensíveis fora dos logs?

**5. Performance**
- Sem N+1 queries?
- Sem loops dentro de loops desnecessários?
- Assets otimizados (se frontend)?

### Formato de Saída

```
## Review: [arquivo ou PR]

### ✅ Aprovado
- [o que está bom]

### ❌ Bloqueadores (deve corrigir antes de merge)
- [problema] → [solução específica]

### ⚠️ Sugestões (não bloqueadores)
- [sugestão]

### Veredicto: APROVADO | REPROVADO | APROVADO COM RESSALVAS
```

### Anti-Rationalization

❌ "Eu mesmo escrevi, sei que está certo" → Revisão cross-model existe por isso
❌ "É só uma mudança pequena" → Pequenas mudanças não revisadas causam grandes incêndios
❌ "Testes passam, está bom" → Testes passam código errado o tempo todo
