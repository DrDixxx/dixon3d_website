# Dixon3D Roadmap

## Current phase: recovery and stabilization

### Completed

- Repository access restored.
- Live Netlify deployment identified.
- Branch history inspected.
- Node 22 local environment installed.
- Dependency installation completed.
- Production build verified successfully.
- Lockfile and TypeScript baseline created on `chore/stabilize-build`.

### In progress

- Establish repository instructions and agent-first workflow.
- Confirm Netlify production branch and deployed commit.
- Confirm PayPal sandbox/live mode without exposing secrets.
- Confirm SMTP sender, recipient, and reply behavior.

## Prioritized implementation backlog

### P0 — Immediate safety

1. Patch supported dependency versions in controlled stages.
2. Prevent browser-controlled PayPal pricing and currency.
3. Remove or restrict public diagnostic endpoints.
4. Verify whether live PayPal credentials are active.
5. Add basic anti-abuse controls to the inquiry endpoint.

### P1 — Reliable customer intake

1. Replace the fake file-upload interface with a real private upload workflow.
2. Store lead metadata separately from uploaded files.
3. Add server-side type, size, filename, and request validation.
4. Add customer acknowledgement and internal notification.
5. Make replies target the submitted customer email safely.
6. Define privacy, retention, deletion, and access rules.

### P2 — Site quality

1. Repair broken information-page images.
2. Add sitemap and robots configuration.
3. Correct text-encoding defects.
4. Add page-specific metadata.
5. Optimize large images and remove unnecessary eager loading.
6. Add accessible labels, headings, dialogs, and mobile navigation state.
7. Add lint, type-check, test, and continuous-integration scripts.

### P3 — Business and conversion redesign

1. Validate actual services, qualifications, materials, prices, and testimonials.
2. Define ideal customer segments and highest-value jobs.
3. Refine navigation and calls to action.
4. Build a portfolio and case-study system.
5. Decide whether direct checkout should exist or whether most work should begin as a quote.

### P4 — Approval-gated automation

1. Lead classification.
2. Missing-information detection.
3. Draft customer responses.
4. Preliminary material, print-time, labor, cost, and margin estimates.
5. Quote-package preparation.
6. Follow-up queues.
7. Portfolio-draft generation from completed projects.
8. Parametric-design assistance with human engineering review.

## Hosting position

Keep production on Netlify during stabilization. Do not migrate merely to change platforms. Reevaluate Netlify, Vercel, and Cloudflare after the intake, email, payment, and deployment boundaries are understood.

## Branches to preserve temporarily

- `main`
- `main_backup`
- `sandbox`
- `chore/stabilize-build`

`overwrite-main-with-backup` is the strongest eventual archive/delete candidate, but no branch should be deleted until deployment references are checked.
