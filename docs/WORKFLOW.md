# Dixon3D Development Workflow

## Purpose

This repository is operated through an agent-first workflow. The user should normally describe the outcome in the Codex sidebar; Codex should inspect, run commands, edit, verify, commit, push, and prepare the pull request.

Routine PowerShell transcription should not be required.

## Standard task lifecycle

### 1. Discovery

Codex should:

- Read `AGENTS.md` and relevant files in `docs/`.
- Inspect `git status`, branches, recent commits, and task-relevant code.
- State the intended scope before changing files.
- Identify any required human decisions.

### 2. Branch preparation

Codex should:

- Fetch remote refs.
- Confirm a clean starting tree.
- Create a focused branch from the approved base.
- Avoid modifying `main` directly.

### 3. Implementation

Codex owns routine local actions:

- Dependency installation
- Source edits
- Configuration edits
- Test creation
- Builds and static checks
- Local development-server startup
- Diff review
- Commit creation
- Branch push
- Draft pull-request preparation

The user should be interrupted only for decisions involving business truth, risky external actions, credentials, production deployment, customer communication, or money movement.

### 4. Verification

Codex must run the checks supported by the repository and document exact outcomes. A failed check is a result, not permission to hide or bypass it.

Minimum current verification:

```bash
npm ci
npm run build
```

Add route, browser, accessibility, payment, email, or upload checks when relevant.

### 5. Review boundary

No task is considered production-ready until:

- The diff has been reviewed.
- Validation results are reported.
- A pull request clearly describes risks and manual checks.
- The user authorizes merge and deployment.

## Approval boundaries

Codex may proceed autonomously with:

- Read-only repository inspection
- Local file edits on a task branch
- Running existing package scripts
- Creating tests
- Installing dependencies represented by the lockfile
- Committing and pushing a task branch
- Creating draft pull requests

Codex must stop for approval before:

- Merging into `main`
- Production deployment
- DNS or domain changes
- Netlify or Cloudflare configuration changes
- PayPal API actions involving real accounts or transactions
- Sending email or submitting production forms
- Reading or changing secret values
- Deleting data or branches
- Force pushes, resets, rebases, or history rewrites

## Recommended branch sequence

1. `chore/stabilize-build`
2. `chore/codex-workflow`
3. `fix/dependency-security`
4. `fix/payment-trust-boundary`
5. `fix/inquiry-email-flow`
6. `feat/private-file-intake`
7. `feat/lead-records`
8. `feat/approval-gated-automation`
9. Visual and content work after business strategy review

Each branch should remain independently reviewable and leave the site functional.

## Recommended prompt style

Future user prompts can be short. Example:

> Take the next approved roadmap task. Inspect first, create a branch, implement it, run all relevant checks, commit, push, and prepare a draft PR. Follow AGENTS.md. Do not deploy or use production credentials.

Codex should infer routine commands from repository documentation rather than asking the user to execute each one.
