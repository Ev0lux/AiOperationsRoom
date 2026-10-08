# AI Operations Room

Uma sala local para acompanhar sessões e subagentes do Claude Code. O aplicativo recebe somente metadados de hooks, mantém os dados em SQLite local e serve a interface em `127.0.0.1`.

## Requisitos

- Python 3.12 ou superior
- Claude Code, somente para acompanhar sessões reais

## Início rápido

```powershell
uv sync --extra dev
uv run python -m backend.cli serve
```

Abra [http://127.0.0.1:8765](http://127.0.0.1:8765). A tela Projetos associa um diretório local a cada nome exibido na sala. O caminho mais específico vence.

## Demonstração

O modo demo cria uma fila e um banco separados em `~/.ai-operations-room-demo`, sem acessar dados reais ou precisar do Claude Code.

```powershell
uv run python -m backend.cli demo --serve
```

Abra `http://127.0.0.1:8765` e interrompa o processo quando terminar. Para apenas gerar os dados fictícios, omita `--serve`. Ao executar `demo` novamente, os eventos e horários fictícios são renovados; sessões da demo não são classificadas como órfãs por falta de PID.

Use `--port 8876` em qualquer comando de servidor quando a porta padrão já estiver ocupada.

## Hooks do Claude Code

O registro altera `~/.claude/settings.json`: adiciona um command hook para `SessionStart`, `UserPromptSubmit`, `Stop`, `SubagentStart`, `SubagentStop` e `SessionEnd`. Antes de alterar o arquivo, revise seu conteúdo.

```powershell
uv run python -m backend.cli hooks-install
uv run python -m backend.cli hooks-remove
```

`hooks-remove` remove somente entradas cujo comando aponta para `hooks/capture.py` deste checkout, mesmo se o executável Python tiver mudado. Ele preserva os demais hooks e configurações.

No Windows, `hooks-install` registra PowerShell explicitamente e também corrige um hook antigo deste checkout que tenha sido criado sem o campo `shell`.

O hook registra identificadores, tipo de agente, diretório de trabalho, razão de encerramento e a hora do evento. Ele não salva prompts, respostas nem transcrições. Para detectar sessões interrompidas sem hook de encerramento, o servidor consulta o identificador da sessão e o PID em `~/.claude/sessions`; não copia o conteúdo desses arquivos para o banco. Os dados ficam por padrão em `~/.ai-operations-room`; defina `AI_OPERATIONS_ROOM_DATA_DIR` para usar outra pasta.

O Painel usa um período selecionável de 6, 12 ou 24 horas. O Escritório mostra execuções ativas e as encerradas nas últimas 12 horas; apenas sessões principais sem subagentes encerradas em menos de 30 segundos são ocultadas da sala.

## Sugestões de agentes

Quer adicionar subagentes aos seus próprios projetos? Veja [SUGESTAO_DE_AGENTES.md](SUGESTAO_DE_AGENTES.md) para dois exemplos adaptáveis: um revisor de código e um pesquisador de contexto.

## Desenvolvimento

```powershell
.venv\Scripts\python.exe -m pytest -q --basetemp=.test-temp
node --check frontend/app.js
node --test tests/js/pixel.test.js
```

Consulte [ARCHITECTURE.md](ARCHITECTURE.md), [DEVELOPMENT.md](DEVELOPMENT.md) e [HANDOFF.md](HANDOFF.md) para decisões e pontos de extensão.

## Limites atuais

- A interface consulta a API a cada quatro segundos.
- Esta versão é destinada somente ao Windows. macOS e Linux não foram validados; no macOS, a detecção de sessões órfãs ainda não funciona. Em 08/10/2026, uma sessão real do Claude Code com subagente Explore foi capturada no Windows, e a API exibiu a filha concluída e o principal trabalhando novamente.
- O suporte de hooks foi validado com o formato documentado do Claude Code. O registro assistido usa o arquivo global de configurações do usuário; configurações gerenciadas pela organização podem impedir hooks locais.
- O serviço é local e não fornece autenticação ou acesso remoto.

## Inspiração visual

A sala pixel foi inspirada pelo [Pixel Agents](https://github.com/pixel-agents-hq/pixel-agents), da equipe Pixel Agents. Os personagens e móveis foram criados para este projeto; nenhum asset do Pixel Agents é usado.

## Licença

Distribuído sob a [licença MIT](LICENSE).
