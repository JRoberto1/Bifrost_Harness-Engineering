# Contribuindo com o Bifrost

## Como contribuir

### 1. Issues e Bug Reports

Use os templates em `.github/ISSUE_TEMPLATE/` para relatar bugs ou solicitar features.

### 2. Pull Requests

```bash
# Fork e clone
git clone https://github.com/SEU_USUARIO/Bifrost_Harness-Engineering
cd Bifrost_Harness-Engineering

# Crie uma branch para sua contribuição
git checkout -b feat/minha-contribuicao

# Após as mudanças
git commit -m "feat: descrição da contribuição"
git push origin feat/minha-contribuicao
```

Abra um PR para `main` descrevendo o que mudou e por quê.

### 3. Contribuir com Skills

Skills da comunidade ficam em `community-skills/`. Para adicionar uma:

1. Crie `community-skills/skills/[nome]/SKILL.md`
2. Use o template em `.harness/skills/SKILL-template.md`
3. Abra PR no repositório [bifrost-community-skills](https://github.com/JRoberto1/bifrost-community-skills)

---

## Regras de Contribuição

- Nunca modifique a lógica funcional de scripts em `execution/` sem teste correspondente
- Siga a Regra de Hashimoto: cada bug encontrado deve virar uma regra no harness
- Atualize `.harness/VERSION` se a contribuição representa uma nova versão
- Execute `bash scripts/health-check.sh` antes de abrir PR
- Mantenha a arquitetura de 3 camadas: `directives/` → `.harness/doe/` → `execution/`
- Nunca commite `.env` ou credenciais — o pre-commit bloqueia, mas não force bypass

---

## Padrão de Commits

```
feat(scope): nova funcionalidade
fix(scope): correção de bug
harness(tipo): mudança no harness ou directives
docs: atualização de documentação
```

Exemplos:
```
feat(directives): adiciona directive para testes de integração
fix(execution): corrige validate_action.py no Windows
harness(quality-gate): adiciona verificação de imports circulares
docs: atualiza README com nova seção de domínios
```

---

## Estrutura de uma Directive

Use o template em `directives/DIRECTIVE-template.md` como base. Uma directive deve responder:
- **Quando** carregar esta directive (match de intenção)
- **O que** o agente deve fazer (passos verificáveis)
- **Como verificar** que foi feito corretamente

---

## Código de Conduta

Seja direto, colaborativo e construtivo.
Contribuições que melhoram a confiabilidade do harness são sempre bem-vindas.
