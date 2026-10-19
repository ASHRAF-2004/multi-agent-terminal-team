# Permissions and unattended work

Agent approval settings and operating-system permissions are separate controls. A no-approval option only affects the prompts owned by that agent product; it does not automatically answer OS authorization dialogs or consent prompts from other tools.

Examples of operating-system elevation include Windows User Account Control (UAC), macOS authorization dialogs, and Linux commands that invoke `sudo`. If a task may trigger one, an unattended session can pause until a person responds. Avoid elevation-dependent work in unattended assignments. Complete any necessary machine setup while present, and do not weaken system-wide protections just to hide a prompt.

## General unattended checklist

- Name the exact project and writable worktree.
- Define a bounded task with acceptance criteria and a verifier that does not need subjective judgment.
- Use the agent's least-permissive mode that still supports the task; inspect its effective settings rather than assuming a launch flag took effect.
- Save checkpoints and logs in ignored project-local storage.
- Set a quota checkpoint and stop threshold for each provider; unknown usage is not zero.
- Do not leave destructive, account-level, deployment, publishing, purchase, or credential-handling actions unattended without explicit authorization and an appropriate recovery plan.
- Expect network loss, terminal closure, operating-system updates, failed checks, expired quotas, and unclear requirements to interrupt the work.

Promise recoverable progress and a verifiable report, not guaranteed completion by a deadline.

## Codex CLI example

Codex separates its sandbox from its approval policy. In supported CLI versions, this command disables Codex approval prompts while retaining the workspace-write boundary:

```sh
codex --sandbox workspace-write --ask-for-approval never
```

Codex's `danger-full-access` removes its normal workspace boundary. Combining it with `--ask-for-approval never` allows broad command execution without Codex approval prompts; it still cannot answer Windows UAC, macOS authorization, or other OS prompts.

```sh
codex --sandbox danger-full-access --ask-for-approval never
codex resume <SESSION_ID> --sandbox danger-full-access --ask-for-approval never
```

Use full access only when the environment is prepared for broad changes, preferably a disposable VM or a low-privilege account scoped to task files. These options do not guarantee success or bypass managed organization policy. Check the current Codex documentation and CLI version before relying on specific flags.

## Windows UAC

UAC can show a Yes/No consent prompt when an action needs administrator privileges. That prompt is not a Codex approval prompt. Do not disable UAC or launch all terminals as Administrator just to make an unattended workflow appear noninteractive. Avoid commands that request elevation or complete a specific, reviewed setup step while a person is present.

## References

- [Codex approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security)
- [Codex Windows sandbox](https://learn.chatgpt.com/docs/windows/windows-sandbox)
- [Windows User Account Control](https://support.microsoft.com/en-us/windows/security/user-account-control-settings)
