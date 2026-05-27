---
section: Memória de Sessão
runtime: opencode
---

**Ao iniciar:** leia `.harness/memory/last-session.json` se existir.
**Ao encerrar:** salve o contexto em `.harness/memory/last-session.json`
seguindo o schema em `docs/session-schema.md`.
**Compressão:** `python execution/compress-history.py --auto` após 8 turnos.

---
section: Arquivo de Runtime
runtime: opencode
---

OpenCode lê AGENTS.md diretamente.
Não é necessário gerar um arquivo separado.
Para forçar overrides: crie `.opencode/instructions.md` apontando para AGENTS.md.

---
section: Roteamento de Modelos
runtime: opencode
---

Nomes específicos OpenCode (adapte ao modelo configurado):
- Tarefas mecânicas → modelo mais rápido disponível
- Código e implementação → modelo padrão configurado
- Arquitetura e debugging → modelo mais capaz disponível
