---
section: Memória de Sessão
runtime: antigravity
---

**Ao iniciar:** leia `.harness/memory/last-session.md` se existir.
**Ao encerrar:** "Leia directives/session-memory.md e salve o
contexto atual em .harness/memory/last-session.md"
**Briefing:** "Leia .harness/memory/last-session.md e me dê um
resumo do estado anterior."
**Compressão:** `python execution/compress-history.py --auto` após 8 turnos.

---
section: Roteamento de Modelos
runtime: antigravity
---

Nomes específicos Gemini:
- Tarefas mecânicas → Flash / Flash-Lite
- Código e implementação → Pro (padrão)
- Arquitetura e debugging → Pro (extended thinking) ou Ultra
