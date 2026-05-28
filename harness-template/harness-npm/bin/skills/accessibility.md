---
id: accessibility
version: 1.0.0
bundle: saas
description: Checklist de acessibilidade web baseado em WCAG 2.1
source: Bifrost original
---

# Skill: Accessibility

## Quando usar
Auditoria de acessibilidade, desenvolvimento de novos componentes,
revisão de PRs com mudanças de UI.

## Nível mínimo: WCAG 2.1 AA

### 1. Percepção
- [ ] Imagens têm alt text descritivo (decorativas: alt="")
- [ ] Vídeos têm legendas
- [ ] Contraste mínimo: 4.5:1 para texto normal, 3:1 para texto grande
- [ ] Conteúdo não depende só de cor para transmitir informação
- [ ] Texto pode ser ampliado até 200% sem perda de funcionalidade

### 2. Operabilidade
- [ ] Toda funcionalidade acessível por teclado
- [ ] Foco visível em todos os elementos interativos
- [ ] Sem armadilhas de teclado (usuário consegue sair de qualquer elemento)
- [ ] Skip links para conteúdo principal
- [ ] Animações respeitam prefers-reduced-motion

### 3. Compreensão
- [ ] Labels em todos os campos de formulário
- [ ] Mensagens de erro descritivas (não só "erro")
- [ ] Idioma da página declarado no <html lang="">
- [ ] Navegação consistente entre páginas

### 4. Robustez
- [ ] HTML válido e semântico
- [ ] ARIA usado corretamente (não em excesso)
- [ ] Componentes customizados têm roles ARIA corretos

## Ferramentas

```bash
# axe-core (automático)
npx axe https://example.com

# Lighthouse
npx lighthouse https://example.com --only-categories=accessibility
```

Teste manual obrigatório:
- Navegar só com teclado (Tab, Shift+Tab, Enter, Space, Arrow)
- Testar com leitor de tela (NVDA/Windows, VoiceOver/Mac)

## Output Esperado
SCORE: [0-100 Lighthouse]
CRÍTICOS: [violações que bloqueiam usuários]
MELHORIAS: [itens A e AA pendentes]
TESTADO COM: [ferramentas e métodos usados]
