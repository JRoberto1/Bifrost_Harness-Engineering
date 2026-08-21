# SKILL: LGPD — Conformidade para Projetos Brasileiros
<!-- Bifrost Community Skill v1.0.0 -->

## Quando Usar
Qualquer projeto que colete, processe ou armazene dados pessoais de cidadãos brasileiros.

## Regras Absolutas (LGPD Art. 6-10)

### Coleta
- Nunca colete dados sem base legal documentada (Art. 7)
- Bases legais válidas: consentimento, contrato, obrigação legal, legítimo interesse
- Dados sensíveis (saúde, biometria, origem racial): base legal mais restrita obrigatória

### Armazenamento
- Retenção mínima: defina período e delete automaticamente ao fim
- Pseudonimização para dados que não precisam de identificação direta
- Logs de acesso a dados pessoais: quem acessou, quando, por quê

### Direitos do Titular (Art. 18)
Todo sistema deve implementar:
- [ ] Acesso: usuário pode ver seus dados
- [ ] Correção: usuário pode corrigir dados incorretos
- [ ] Exclusão: usuário pode deletar conta e dados
- [ ] Portabilidade: usuário pode exportar seus dados
- [ ] Revogação de consentimento

### Incidentes (Art. 48)
- Notificar ANPD em até 72h após conhecimento de vazamento
- Notificar titulares afetados quando há risco relevante
- Manter registro de incidentes

## Quality Gates Adicionais
- [ ] DPO (Encarregado) definido no sistema
- [ ] Política de privacidade acessível no frontend
- [ ] Consentimento granular (não bundled)
- [ ] Exclusão cascata implementada
- [ ] Logs de acesso a dados pessoais ativos
- [ ] Teste de exclusão de conta no QA

## Anti-Rationalization
❌ "Usuários não vão pedir exclusão" → É direito garantido por lei, não é opcional
❌ "Consentimento genérico resolve" → ANPD exige consentimento específico por finalidade
❌ "Só vou implementar depois do MVP" → Reengenharia de privacidade é cara — faça desde o início

## Aprendizados
- [data] [aprendizado sobre conformidade LGPD]
