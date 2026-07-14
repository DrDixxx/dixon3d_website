# Dixon3D Agent Instructions

## Project state

Dixon3D is a Next.js 14 website for a small 3D-printing and engineering-design business. The live site is currently deployed through Netlify. Cloudflare manages the domain. The repository contains unfinished PayPal, SMTP inquiry, and experimental Cloudflare intake code.

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
9. Open or update a draft pull request when requested or when the task is implementation-ready.
10. Provide a completion report using the required format below.

Do not ask for approval for ordinary read-only commands, local builds, dependency installation from the existing lockfile, or edits within the active task branch. Ask before destructive Git operations, production deployments, external-account changes, payments, customer communications, or access to secrets.

## Git rules

- Never implement directly on `main`.
- Begin from the latest approved base branch.
- Use one branch per coherent task.
- Prefer branch names such as `chore/...`, `fix/...`, `feat/...`, or `docs/...`.
- Do not merge, rebase, reset, force-push, delete branches, or rewrite history without explicit authorization.
- Keep unrelated changes out of the same branch.
- Preserve a clean working tree at task completion.

## Safety and external systems

Do not perform any of the following without explicit authorization:

- Deploy to production.
- Change Netlify, Cloudflare, DNS, PayPal, SMTP, GitHub, or email settings.
- Send customer email or submit production forms.
- Create, authorize, capture, refund, or inspect real payment transactions.
- Read, print, commit, or expose secret values.
- Upload private customer files or personal information.

Environment-variable names may be documented. Values must remain private.

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
- Next.js 14.2.5
- React 18.3.1
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
