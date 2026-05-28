---
id: testing
version: 1.0.0
triggers: ["teste", "test", "tdd", "cobertura", "coverage", "jest", "pytest", "vitest", "unit test", "integração"]
domain: universal
estimated_tokens: 650
compatible_runtimes: [claude-code, antigravity, opencode, cursor]
last_updated: 2026-05-28
---

# Directive: Testing & Cobertura

## Objetivo
Garantir que qualquer código gerado ou modificado seja testado de forma
sistemática, com cobertura mínima definida e protocolo TDD aplicado.

## Quando Usar
- Antes de implementar qualquer feature nova
- Ao corrigir um bug (test-first)
- Ao revisar PR com alterações de lógica
- Ao detectar cobertura abaixo do limiar do projeto

## Protocolo TDD

```
RED   → escreva o teste que vai falhar antes de qualquer código
GREEN → escreva o mínimo de código para passar o teste
REFACTOR → limpe o código sem quebrar o teste
```

Nunca escreva código de produção antes do teste correspondente.

## Cobertura Mínima por Tipo

| Tipo de Arquivo | Cobertura Mínima |
|-----------------|------------------|
| Lógica de negócio | 90% |
| Utilitários / helpers | 80% |
| API handlers | 80% |
| Componentes UI | 60% |
| Scripts de automação | 70% |

> Ajuste esses limiares em `.harness/config.json` para seu projeto.

## Anatomia de um Teste Bom

```
describe("[unidade sob teste]", () => {
  it("deve [comportamento esperado] quando [condição]", () => {
    // ARRANGE — prepara o estado
    // ACT     — executa a unidade
    // ASSERT  — verifica o resultado
  });
});
```

Nomes de teste: frase completa em português ou inglês.
Nunca use: `test1`, `testeA`, `fooTest`.

## Checklist Antes de Commitar

- [ ] Todos os testes passando localmente (`npm test` / `pytest` / `go test`)
- [ ] Nenhum teste novo marcado como `.skip` ou `xtest`
- [ ] Mocks explicitamente identificados (`// MOCK:`)
- [ ] Casos de borda cobertos: null, vazio, limite, erro
- [ ] Sem `console.log` dentro dos testes

## Por Runtime / Framework

### Jest / Vitest (JavaScript)
```bash
npx jest --coverage
npx vitest run --coverage
```

### pytest (Python)
```bash
pytest --cov=. --cov-report=term-missing
```

### Go
```bash
go test ./... -cover
```

## Quando NÃO aplicar TDD

- Protótipos descartáveis (marque como `// PROTOTIPO — sem testes`)
- Scripts de migração única (documente o resultado esperado, valide manualmente)
- Configuração pura (YAML, JSON sem lógica)

## Aprendizados
<!-- Atualize quando encontrar padrões de falha recorrentes -->
- [data] [padrão identificado e solução aplicada]
