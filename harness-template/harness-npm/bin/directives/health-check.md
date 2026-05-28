---
id: health-check
version: 1.0.0
triggers: ["saúde", "health", "verificar sistema", "início de sessão", "dependências"]
domain: universal
estimated_tokens: 400
compatible_runtimes: [claude-code, antigravity, opencode, cursor]
last_updated: 2026-05-27
---

# Directive: Verificar Saúde do Sistema

## Objetivo
Verificar se todos os componentes do projeto estão operacionais antes de iniciar trabalho.

## Quando Usar
- Início de qualquer sessão de trabalho
- Após deploy ou mudança de ambiente
- Quando comportamento inesperado for detectado

## Entradas Necessárias
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|------------|-----------|
| `ambiente` | string | não | `dev` (padrão) \| `staging` \| `prod` |

## Ferramentas / Scripts a Usar
```
execution/health-check.sh   → verifica harness e dependências do projeto
```

## Fluxo de Execução
```
1. Rodar execution/health-check.sh
2. Se algum item FAIL → identificar causa antes de prosseguir
3. Se tudo PASS → reportar "Sistema saudável" e aguardar próxima instrução
4. Se warnings → listar e perguntar ao usuário se deve continuar
```

## Saída Esperada
```json
{
  "status": "healthy | degraded | unhealthy",
  "checks": [
    { "nome": "AGENTS.md", "status": "PASS" },
    { "nome": "pre-commit hook", "status": "PASS" }
  ],
  "warnings": [],
  "erros": []
}
```

## Edge Cases
| Situação | Comportamento |
|---------|--------------|
| `.git` ausente | Avisar que hooks não podem ser instalados |
| Node/Python ausente | Listar o que está faltando com instrução de instalação |
| Skills ausentes | Sugerir `bash scripts/fetch-skill.sh --bundle essentials` |

## Critério de Sucesso
Todos os checks retornam PASS ou o usuário aprovou os warnings listados.

## Aprendizados
- [data] Adicione aqui descobertas sobre o ambiente ao longo do tempo
