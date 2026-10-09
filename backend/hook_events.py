"""Canonical hook event names (Claude Code PascalCase vs Cursor camelCase)."""

from __future__ import annotations

_ALIASES = {
    "sessionStart": "SessionStart",
    "userPromptSubmit": "UserPromptSubmit",
    "subagentStart": "SubagentStart",
    "subagentStop": "SubagentStop",
    "sessionEnd": "SessionEnd",
    "stop": "Stop",
}


def canonical_event_name(name: str) -> str:
    return _ALIASES.get(name, name)
