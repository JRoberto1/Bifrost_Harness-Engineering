# /ship — Checklist de Produção

Não faça deploy sem passar por este checklist.
Se qualquer item for FAIL → corrija antes de continuar.

## Postura

> "Às vezes você empilha lixo no contexto e impede o agente de ter eficiência."
> O /ship garante que o que vai para produção está limpo — código e documentação.

---

## Checklist

### Código
- [ ] `/review` executado e aprovado
- [ ] Todos os testes passando (`npm test` / `pytest`)
- [ ] Sem `console.log` solto em produção
- [ ] Sem `any` em TypeScript
- [ ] Sem credenciais hardcoded
- [ ] WIP commits removidos ou squashed

### Segurança
- [ ] `.env` não commitado
- [ ] Protected paths do `.harness/config.json` respeitados
- [ ] Inputs validados nos endpoints novos
- [ ] `npm audit` sem vulnerabilidades críticas

### 📄 Document Release *(v2.5.0)*

**Verifique cada doc abaixo. Se está desatualizado → atualize antes de continuar.**

| Arquivo | Verificar se |
|---------|-------------|
| `README.md` | Menciona features que acabaram de ser implementadas? |
| `AGENTS.md` | Regras novas descobertas foram adicionadas? |
| `CLAUDE.md` / `GEMINI.md` | Sincronizados com AGENTS.md? |
| `docs/architecture.md` | Reflete decisões arquiteturais tomadas nesta sprint? |
| `docs/domain-rules.md` | Regras de negócio novas estão documentadas? |
| `claude-progress.txt` | Marca esta feature como ✅ Entregue? |
| `directives/` | Aprendizados desta sprint foram registrados? (Hashimoto) |
| `.harness/VERSION` | Incrementado se é uma versão nova? |

**Comando para verificar:**
```
Leia o diff desta branch e verifique se os docs acima
estão sincronizados com o que foi implementado.
Liste o que está desatualizado antes de continuar.
```

### Deploy
- [ ] Branch atualizada com main/master
- [ ] Build passa localmente
- [ ] Variáveis de ambiente do ambiente alvo configuradas
- [ ] Plano de rollback definido

---

## Formato de Saída

```
## Ship Checklist — [versão/feature]

✅ PASS: [N] itens
❌ FAIL: [N] itens
📄 DOCS: [N] arquivos atualizados

Falhas:
- [item] → [o que corrigir]

Veredicto: PRONTO PARA DEPLOY | BLOQUEADO
```

---

## Anti-Rationalization

❌ "É urgente, vou pular alguns itens" → Urgência não cancela segurança
❌ "É só um hotfix pequeno" → Hotfixes sem checklist geram hotfixes de hotfix
❌ "Os docs posso atualizar depois" → Docs desatualizados viram harness defects
❌ "O README não mudou" → Se a feature não está no README, não foi entregue
