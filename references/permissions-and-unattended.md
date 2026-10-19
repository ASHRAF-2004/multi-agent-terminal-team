# Permissions and unattended work

Codex sandboxing and approval policy answer different questions:

- The **sandbox** limits what a generated command can access or change.
- The **approval policy** controls when Codex pauses to ask before executing commands.
- Windows **UAC** controls whether a Windows process receives elevated operating-system privileges.

Changing UAC does not configure Codex's approval policy, but a UAC elevation dialog can still interrupt unattended work. If a process requests administrator privileges, Windows can show a Yes/No prompt that waits for a person. Codex's `--ask-for-approval never` setting cannot answer that operating-system dialog. Running all four terminals as Administrator is unnecessary for ordinary project work and expands the consequences of a mistake. Keep UAC at its normal setting and run Codex as the ordinary user; avoid elevation-dependent work in unattended tasks. If initial sandbox setup requires administrator approval, complete that setup while present.

## Sensible defaults

Use project-scoped `workspace-write` for ordinary coding. Pair it with `on-request` when the user wants to approve actions that cross the sandbox boundary. If the user explicitly wants no approval pauses, `never` can be paired with `workspace-write` to keep the filesystem boundary; Codex reports execution failures directly instead of prompting. Review the actual configured mode instead of assuming a command-line flag is the only policy source.

Example:

```powershell
codex --sandbox workspace-write --ask-for-approval never
```

The command is noninteractive for Codex approval prompts but still sandboxed to the workspace. It cannot suppress Windows UAC dialogs or other operating-system prompts. It is not equivalent to full machine access.

## Full access, if explicitly requested

`danger-full-access` removes the normal workspace boundary. Combining it with `--ask-for-approval never` means Codex can run commands without asking first. This mode should only be used in an environment the user is prepared to let commands modify broadly, preferably a disposable VM or a separate low-privilege account with only task-specific files.

```powershell
codex --sandbox danger-full-access --ask-for-approval never
codex resume <SESSION_ID> --sandbox danger-full-access --ask-for-approval never
```

These options do not make the model more reliable, prevent data loss, bypass managed organization policy, suppress Windows UAC dialogs, or guarantee that a task completes while unattended. Do not launch them in an Administrator terminal as a blanket fix. Do not change UAC, Windows Defender, firewall, or global Codex configuration to suppress one project prompt. If a specific operation needs elevated access, isolate that operation and explain its scope instead.

## Unattended checklist

Before leaving a run unattended, make the work easy to recover and verify:

- Specify the exact project and writable worktree.
- Define a bounded task and a verifier that can run without judgment calls.
- Use durable progress/checkpoint notes and preserve logs.
- Set explicit quota stop/checkpoint thresholds; unknown usage is not zero.
- Avoid destructive, account-level, deployment, publishing, purchase, or credential-handling actions without a human at the keyboard.
- Expect interruptions: quota reset, network loss, terminal closure, OS update, failing verification, or ambiguous requirements.

Promise a checkpoint and verifiable report, never “it will definitely be done by morning.”

## Official references

- [Codex CLI commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli)
- [Codex configuration basics](https://learn.chatgpt.com/docs/config-file/config-basic)
- [Windows User Account Control](https://support.microsoft.com/en-us/windows/security/user-account-control-settings)
