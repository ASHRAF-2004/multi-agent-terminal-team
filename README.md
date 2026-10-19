# Codex multi-terminal team

Use this skill when you want four Codex CLI sessions to work on one project with clear roles and a way to exchange real messages.

The four roles are:

1. **Coordinator** - plans work, assigns tasks, integrates changes, and reports progress.
2. **Builder** - implements a clearly scoped change in its own Git worktree.
3. **Tester** - checks the change against agreed acceptance criteria.
4. **Reviewer** - reviews the integrated changes for problems and missed requirements.

A fork starts another session with the same conversation history. It does not connect the terminals. The sessions need a working message broker to exchange assignments and results. Use separate Git worktrees for parallel code changes.

## Start four Codex terminals on Windows

Open four PowerShell or Windows Terminal tabs. Use your normal Windows account; Administrator access is not needed for ordinary project work.

In each tab, go to the project folder:

```powershell
Set-Location 'C:\path\to\your\project'
```

In Terminal 1, start a session:

```powershell
codex
```

In Terminals 2, 3, and 4, run `codex fork` and select Terminal 1's session. You can also provide its session ID directly:

```powershell
codex fork <SESSION_ID>
```

If you are starting new conversations, run `codex` in each terminal instead. To continue a session later, use:

```powershell
codex resume <SESSION_ID>
```

Assign the four roles listed above. Before delegating code changes, have the coordinator check that a broker is configured and demonstrate a message exchange with an acknowledgment from another session. If no broker exists, the terminals cannot message each other yet; ask Codex to set up and verify a project-scoped bridge first.

Keep each terminal open while its session is working. A fork does not keep the sessions synchronized. The broker carries messages; Git carries code changes.

## Choose Codex permissions

Windows User Account Control (UAC) controls Windows administrator elevation. It does not control Codex approval prompts. Changing UAC settings is not needed to let Codex work without prompts. Keep UAC at its normal setting and do not run all terminals as Administrator.

For project-scoped work, this command disables approval prompts while keeping Codex's sandbox limited to the current workspace:

```powershell
codex --sandbox workspace-write --ask-for-approval never
```

Use this only when you are comfortable with Codex running workspace commands without asking first.

For an existing session, this command disables prompts and removes the normal workspace boundary:

```powershell
codex resume <SESSION_ID> --sandbox danger-full-access --ask-for-approval never
```

For a new session, omit `resume <SESSION_ID>`:

```powershell
codex --sandbox danger-full-access --ask-for-approval never
```

With `danger-full-access`, commands may affect files and network resources outside the project. No-prompt settings do not guarantee that a task will finish while you are away; quota limits, failed commands, network loss, or unclear requirements can stop it. For unattended work, set a bounded task, save checkpoints, and define a verifier. Use full access only in an environment where broad changes are acceptable.

## Install the skill

This repository is public. Clone it, then copy its contents into your Codex skills folder:

```powershell
git clone https://github.com/ASHRAF-2004/codex-multi-terminal-team.git "$env:TEMP\codex-multi-terminal-team"
$skillsRoot = if ($env:CODEX_HOME) { Join-Path $env:CODEX_HOME 'skills' } else { Join-Path $env:USERPROFILE '.codex\skills' }
$skillPath = Join-Path $skillsRoot 'codex-multi-terminal-team'
New-Item -ItemType Directory -Force $skillPath | Out-Null
Copy-Item "$env:TEMP\codex-multi-terminal-team\*" $skillPath -Recurse -Force
```

Restart Codex terminals so they can discover the skill. To update it, pull the latest repository changes and copy the updated files into the skill folder.

## Files

- `SKILL.md` contains the workflow Codex follows when coordinating the team.
- `references/team-operations.md` explains task assignment, broker messages, worktrees, integration, and quota-aware pauses.
- `references/permissions-and-unattended.md` describes sandbox and approval settings, UAC, and unattended work.
- `agents/openai.yaml` provides the skill's Codex display information.

The skill contains instructions, not a universal broker program. Each project needs its own configured and verified messaging bridge.

## Codex documentation

- [CLI commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli) - fork and resume sessions.
- [Configuration basics](https://learn.chatgpt.com/docs/config-file/config-basic) - sandbox and approval settings.
