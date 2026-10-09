# AI Operations Room

**Sala de operações da [Evolux](https://github.com/ev0lux)** para acompanhar sessões e subagentes de coding agents (Claude Code, Cursor e compatíveis com os mesmos hooks de metadados). O aplicativo recebe somente metadados de hooks, mantém os dados em SQLite local e serve a interface em `127.0.0.1`.

Na Evolux usamos esta sala para ter visibilidade do que cada agente está fazendo por projeto — estados, subagentes e carga — sem expor prompts, respostas ou código das sessões.

## Requisitos

- Python 3.12 ou superior
- [`uv` instalado](https://docs.astral.sh/uv/getting-started/installation/) e disponível no terminal
- Claude Code ou Cursor com hooks configurados, para acompanhar sessões reais (opcional no modo demonstração)

## Início rápido

No ambiente Python que você usa (conda, venv, …), na pasta do repositório:

```bash
uv sync --extra dev
uv run python -m backend.cli hooks-install
uv run python -m backend.cli serve
```

Abra [http://127.0.0.1:8765](http://127.0.0.1:8765) e **deixe o terminal do servidor aberto** enquanto usa a sala; `Ctrl+C` encerra o servidor. O hook continua instalado depois que o servidor para e registra eventos para a próxima abertura.

A tela **Projetos** associa um diretório local a cada nome exibido no Escritório. O caminho mais específico vence. Uma sala aparece quando há uma sessão capturada nesse diretório; cadastrar um projeto sozinho não cria uma sala vazia.

Mantenha a pasta do repositório no mesmo lugar após instalar os hooks: o comando registrado aponta para o caminho local deste checkout. Se precisar movê-la, execute `hooks-remove` antes da mudança e `hooks-install` na nova localização.

### Windows — abrir automaticamente ao entrar

Depois de `uv sync --extra dev` e `hooks-install` uma vez:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-room.ps1
```

O script usa a porta 8765, espera a API responder e abre a sala. Para outra porta: `-Port 8898`. Para iniciar no login, crie um atalho em `shell:startup` apontando para esse script (caminho absoluto do repositório). A demonstração usa `demo --serve`, não este script.

## Demonstração

Modo demo com fila e banco separados em `~/.ai-operations-room-demo`, sem dados reais nem hooks:

```bash
uv run python -m backend.cli demo --serve
```

Projetos da demo não aparecem no servidor real, e vice-versa. Use `--port 8876` se a 8765 estiver ocupada.

## Docker

Requisitos: Docker Engine e Docker Compose v2.

**Demonstração** (dados fictícios no container):

```bash
docker compose --profile demo up --build room-demo
```

**Sala com dados do host** (mesma pasta que os hooks gravam, em geral `~/.ai-operations-room`):

```bash
docker compose up --build room
```

Variáveis úteis:

```bash
ROOM_DATA_DIR=/caminho/para/dados ROOM_PORT=8765 docker compose up room
```

Os hooks continuam no **host** (`hooks-install`); o container serve API e interface lendo o volume montado.

```bash
docker build -t ai-operations-room .
docker run --rm -p 8765:8765 -v "${HOME}/.ai-operations-room:/data" ai-operations-room
```

## Hooks

O registro altera `~/.claude/settings.json` (Claude Code / Cursor): command hooks para `SessionStart`, `UserPromptSubmit`, `Stop`, `SubagentStart`, `SubagentStop` e `SessionEnd`. Revise o arquivo antes de instalar.

```bash
uv run python -m backend.cli hooks-install
uv run python -m backend.cli hooks-remove
```

`hooks-remove` remove somente entradas deste checkout (`hooks/capture.py`). No Windows, `hooks-install` define `shell` para PowerShell quando necessário.

O hook grava identificadores, tipo de agente, diretório de trabalho, razão de encerramento e hora — **nunca** prompts nem transcrições. Nomes de evento em PascalCase e camelCase (ex.: `SessionStart` / `sessionStart`) são normalizados.

Dados por padrão em `~/.ai-operations-room`; use `AI_OPERATIONS_ROOM_DATA_DIR` para outro diretório. Servidor em outro host/porta: `AI_OPERATIONS_ROOM_HOST` ou `serve --host`.

O **Painel** usa janelas de 6, 12 ou 24 horas. O **Escritório** (pixel art) mostra execuções ativas e encerradas nas últimas 12 horas; losangos indicam carga e tipo de atividade, bordas da placa indicam estado do fluxo.

## Sugestões de agentes

Modelos de subagentes usados em projetos Evolux: [SUGESTAO_DE_AGENTES.md](SUGESTAO_DE_AGENTES.md) (revisor e pesquisador de contexto).

## Desenvolvimento

```bash
uv sync --extra dev
python -m pytest -q --basetemp=.test-temp
node --check frontend/app.js
node --test tests/js/pixel.test.js
node --test tests/js/nomes-agentes.test.js
node --test tests/js/marcadores-agente.test.js
```

Consulte [ARCHITECTURE.md](ARCHITECTURE.md), [DEVELOPMENT.md](DEVELOPMENT.md) e [HANDOFF.md](HANDOFF.md).

## Limites atuais

- A interface consulta a API a cada quatro segundos.
- Detecção de sessões órfãs via PID depende de `~/.claude/sessions` (comportamento validado principalmente no Windows; no Linux o restante da sala funciona).
- Hooks locais podem ser bloqueados por política corporativa no arquivo de configurações gerenciado.
- Serviço local, sem autenticação nem exposição remota por padrão.

## Inspiração visual

O Escritório pixel foi inspirado pelo [Pixel Agents](https://github.com/pixel-agents-hq/pixel-agents). Arte original deste repositório; nenhum asset de terceiros é reutilizado.

## Licença

[MIT](LICENSE) — Evolux / contribuidores.
