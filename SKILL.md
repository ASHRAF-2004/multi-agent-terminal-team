---
name: codex-multi-terminal-team
description: Set up or coordinate four independent Codex CLI terminals for one software project, with real brokered messages, isolated Git worktrees, verification, and quota-aware pauses. Use when the user asks for multi-terminal Codex teamwork; not for ordinary single-terminal work.
metadata:
  short-description: Coordinate four real Codex terminals
---

# Codex Multi-Terminal Team

Help the user run four independently visible Codex CLI threads as one accountable team. Terminals do not communicate merely because they share a conversation, model, folder, or machine. A fork shares starting context; a real broker is needed to carry messages.

## Operating workflow

1. Inspect the project, existing Codex threads, model/effort choices, Git state, quota limits, and any existing broker before changing setup. Reuse working pieces. Never assume a terminal is connected because it appears in a list.
2. Assign one coordinator and clear roles for builder, tester, and reviewer. Keep roles and model choices configurable; do not silently change a user's selected model or global Codex settings.
3. Prove a real message round trip between two existing native threads, with sender/recipient thread IDs and an explicit acknowledgment, before assigning implementation work. If there is no broker, explain the gap and propose a small project-scoped bridge based on the supported local Codex App Server/CLI interface. Do not fake dialogue or equate an MCP tool listing or queue acceptance with a model acknowledgment.
4. Give each writer its own Git worktree. Check uncommitted files before making worktrees because Git worktrees do not copy uncommitted changes. Keep one active writer by default; let the coordinator integrate, then request independent review and verification.
5. Define acceptance checks before dispatch. Require actual evidence and a runnable verifier for each task. On failure, preserve the failure, diagnose it, and use one bounded retry/escalation rather than looping.
6. Track the official account quota when available. Honor user thresholds and pause budgets; if asked to reserve the last 10%, checkpoint at 90% used and hard-pause at the agreed limit. Unknown quota is unknown, never zero. Never claim token savings without measured before/after usage and comparable successful tasks.
7. On completion, report the live thread/worktree status, what was verified, what remains, and exact resume commands. Keep checkpoints concise enough to leave the requested quota for a clean handoff.

## Windows and permissions

For the Windows four-terminal quick start and private-repo installation steps, read [README.md](README.md). Read [references/permissions-and-unattended.md](references/permissions-and-unattended.md) before recommending unattended or no-prompt execution. Administrator elevation and UAC changes are not a substitute for Codex sandbox or approval settings; never lower UAC as a convenience step.

Prefer project-scoped `workspace-write` with the user's chosen approval policy. Full disk/network access with no approval prompts is a separate, high-impact choice. Only provide or apply that mode when the user explicitly requests it, explain its scope, and recommend a disposable or otherwise isolated environment. Do not promise that an unattended run will finish while the user is away.

## References

- Windows setup, fork/resume, roles, and install instructions: [README.md](README.md)
- Bridge invariants, messages, worktrees, and restart/rollback: [references/team-operations.md](references/team-operations.md)
- Sandbox, approval, UAC, and unattended-run boundaries: [references/permissions-and-unattended.md](references/permissions-and-unattended.md)
