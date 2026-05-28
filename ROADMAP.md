# Bifrost — Roadmap

> Última atualização: 2025-05-27

## Estado atual — v1.4.0 (Harness) · v2.0.5 (CLI)

O harness está estável e testado. O CLI foi validado end-to-end.
Contribuições são bem-vindas nas áreas abaixo.

---

## v1.5.0 — Harness (próxima versão)

**Foco: Skills reais e domínios expandidos**

- [ ] Sistema de skills funcional — instalar via `npx harness-engineering skill`
- [ ] 3 skills prontas: `security-auditor`, `api-designer`, `code-reviewer`
- [ ] Domínio `mobile.md` — React Native / Flutter
- [ ] Domínio `data-science.md` — Python, Jupyter, pandas
- [ ] Directive `testing.md` — protocolos de TDD e cobertura mínima
- [ ] Directive `deployment.md` — checklist de deploy por plataforma

**Critério de conclusão:** `npx harness-engineering skill --bundle essentials`
instala skills reais que melhoram o comportamento do agente de forma mensurável.

---

## v2.1.0 — CLI (próxima versão)

**Foco: Fluxo de adoção em projetos existentes**

- [ ] `npx harness-engineering adopt` — wizard para projetos existentes
  detecta stack automaticamente e sugere directives relevantes
- [ ] `npx harness-engineering diff` — compara harness local com versão mais recente
  mostra o que mudou sem sobrescrever customizações
- [ ] `npx harness-engineering doctor` — diagnóstico completo do ambiente
  verifica Node, Python, Git, e integridade de todos os arquivos
- [ ] Suporte a `--silent` para uso em CI/CD pipelines

**Critério de conclusão:** usuário com projeto existente consegue adotar
o Bifrost em menos de 5 minutos sem perder customizações.

---

## v1.6.0 — Harness (futuro)

**Foco: Multi-agente e workflows paralelos**

- [ ] Directive `multi-agent.md` — coordenação entre agentes paralelos
- [ ] Protocolo de handoff entre sessões de runtimes diferentes
- [ ] Schema de sessão v2 com suporte a sub-tarefas e dependências
- [ ] Integração com GSD (get-shit-done) via harness compartilhado

---

## Contribuindo com o Roadmap

Tem uma ideia que não está aqui?
Abra uma [Discussion](https://github.com/JRoberto1/Bifrost_Harness-Engineering/discussions)
antes de abrir uma issue — assim alinhamos prioridade antes de implementar.

Para contribuir com itens já listados:
1. Comente na issue correspondente (ou crie uma)
2. Leia CONTRIBUTING.md
3. Abra um PR seguindo o PR template

---

## O que NÃO está no roadmap

- Suporte a modelos proprietários fechados (sem API pública)
- Interface web ou dashboard
- Banco de dados ou backend próprio

O Bifrost é e continuará sendo arquivos de texto + scripts leves.
A complexidade está no design, não na infraestrutura.
