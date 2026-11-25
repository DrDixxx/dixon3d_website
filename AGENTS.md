# Dixon3D Agent Instructions

## Project state

Dixon3D is a Next.js 15 website for a small 3D-printing and engineering-design business. The live site is currently deployed through Netlify. Cloudflare manages the domain. The repository contains unfinished PayPal, SMTP inquiry, and experimental Cloudflare intake code.

## Default operating mode

Act as the primary implementation agent. Do not ask the user to manually type routine shell commands when you can safely run them yourself.

For each task:

1. Inspect the repository and current Git state.
2. Confirm the task branch and working tree state.
3. Read relevant documentation under `docs/` before changing code.
4. Make the smallest coherent change that satisfies the task.
5. Run available tests, type checks, lint checks, and builds.
6. Review the diff.
7. Commit with a clear conventional commit message.
8. Push the task branch when authentication permits.
9. Open/update the pull request, verify the Netlify preview and relevant checks, and merge low-risk, fully validated changes using the owner's standing release authorization.
10. Provide a completion report using the required format below.

Do not ask for approval for ordinary read-only commands, local builds, dependency installation from the existing lockfile, or edits within the active task branch. Ask before destructive Git operations, backend/security/payment changes, external-account changes, customer communications, or access to secrets. Routine tested source pushes, PR merges and static UI deployments are covered by the owner's standing 2026-11-25 authorization.

## Git rules

- Never implement directly on `main`.
- Begin from the latest approved base branch.
- Use one branch per coherent task.
- Prefer branch names such as `chore/...`, `fix/...`, `feat/...`, or `docs/...`.
- The owner authorizes routine verified low-risk PR merges, static portfolio/UI releases, and code pushes as of 2026-11-25. Do not reset, force-push, delete branches, rewrite history or bypass branch protection without separate approval.
- Keep unrelated changes out of the same branch.
- Preserve a clean working tree at task completion.

## Safety and external systems

Do not perform any of the following without explicit authorization:

- Deploy unverified or backend-sensitive production changes. Routine static/site UI updates with successful preview and preserved rollback are preauthorized.
- Change Netlify, Cloudflare, DNS, PayPal, SMTP, GitHub, or email settings.
- Send customer email or submit production forms.
- Create, authorize, capture, refund, or inspect real payment transactions.
- Read, print, commit, or expose secret values.
- Upload private customer files or personal information.

Environment-variable names may be documented. Values must remain private.

## Ship-to-done workflow

The owner expects the agent to complete implementation, validation, push, PR, safe merge and release in one execution whenever possible; do not stop at a local clean branch or request repeated intermediate reviews. Resume previous work instead of creating redundant audits. If the task is blocked by an external approval or unavailable resource, do the next independent high-value task and report only a precise genuine dependency. Never claim a build, deployment or customer flow is successful without observing evidence. Customer data, payments, proprietary assets and unverified safety boundaries are outside this standing authorization.

## Current known risks

- The design form advertises uploads but does not transmit files on `main`.
- PayPal trusts browser-provided price, quantity, product name, and currency.
- Public diagnostic endpoints may reveal excessive operational details.
- The inquiry endpoint lacks spam and abuse controls.
- Next.js, Nodemailer, and PostCSS require security review and upgrades.
- The Cloudflare intake experiment in `sandbox` is not production-safe as written.

## Technical baseline

- Node.js: 22.x
- npm
- Next.js 15.5.20
- React 19.2.7
- Netlify deployment
- Netlify Functions
- Nodemailer SMTP
- Tailwind CSS

The baseline branch `chore/stabilize-build` adds the lockfile and TypeScript configuration and has a verified successful production build.

## Required verification

For code changes, run the commands relevant to the task. At minimum, normally run:

```bash
npm install
npm run build
```

Use `npm ci` when the lockfile is unchanged and the environment supports it. Do not run `npm audit fix` or `npm audit fix --force` unless explicitly authorized.

When the repository gains dedicated scripts, also run:

```bash
npm run lint
npm run typecheck
npm test
```

Never claim a command passed unless it actually ran successfully.

## Customer-facing constraints

Do not invent or silently change:

- Prices
- Materials
- Machine capabilities
- Tolerances
- Certifications
- Engineering qualifications
- Testimonials
- Customer outcomes
- Delivery times
- Warranty or suitability claims

Treat AI-generated CAD, engineering analysis, quotes, and customer responses as drafts requiring human approval.

## Completion report

Every implementation task must report:

- Summary
- Why the change was made
- Branch and commit
- Files changed
- Commands run
- Build, test, lint, and type-check results
- Visual verification performed
- Assumptions
- Remaining risks or problems
- Manual checks still required
- Recommended next task
