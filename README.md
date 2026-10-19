# Multi-agent terminal team

Coordinate separate coding-agent sessions on one project. Use one coordinator, give each writer a separate Git worktree, and connect the sessions through a message bridge that every participant can use.

This workflow works across Windows, macOS, and Linux, and can include different AI providers. It does not assume their conversations are shared or that their command-line options match. Each agent needs access to the project and a supported bridge adapter such as MCP, a bridge CLI, or an HTTP client.

## Start the team

1. Open one terminal per agent session and change each terminal to the project repository root.

   PowerShell:

   ```powershell
   Set-Location 'C:\path\to\project'
   ```

   Bash, zsh, and other POSIX shells:

   ```sh
   cd /path/to/project
   ```

2. Start each agent with its normal command or IDE. Forking or resuming can reuse that product's conversation history, but it is optional and does not connect sessions.
3. Assign roles: coordinator, builder, tester, and reviewer. For smaller tasks, combine roles or use fewer sessions.
4. Have the coordinator check Git status and identify a shared bridge or configure a project-scoped one. Confirm every agent has an adapter it can call.
5. Before assigning implementation, prove a message round trip: one agent sends a message, another retrieves and acknowledges it, then replies. The coordinator must be able to retrieve that reply.
6. Give each concurrent writer a separate worktree and a bounded task with acceptance criteria and a verifier.

Before setup, run the read-only preflight from the skill directory (requires Node.js and Git), passing your project path:

PowerShell:

```powershell
node .\scripts\team-doctor.mjs 'C:\path\to\project'
```

macOS or Linux:

```sh
node ./scripts/team-doctor.mjs /path/to/project
```

It reports the project path, Git status, registered worktrees, common agent CLIs on `PATH`, and whether `.multi-agent-team/` is ignored. It always marks the bridge **not verified** because only an actual message round trip can prove communication. Set `TEAM_AGENT_COMMANDS` to a comma-separated list of CLI names to check instead of the defaults.

Read [platform and agent setup](references/platforms-and-agents.md) for shell examples and adapter requirements. Read [team operations](references/team-operations.md) for the bridge contract, worktree ownership, integration, and quota handling.

## Permissions and unattended runs

Approval flags and sandbox settings differ by agent. Operating-system elevation prompts are separate: a Windows UAC dialog, macOS authorization prompt, or Linux `sudo` request may wait for a person even when the agent is configured not to ask for approval. For unattended work, avoid elevation-dependent tasks, use a bounded objective, save checkpoints, and define a verifier.

Codex-specific permission examples and Windows UAC details are in [permissions and unattended work](references/permissions-and-unattended.md). Do not apply Codex flags to other agents.

## Install

This repository contains a Codex skill package. To install it for Codex, clone the public repository and copy its contents into the Codex skills directory.

PowerShell:

```powershell
git clone https://github.com/ASHRAF-2004/multi-agent-terminal-team.git "$env:TEMP\multi-agent-terminal-team"
$skillsRoot = if ($env:CODEX_HOME) { Join-Path $env:CODEX_HOME 'skills' } else { Join-Path $env:USERPROFILE '.codex\skills' }
$skillPath = Join-Path $skillsRoot 'multi-agent-terminal-team'
New-Item -ItemType Directory -Force $skillPath | Out-Null
Copy-Item "$env:TEMP\multi-agent-terminal-team\*" $skillPath -Recurse -Force
```

macOS or Linux:

```sh
git clone https://github.com/ASHRAF-2004/multi-agent-terminal-team.git "${TMPDIR:-/tmp}/multi-agent-terminal-team"
skills_root="${CODEX_HOME:-$HOME/.codex}/skills"
mkdir -p "$skills_root/multi-agent-terminal-team"
cp -R "${TMPDIR:-/tmp}/multi-agent-terminal-team/." "$skills_root/multi-agent-terminal-team/"
```

Restart Codex after installation. Other agent products may support their own skills or project-instruction formats; install or reference `SKILL.md` and the relevant files under `references/` according to that product's documentation. `agents/openai.yaml` is Codex-specific metadata and is not required by other tools.

## Repository contents

- `SKILL.md` is the shared coordination workflow.
- `references/platforms-and-agents.md` describes cross-platform setup and integration options.
- `references/team-operations.md` defines reliable messaging, task ownership, Git worktrees, integration, and quota checkpoints.
- `references/permissions-and-unattended.md` covers permissions and unattended runs, with Codex-specific details clearly marked.
- `scripts/team-doctor.mjs` performs a read-only, cross-platform project preflight.
- `agents/openai.yaml` provides Codex interface metadata.

This repository provides instructions, not a preconfigured universal broker. Each project must connect its agents through a bridge they can all use.

## Official Codex references

- [Codex CLI commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli)
- [Codex approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security)
- [Codex Windows sandbox](https://learn.chatgpt.com/docs/windows/windows-sandbox)
