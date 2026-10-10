# ADR-0023: Events App Shell, Routes and Sample Content

- **Status**: Accepted
- **Date**: 2026-10-10
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group
- **Informed**: All project contributors

---

## Context and Problem Statement

`ui` now has every piece of the website: the Navbar and Footer (ADR-0020), the Landing page (ADR-0022), the Workshop page (ADR-0017) and the Contact form (ADR-0014). `apps/events` still renders only a "GDG Wrocław" heading. The next PR deploys the app to Firebase Hosting, so the app has to become the real website first.

There is no real content yet (events, team, partners, FAQ), no images except the logo, and no backend for the contact form. The `ui` components render plain `href`s (ADR-0013, ADR-0020), which by default reload the whole page on every click in a single-page app.

## Decision Drivers

- A deployable website that uses the templates as they are.
- Content that can be replaced without touching components.
- Client-side navigation for internal links, without making `ui` depend on the router.
- Accessibility: one `<main>`, a skip link, and a page title per route.

## Considered Options

- **Internal links**:
  - the shell routes same-origin link clicks through the Router (chosen)
  - `routerLink` inputs in `ui`
  - full page loads
- **Content location**:
  - typed files in the app, `apps/events/src/app/content/` (chosen)
  - a `libs/events/data-access-content` library now
  - fetching from a backend
- **Contact form**:
  - a `/contact` page with a "not available yet" notice until the Firebase backend exists (chosen)
  - linking out to the community page
  - a `mailto:` link

## Decision Outcome

### App shell (`App`)

- The **Navbar** (sticky at the top), then `<main id="main">` with the routed page, then the **Footer**. A "Skip to content" link appears on focus.
- **Link routing**: a click handler on the shell catches clicks on same-origin `<a href>` links and calls `router.navigateByUrl`, so they don't reload the page.
  - It skips: modified or non-left clicks, links with a non-`_self` `target` (the social links), `download` links and external URLs ("Register").
  - `#id` links, such as the skip link, focus the target on the current page instead of resolving against `<base href="/">`.
- Navbar links are the Landing page sections: Events, Team, Partners, FAQ (`/#events` …, using `LANDING_SECTION_IDS`). With `withInMemoryScrolling({ anchorScrolling, scrollPositionRestoration })` they scroll to the section from any route, and the sections' `scroll-margin` keeps them clear of the sticky Navbar.
- Actions: "Register" opens the chapter page on gdg.community.dev; "Contact us" goes to `/contact`.

### Routes (all lazy-loaded, each with its own `title`)

| Path               | Page                                                                                                                                                 |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                | `HomePage`: `LandingPage` with `LANDING_CONTENT`                                                                                                     |
| `/workshops/:slug` | `WorkshopRoute`: `WorkshopPage` for a known slug (bound with `withComponentInputBinding`), otherwise Not found                                       |
| `/contact`         | `ContactPage`: `ContactForm` with a visually hidden `<h1>`. Submitting shows a status notice that sending isn't available yet, then resets the form. |
| `**`               | `NotFoundPage`, with a link home                                                                                                                     |

### Content (`apps/events/src/app/content/`)

- `site.ts`: the navigation links, actions, community URL, social links and legal links. The social and legal links stay empty until the real accounts and pages exist. `TERMS_URL` points to the Google Developers community guidelines.
- `landing.ts` and `workshops.ts`: the **Figma sample content**, typed with the `ui` shapes (`LandingPageContent`, `Workshop`). The event "Read more" links point to `/workshops/sample-workshop`.
- There are no images yet. The hero is left out, and people and partners show their initials.
- The content stays in the app for now. When a real source arrives with Firebase (for example Firestore), it moves into a `libs/events/data-access-*` library, which maps it to these same shapes.

### Global styles

- `html` gets the default background and `color-scheme: dark`.
- A global `.visually-hidden` class.
- The index `<title>` and a meta description.

### Unit tests

- The Angular unit-test builder loads packages from `node_modules` without compiling them, so the `ui` components failed with "Component is not resolved".
- `apps/events/tsconfig.vitest.json` is the test target's `tsConfig`. It maps `@gdg-wroclaw/ui` and the design-system packages to their sources with `paths`, so they're compiled ahead of time like app code. This mirrors `libs/ui/tsconfig.vitest.json`.

### Positive Consequences

- The app is the website: every template is in use, and the app is ready for Firebase Hosting with an SPA rewrite to `/index.html`.
- Internal navigation needs no page reloads, and `ui` stays router-free.
- Content can be replaced in one place.

### Negative Consequences / Trade-offs

- The app ships placeholder content until the real content is provided.
- The contact form doesn't send anything yet.
- The click handler relies on links being same-origin to decide what is internal. A new external domain that should stay inside the SPA would need a rule.

## Implementation Guidelines / Next Steps

- Firebase Hosting deployment, with an SPA rewrite and caching headers (next PR and ADR).
- Send contact messages through Firebase (Firestore with a trigger, or a Cloud Function).
- Replace the sample content and add the hero image, the photos and the partner logos.
