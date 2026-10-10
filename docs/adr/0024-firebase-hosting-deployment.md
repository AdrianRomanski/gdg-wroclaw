# ADR-0024: Deploy the Events App to Firebase Hosting

- **Status**: Accepted
- **Date**: 2026-10-10
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group
- **Informed**: All project contributors

---

## Context and Problem Statement

`apps/events` is now the website (ADR-0023). It is a static Angular single-page app: `nx build events` writes `dist/apps/events/browser`, with content-hashed JS, CSS and fonts, and an `index.html`. The site needs to be hosted, and every merge to `main` should reach it without manual steps.

The chapter's Firebase project, `gdg-wroclaw`, already exists, and its default Hosting site is `gdg-wroclaw` (https://gdg-wroclaw.web.app). Later features are expected to use Firebase too: contact messages (ADR-0023), and maybe content in Firestore.

## Decision Drivers

- Free and simple static hosting on Google infrastructure, in the same project as the future backend.
- Client-side routes (`/contact`, `/workshops/:slug`) must load directly.
- Fast repeat visits without stale pages after a deploy.
- Every pull request gets a preview link, and `main` deploys automatically.

## Considered Options

- **Hosting**:
  - Firebase Hosting (chosen)
  - Firebase App Hosting, built for server-rendered apps, which this app is not
  - GitHub Pages, which has no rewrites or custom headers and is outside the Google ecosystem
  - Cloud Run with a static server
- **Deploys**:
  - GitHub Actions with `FirebaseExtended/action-hosting-deploy` (chosen)
  - only manual `firebase deploy`
  - Firebase CLI steps written by hand in CI

## Decision Outcome

### `firebase.json` and `.firebaserc`

- The project is `gdg-wroclaw` (`.firebaserc` default), and the site is `gdg-wroclaw`.
- `public` is `dist/apps/events/browser`. Every path is rewritten to `/index.html` (SPA fallback), with `cleanUrls` and no trailing slash.
- Headers:

| Requests                                                                                      | Header                                                                                                                                                                         |
| :-------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All                                                                                           | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy: camera=(), microphone=(), geolocation=()` |
| Hashed build files: `/<name>-<8-char hash>.js` and `.css`, everything under `/media/` (fonts) | `Cache-Control: public, max-age=31536000, immutable`                                                                                                                           |
| Routes (paths without a dot) and `/index.html`                                                | `Cache-Control: no-cache`, so a new deploy shows up on the next visit                                                                                                          |
| `/favicon.ico`                                                                                | `Cache-Control: public, max-age=86400`                                                                                                                                         |

- Only hashed files get the long cache. Images later placed in `public/` without a hash keep the Firebase default and are never stuck in browsers.
- No Content-Security-Policy yet. It needs care with Angular's inline styles and later Firebase SDK endpoints, so it gets its own change.

### Nx `deploy` target (`apps/events`)

- `npx nx deploy events` builds the app and runs `firebase deploy --only hosting --project gdg-wroclaw`.
- `npx nx deploy events -c preview` deploys to a 7-day preview channel named `preview`.
- The Firebase CLI version is pinned in the command (`npx -y firebase-tools@15.30.2`) rather than added as a dev dependency. It is a deploy tool only, and CI uses the GitHub Action.

### GitHub Actions (`.github/workflows/deploy.yml`)

- **Pull requests** from this repository build the app and deploy it to a preview channel that expires after 7 days. The action comments the URL on the PR.
- **Pushes to `main`** deploy to the live channel.
- Forks are skipped, because they get no secrets. One deploy runs at a time per PR or branch, and a newer run cancels an older one.
- Authentication is a Google service account key in the repository secret `FIREBASE_SERVICE_ACCOUNT_GDG_WROCLAW`. `firebase init hosting:github` creates it with the Firebase Hosting Admin role and stores the secret. When it asks, don't overwrite `firebase.json` and don't generate workflow files; this repository has its own.
- The existing CI workflow (lint, test, build, Storybook) is unchanged. Deploy runs alongside it.

### Repository

- `.gitignore` excludes the Firebase CLI's `.firebase/` cache and debug logs.

### Positive Consequences

- Merging to `main` publishes the site, and every PR gets a clickable preview.
- Direct links to any route work, and returning visitors download only what changed.
- Hosting sits in the same Firebase project as the upcoming contact backend.

### Negative Consequences / Trade-offs

- A service account key is stored as a GitHub secret. Workload Identity Federation would avoid long-lived keys and is a possible later hardening.
- Deploy doesn't wait for the CI workflow. A broken `main` can deploy before CI reports. Branch protection on PRs (CI required) prevents it.

## Implementation Guidelines / Next Steps

- One-time setup: run `firebase init hosting:github` (or create the service account by hand) so the secret exists, then do the first deploy.
- Optional: a custom domain in Firebase Hosting, branch protection that requires CI, and a Content-Security-Policy.
- The contact form backend (Firestore or a Cloud Function) in the same project.
