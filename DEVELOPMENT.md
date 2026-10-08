# Desenvolvimento

## Ambiente

```powershell
uv sync --extra dev
uv run python -m backend.cli serve --data-dir .test-data
```

Use um diretório temporário para não misturar eventos de desenvolvimento e dados pessoais. Arquivos de dados, bancos e filas são ignorados pelo Git.

## Testes

```powershell
.venv\Scripts\python.exe -m pytest -q --basetemp=.test-temp
node --check frontend/app.js
node --test tests/js/pixel.test.js
```

Os testes cobrem mapeamento de projetos, privacidade do hook, ingestão incremental, idempotência e a projeção de estados.

## Convenções

- Eventos novos devem ter `id`, `evento`, `session_id` e `t`.
- Não acrescente conteúdo de prompts, respostas ou transcrições à fila.
- Preserve a decisão de ignorar linhas JSON incompletas até que estejam completas.
- Faça alterações no esquema em `backend/db.py`; o SQLite inicializa tabelas faltantes ao abrir a API.
