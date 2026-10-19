# Choose an orchestration pattern

Use the least complicated workflow that fits the task. Extra agents add startup, coordination, review, and quota costs.

| Pattern | Use it when | Coordination rule |
| --- | --- | --- |
| One agent | The change is small, tightly coupled, or has one clear owner. | Keep one thread and skip the broker setup. |
| Sequential handoff | Later work depends on earlier findings or code. | Dispatch only tasks whose dependencies have passed; mark blocked work clearly. |
| Independent parallel work | Two or more tasks can proceed without editing the same files or waiting on shared decisions. | Assign exclusive paths, separate worktrees, and a merge order. Limit concurrency to the user's quota and review budget. |
| Independent review | A change needs a second perspective after implementation. | Give the reviewer the requirements and integrated diff. Ask for findings with file/line evidence; do not ask for vague approval. |
| Independent analysis then synthesis | A decision is ambiguous or high-impact and separate perspectives may expose assumptions. | Ask each agent the same bounded question without showing other answers first. The coordinator compares evidence and makes the decision; do not use a vote to settle factual or safety questions. |

## Plan dependencies before dispatch

Represent tasks as a directed acyclic graph. List each task's prerequisites, then check for cycles before assigning work. A task is ready only when every prerequisite has a verified result. If a prerequisite fails, mark dependent tasks blocked and re-plan instead of allowing them to proceed on a false assumption.

For each assignment, set a time or effort boundary proportional to the task, define a heartbeat or check-in interval only when the bridge supports it, and avoid rapid inbox polling. On timeout, inspect the task's message IDs, branch, and checkpoint before deciding whether to wait, reassign, or stop. Never dispatch the same task twice while its first delivery or execution may still be active.

## Synthesize without hiding disagreement

The coordinator owns the final result. Compare worker reports against the acceptance criteria, verifier output, and actual diff. Keep conflicting findings visible until resolved. Report unresolved assumptions and failed checks; do not average opinions or convert a majority vote into proof.
