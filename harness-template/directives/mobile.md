---
id: mobile
version: 1.0.0
triggers: ["mobile", "react native", "flutter", "ios", "android", "expo", "nativo", "app mobile", "aplicativo"]
domain: saas
estimated_tokens: 760
compatible_runtimes: [claude-code, antigravity, opencode, cursor]
last_updated: 2026-05-28
---

# Directive: Mobile

## Objetivo
Garantir qualidade, performance e consistência em desenvolvimento
mobile com React Native ou Flutter.

## Regra Fundamental

Mobile não é web com tela menor.
Constraints de bateria, conectividade, memória e gestos
mudam fundamentalmente como o código deve ser escrito.

## React Native — Padrões Essenciais

### Performance
- Nunca coloque funções anônimas inline em props de componentes
  renderizados em listas — cause re-renders desnecessários
- FlatList sempre com keyExtractor, getItemLayout quando possível,
  e windowSize ajustado para a densidade da lista
- Imagens sempre com dimensões fixas — evita layout thrashing
- Animações sempre com useNativeDriver: true quando possível
- Evite setState em efeitos sem cleanup — memory leak garantido

### Navegação
- React Navigation: screens nunca devem importar umas às outras
- Parâmetros de navegação: apenas tipos serializáveis (sem funções)
- Deep linking configurado desde o início — difícil de adicionar depois
- Back handler customizado sempre que interceptar o botão físico

### Platform-specific
- Use Platform.OS para divergências pequenas
- Para divergências grandes → arquivo separado (.ios.tsx / .android.tsx)
- Nunca assuma que um componente se comporta igual em iOS e Android
  sem testar nos dois

### Permissões
- Solicite permissões no momento de uso, nunca no startup
- Trate sempre os três estados: granted, denied, blocked
- Explique ao usuário por que a permissão é necessária antes de pedir

## Flutter — Padrões Essenciais

### Performance
- const constructors em todos os widgets que não mudam
- ListView.builder para listas longas — nunca ListView com children
- RepaintBoundary em widgets com animações complexas
- Avoid rebuilding the entire tree — use ValueListenableBuilder
  ou Consumer para reconstruir só o que mudou

### Estado
- Para estado local simples → StatefulWidget ou ValueNotifier
- Para estado compartilhado → Provider, Riverpod ou Bloc
- Nunca use setState em dispose() — já foi desmontado
- initState não é async — use Future.delayed ou addPostFrameCallback

### Widgets
- Prefira composição sobre herança
- Widgets com mais de 100 linhas → candidato a extração
- Keys explícitas em listas dinâmicas

## Checklist Universal Mobile

### Antes de considerar uma feature completa
- [ ] Testado em dispositivo físico (não só simulador)
- [ ] Testado com conectividade ruim (modo avião + reconecta)
- [ ] Testado com tela pequena (SE / budget Android)
- [ ] Testado com fonte grande (acessibilidade)
- [ ] Loading states para toda operação async
- [ ] Error states para toda operação que pode falhar
- [ ] Empty states para listas que podem estar vazias
- [ ] Teclado não esconde o input focado

### Performance
- [ ] Scroll de listas suave (sem jank)
- [ ] Sem re-renders desnecessários (React Native Profiler / Flutter DevTools)
- [ ] Imagens otimizadas e com cache

## Regras do Agente

- Nunca sugira uma biblioteca sem verificar se mantém suporte ativo
- Sempre pergunte: iOS, Android, ou ambos?
- Expo managed ou bare workflow muda as opções disponíveis
- Teste em dispositivo físico não é opcional para features críticas

## Output Esperado

PLATAFORMA: React Native | Flutter | ambos
FRAMEWORK: Expo Managed | Expo Bare | CLI puro | Flutter SDK
CHECKLIST: [itens verificados]
RISCOS: [comportamentos que diferem entre plataformas]

## Aprendizados
<!-- Atualize quando encontrar padrões mobile recorrentes -->
- [data] [padrão identificado e solução aplicada]
