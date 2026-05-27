# Hashimoto Log

Registro de erros que melhoraram o harness.
Formato: `| data | tipo | descrição | arquivo corrigido |`

| Data | Tipo | Descrição | Arquivo Corrigido |
|------|------|-----------|-------------------|
| 2026-05-27 | C | FOOTER com `\n` faltando causou falha no --check do CI | scripts/build-harness.py |
| 2026-05-27 | D | set() escondia diff de ordem — difflib adicionado | scripts/build-harness.py |
| 2026-05-27 | B | Sort case-sensitive causava ordem diferente Windows/Linux | scripts/build-harness.py |
