# Four terminals, one team, no telepathy

This skill helps Codex coordinate four real terminal sessions without pretending they share a brain just because they share a folder.

The short version: one terminal steers, one builds, one tests, one reviews. A fork can give the other three the same opening context. A small message broker gives the independent sessions an actual way to talk. Git worktrees keep their edits from landing on each other's toes.

## Windows quick start

1. Open four normal PowerShell or Windows Terminal tabs. **Do not run them as Administrator by default.** Admin rights increase the damage a bad command can do and do not turn Codex approval prompts off.
2. In every tab, change to the same project checkout:

   ```powershell
   Set-Location 'C:\path\to\your\project'
   ```

3. In Terminal 1, start the coordinator's conversation:

   ```powershell
   codex
   ```

4. In Terminals 2, 3, and 4, run `codex fork` and choose that conversation in the session picker. Or pass its session ID with `codex fork <SESSION_ID>`. This makes separate chats with the same starting history. **Forking is useful, not mandatory, and it does not create terminal-to-terminal messaging.** If you are starting fresh, just run `codex` in each tab. To continue an existing session, use `codex resume` or `codex resume <SESSION_ID>`.
5. Give the terminals distinct jobs: **1 coordinator, 2 builder, 3 tester, 4 reviewer**. Before parallel edits, have the coordinator assign separate Git worktrees and prove one real message/acknowledgment round trip through the project's broker. If there is no broker, the sessions are still separate; ask Codex to set up and verify a project-scoped bridge first.
6. Keep each terminal open while its session is working. Forks are independent sessions, not clones that automatically stay in sync. The broker carries instructions and results; Git carries code changes.

### Resume without the picker

```powershell
codex resume <SESSION_ID>
```

For a new conversation, the resume step is unnecessary: run `codex`. For shared starting context, use `codex fork`; for continuing the same conversation, use `codex resume`.

## The no-prompt question (and the UAC myth)

Windows UAC controls Windows elevation. Codex's approval policy and sandbox are separate settings. Changing UAC does not grant Codex automatic approval. You usually should not elevate these terminals.

The everyday no-surprise setup is to keep Codex inside the project with `workspace-write`; choose approvals in `/permissions` or through your trusted project config. The command below disables prompts **but keeps the sandbox limited to the workspace**:

```powershell
codex --sandbox workspace-write --ask-for-approval never
```

This asks for no approvals, so Codex will not stop for confirmation when a command fails; the sandbox still limits where commands can write. Use it only when that tradeoff fits the task.

The command you mentioned is valid in the current CLI, but it combines two separate high-impact choices: `danger-full-access` removes the workspace boundary, and `never` disables approval prompts:

```powershell
codex resume <SESSION_ID> --sandbox danger-full-access --ask-for-approval never
```

Starting a new session instead:

```powershell
codex --sandbox danger-full-access --ask-for-approval never
```

That can let commands affect files and network resources beyond the project without asking first. It is **not** a “go to sleep, wake up to guaranteed finished work” switch. Quota limits, failing builds, ambiguous requirements, or a system restart can still stop a run. Never combine it with Administrator elevation as a blanket setup. If you deliberately need that mode, use a disposable VM or a separate low-privilege account, give a bounded task and verifier, and keep a recovery checkpoint.

## Install this skill

This repository is private. The owner must grant each user access before they can clone or install it. After access is granted, clone the repo and copy `codex-multi-terminal-team` into the user's Codex skills folder:

After the owner grants you access, clone the private repository and copy its contents into your skills folder:

```powershell
git clone https://github.com/ASHRAF-2004/codex-multi-terminal-team.git "$env:TEMP\codex-multi-terminal-team"
$skillsRoot = if ($env:CODEX_HOME) { Join-Path $env:CODEX_HOME 'skills' } else { Join-Path $env:USERPROFILE '.codex\skills' }
$skillPath = Join-Path $skillsRoot 'codex-multi-terminal-team'
New-Item -ItemType Directory -Force $skillPath | Out-Null
Copy-Item "$env:TEMP\codex-multi-terminal-team\*" $skillPath -Recurse -Force
```

Restart Codex terminals after installing so they discover the skill. To update, pull in the cloned repo and copy the reviewed changes into the skill folder. Treat skill instructions as executable guidance: review updates before trusting them.

## What's in the box

- `SKILL.md`: when and how Codex should coordinate the team.
- `references/team-operations.md`: broker, worktree, delivery, and verification invariants.
- `references/permissions-and-unattended.md`: plain-language permission modes and unattended-run limits.
- `agents/openai.yaml`: Codex skill-card metadata.

This repository packages the reusable instructions. A broker, role threads, and worktrees belong to each project and must be configured and verified there; the skill will not invent them or silently rewrite global Codex settings.

## Official Codex references

- [Codex CLI commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli) — fork and resume behavior.
- [Codex configuration basics](https://learn.chatgpt.com/docs/config-file/config-basic) — project config, sandbox, and approval policy.
