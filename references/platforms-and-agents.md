# Platforms and agent integrations

## Start sessions from one project

Open the number of terminals your task needs and change each terminal to the same repository root. Use the command for your shell:

**PowerShell**

```powershell
Set-Location 'C:\path\to\project'
```

**Bash, zsh, or another POSIX shell**

```sh
cd /path/to/project
```

Start each AI agent with its normal CLI or IDE workflow. A shared conversation or fork is optional context reuse; it is never the communication channel. For example, Codex supports `codex`, `codex fork`, and `codex resume`; use another provider's own documented start/fork/resume commands for that provider. Do not send Codex flags to other agents.

## Agent compatibility

An agent can participate when it can:

1. access the project checkout and its assigned worktree;
2. read and send messages through a bridge adapter; and
3. report the result or acknowledgment in a form the coordinator can verify.

Connect agents through one transport they can all use. Options include:

- a shared MCP server, if each client supports a compatible MCP integration;
- a project-scoped bridge CLI available to the agent's shell;
- a local or hosted HTTP API with per-participant authentication.

There is no universal agent API or built-in cross-provider conversation. If two agents cannot use the same transport, build a small adapter at the boundary or use explicit human handoffs. A message appearing in a shared file or queue is not proof the agent read it; require an explicit acknowledgment and reply.

Keep the transport contract in [team-operations.md](team-operations.md). Put provider-specific authentication and session discovery in separate adapters, not in the shared protocol. Do not store credentials or live session identifiers in Git.

## Platform notes

Git worktrees and the coordination protocol are not tied to one shell. Use the host's native Git and shell tooling, and keep generated state under an ignored project-local directory. Check case-sensitive paths, executable permissions, process cleanup, and shell quoting when adapting scripts between Windows, macOS, and Linux.

## Codex adapter example

These commands are for Codex CLI only:

```sh
codex
codex fork <SESSION_ID>
codex resume <SESSION_ID>
```

`fork` provides a separate session with shared starting history; the broker remains necessary for messages. Codex's sandbox and approval options are described separately in [permissions-and-unattended.md](permissions-and-unattended.md).
