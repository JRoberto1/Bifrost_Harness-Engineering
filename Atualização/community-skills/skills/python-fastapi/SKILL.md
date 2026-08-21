# SKILL: Python FastAPI + Pydantic v2
<!-- Bifrost Community Skill v1.0.0 -->

## Quando Usar
APIs Python com FastAPI 0.100+, Pydantic v2 e async/await.

## Regras Específicas

### Estrutura
```
app/
├── main.py          ← app FastAPI · sem lógica de negócio
├── routers/         ← endpoints por domínio
├── services/        ← lógica de negócio
├── models/          ← Pydantic schemas
├── repositories/    ← acesso a dados
└── core/            ← config, deps, security
```

### Tipagem
- Todos os endpoints têm response_model explícito
- Pydantic v2: `model_config = ConfigDict(...)` em vez de `class Config`
- Nunca `dict` como tipo de retorno — sempre schema Pydantic

### Async
- Endpoints I/O-bound: sempre `async def`
- Nunca `time.sleep` — use `asyncio.sleep`
- DB: sempre driver async (asyncpg, motor, aiosqlite)

### Segurança
- Auth: OAuth2 com `python-jose` ou `python-jwt`
- Inputs: validação Pydantic em todos os endpoints
- SQL: sempre SQLAlchemy ORM ou queries parametrizadas

### Erros
- HTTPException com status code correto
- Handler global para erros não tratados
- Logs estruturados com `structlog`

## Quality Gates Adicionais
- [ ] Todos endpoints têm `response_model`
- [ ] Nenhum endpoint síncrono para operações I/O
- [ ] Schemas Pydantic validam todos os inputs
- [ ] Testes com `httpx.AsyncClient`

## Anti-Rationalization
❌ "Vou retornar `dict` por simplicidade" → Pydantic garante contrato da API
❌ "É só um endpoint, não precisa de router" → estrutura importa desde o início
❌ "Testes são lentos com async" → `pytest-asyncio` resolve isso

## Aprendizados
- [data] [aprendizado específico do FastAPI]
