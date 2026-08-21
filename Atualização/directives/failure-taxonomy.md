# Failure Taxonomy — Bifrost v2.6.0

Classificação formal de falhas para o Hashimoto automático.
Arquivo consultado por `execution/self-correction.py`.

---

## Categorias

### A — Harness Miss
```
Definição: O harness não tinha uma regra necessária para prevenir a falha.
Pergunta:  "Faltava uma regra no harness?"
Evidência: Agente fez algo errado sem nenhuma instrução contrária.
Fix:       Adicionar regra ao AGENTS.md ou directive relevante.
```

### B — Directive Gap
```
Definição: A regra existia mas era incompleta, ambígua ou insuficiente.
Pergunta:  "A regra existia mas era vaga ou incompleta?"
Evidência: Agente seguiu uma regra mas o resultado ainda estava errado.
Fix:       Melhorar a directive existente com mais especificidade.
```

### C — Context Overflow
```
Definição: O agente perdeu capacidade por excesso ou falta de contexto.
Pergunta:  "O contexto necessário estava indisponível ou soterrado?"
Evidência: Agente ignorou informação que estava no contexto,
           ou não tinha informação necessária para a tarefa.
Fix:       Melhorar Token Filter ou Observation Masking.
```

### D — Hallucination
```
Definição: O modelo produziu informação, decisão ou código sem fundamento.
Pergunta:  "O agente afirmou ou produziu algo sem evidência real?"
Evidência: Output contém fatos falsos, APIs inexistentes, ou lógica inventada.
Fix:       Adicionar verificação, quality gate, ou usar Context7 para a lib.
```

### E — Permission Violation
```
Definição: O agente executou ou tentou executar algo fora das permissões.
Pergunta:  "O agente fez algo que os Três Tiers proibiam?"
Evidência: Modificou protected_path, deletou sem perguntar, fez push não autorizado.
Fix:       Reforçar Três Tiers no AGENTS.md ou adicionar ao validate_action.py.
```

### U — Unknown
```
Definição: Evidência insuficiente para classificar com segurança.
Ação:      NÃO alterar o harness. Aguardar revisão humana.
Regra:     Uma classificação errada alimenta aprendizado errado.
           Quando em dúvida → U.
```

---

## Tabela de Decisão — Casos Ambíguos

| Situação | Pergunta decisiva | Classificação |
|----------|------------------|---------------|
| A vs B | A regra existia mas era vaga? | → B |
| B vs C | Faltava regra OU faltava contexto? | Depende da causa |
| C vs D | Foi excesso de contexto ou invenção? | Checar se info estava disponível |
| A vs D | Tinha regra e mesmo assim inventou? | → D |
| Qualquer dúvida | — | → U |

---

## Processo Hashimoto por Categoria

```
A → adicionar regra ao AGENTS.md ou directive
B → melhorar directive existente com mais especificidade
C → atualizar .harness/index.md (Token Filter)
D → adicionar quality gate ou verificação
E → reforçar Três Tiers ou protected_paths
U → registrar para revisão humana, não alterar harness

Para A, B, C, D, E:
  1. Aplicar fix
  2. Criar regression case em .harness/tests/failures/
  3. Commit: harness(A|B|C|D|E): descrição do aprendizado
```

---

## Erros que NÃO ativam Hashimoto

```
→ Erro de usuário (instrução ambígua do humano)
→ Erro de runtime/infraestrutura (API externa fora do ar)
→ Erro isolado sem evidência de recorrência
→ Classificação U (insuficiente para agir)
```
