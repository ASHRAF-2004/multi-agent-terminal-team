---
name: multi-agent-terminal-team
description: Coordinate coding agents running in separate terminals across AI providers and operating systems, using a verified message bridge, isolated Git worktrees, clear task ownership, and evidence-based completion. Use when setting up or running a multi-agent coding team.
metadata:
  short-description: Coordinate independent coding agents
---

# Multi-Agent Terminal Team

Coordinate independent coding-agent sessions as one team. The sessions may use different AI providers, models, shells, or operating systems. They do not communicate just because they share a repository, conversation history, or machine.

## Workflow

1. Inspect the project, Git state, available agent tools, current sessions, message bridge, and quota information before changing setup. Preserve user changes and chosen model or effort settings.
2. Decide whether more than one agent is worth the setup and review cost. Choose a single-agent, sequential, independent-parallel, or independent-review flow; read [references/orchestration-patterns.md](references/orchestration-patterns.md) when the task has multiple workstreams.
3. Agree on roles and ownership. A coordinator plans and integrates; builders own bounded changes; testers verify acceptance criteria; reviewers inspect the integrated result. Adjust the number of roles to fit the task.
4. Identify each participant using its native session ID when available, otherwise register an explicit stable alias with the bridge. Do not infer identity from a terminal number or pasted text.
5. Prove a real message exchange through the configured bridge before delegating code changes. The recipient must retrieve the delivered message, acknowledge its ID, and send a reply the coordinator can read. Queue acceptance alone is not proof the receiving agent saw the message.
6. If participants use different AI tools, connect each through a supported adapter: a shared MCP server, documented bridge CLI, or another explicit transport. Do not assume one provider's fork, API, or MCP integration works for another provider. If an agent cannot use any bridge interface, describe that limit and use a human-mediated handoff instead of pretending it is connected.
7. Use separate Git worktrees for concurrent writers. Check `git status` first, agree on file ownership, and do not assume uncommitted work moves into a worktree.
8. Set acceptance criteria and a runnable verifier before assigning work. Use [templates/task-brief.md](templates/task-brief.md) to prepare consistent assignments. Require evidence from the actual run. Diagnose failures before one bounded retry; do not loop on a failing check.
9. Track each provider's official quota where available and honor the user's checkpoint threshold. If asked to reserve the final 10%, checkpoint at 90% used and stop new work at the agreed limit. Report unavailable quota as unknown; do not estimate savings.
10. Integrate verified changes, request review of the integrated revision, and report what was checked, limitations, live session/worktree state, and resume steps.

## Security and unattended work

Treat agent approval settings, filesystem/network sandboxes, and operating-system elevation prompts as separate controls. A provider's no-approval option cannot answer a Windows UAC, macOS authorization, Linux `sudo`, or other operating-system prompt. Before unattended runs, use a bounded task, isolated worktree, checkpoints, a noninteractive verifier, and a permission mode appropriate for the environment. Never promise completion while the user is away.

For platform setup and the bridge contract, read [references/platforms-and-agents.md](references/platforms-and-agents.md). For task ownership, message delivery, worktrees, integration, and quota handling, read [references/team-operations.md](references/team-operations.md). For permission details, read [references/permissions-and-unattended.md](references/permissions-and-unattended.md).

## Portability boundary

This skill defines a coordination process; it does not install a universal broker or make every AI product compatible. Confirm each participant can access the project and its bridge adapter. Keep credentials, session IDs, logs, and queue state out of version control and in ignored project-local storage. Check the installed agent version and its official documentation before writing a provider-specific adapter.
