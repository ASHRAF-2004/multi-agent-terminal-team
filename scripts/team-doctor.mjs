#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const repoHint = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

function run(command, args, cwd = repoHint) {
  return spawnSync(command, args, { cwd, encoding: 'utf8', windowsHide: true });
}

function git(args, cwd = repoHint) {
  const result = run('git', args, cwd);
  if (result.error) return { ok: false, error: result.error.message, output: '' };
  return { ok: result.status === 0, error: result.stderr?.trim(), output: result.stdout?.trim() ?? '' };
}

function findCommand(name) {
  const extensions = process.platform === 'win32'
    ? (process.env.PATHEXT ?? '.EXE;.CMD;.BAT;.COM').split(';')
    : [''];
  for (const dir of (process.env.PATH ?? '').split(path.delimiter)) {
    if (!dir) continue;
    for (const extension of extensions) {
      const candidate = path.join(dir, `${name}${extension}`);
      try {
        fs.accessSync(candidate, fs.constants.F_OK);
        return candidate;
      } catch {}
    }
  }
  return null;
}

function report(label, value) {
  process.stdout.write(`${label}: ${value}\n`);
}

const rootResult = git(['rev-parse', '--show-toplevel']);
if (!rootResult.ok) {
  report('Git repository', 'NOT FOUND');
  report('Path checked', repoHint);
  process.stderr.write('Run this command from a project repository or pass its path. No files were changed.\n');
  process.exit(1);
}

const repoRoot = path.resolve(rootResult.output);
report('Project', repoRoot);
const branch = git(['branch', '--show-current'], repoRoot);
report('Current branch', branch.ok && branch.output ? branch.output : '(detached HEAD or unavailable)');

const status = git(['status', '--short'], repoRoot);
report('Working tree', status.ok ? (status.output ? 'HAS CHANGES' : 'clean') : `unavailable (${status.error})`);
if (status.ok && status.output) {
  for (const line of status.output.split(/\r?\n/)) report('  change', line);
}

const worktrees = git(['worktree', 'list', '--porcelain'], repoRoot);
if (worktrees.ok) {
  const paths = worktrees.output.split(/\r?\n/).filter(line => line.startsWith('worktree '));
  report('Git worktrees', `${paths.length} registered`);
  for (const worktreePath of paths) report('  worktree', worktreePath.slice('worktree '.length));
} else {
  report('Git worktrees', `unavailable (${worktrees.error})`);
}

const configured = (process.env.TEAM_AGENT_COMMANDS ?? 'codex,claude,gemini,opencode,aider')
  .split(',').map(item => item.trim()).filter(Boolean);
const found = configured.map(name => [name, findCommand(name)]).filter(([, location]) => location);
report('Agent CLIs on PATH', found.length ? found.map(([name]) => name).join(', ') : 'none of the common defaults');
for (const [name, location] of found) report(`  ${name}`, location);

const runtimeDir = path.join(repoRoot, '.multi-agent-team');
if (fs.existsSync(runtimeDir)) {
  const ignored = git(['check-ignore', '-q', runtimeDir], repoRoot);
  report('Project runtime directory', ignored.ok ? `${runtimeDir} (ignored by Git)` : `${runtimeDir} EXISTS but is not confirmed ignored`);
} else {
  report('Project runtime directory', 'not created');
}

report('Message bridge', 'NOT VERIFIED - send a message, receive it in another agent, acknowledge its ID, and verify the reply.');
report('Changes made', 'none; this is a read-only preflight.');

if (process.env.TEAM_AGENT_COMMANDS) {
  const requested = process.env.TEAM_AGENT_COMMANDS.split(',').map(item => item.trim()).filter(Boolean);
  const missing = requested.filter(name => !findCommand(name));
  if (missing.length) process.exitCode = 2;
}
