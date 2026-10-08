# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the **GDG Wrocław** project.

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision made along with its context, considered options, and consequences.

For more information on ADRs, see [Architecture Decision Records](https://adr.github.io/).

## Decision Log

| ID                                                                | Title                                                                     | Status       | Date       |
| :---------------------------------------------------------------- | :------------------------------------------------------------------------ | :----------- | :--------- |
| [ADR-0001](0001-use-angular-for-frontend-development.md)          | Use Angular for Frontend Development                                      | **Accepted** | 2026-08-26 |
| [ADR-0002](0002-organize-workspace-into-apps-and-libs.md)         | Organize the Nx Workspace into `apps/` and `libs/`                        | **Accepted** | 2026-10-07 |
| [ADR-0003](0003-design-system-color-tokens.md)                    | Build a Design System Starting with Color Tokens from Figma               | **Accepted** | 2026-10-07 |
| [ADR-0004](0004-storybook-for-design-system.md)                   | Use a Single Vite-based Storybook for the Design System                   | **Accepted** | 2026-10-07 |
| [ADR-0005](0005-design-system-typography-tokens.md)               | Typography Tokens with Self-hosted Google Sans                            | **Accepted** | 2026-10-07 |
| [ADR-0006](0006-ci-without-nx-cloud-and-storybook-smoke-tests.md) | CI without Nx Cloud, and Storybook Smoke Tests                            | **Accepted** | 2026-10-07 |
| [ADR-0007](0007-gdg-wroclaw-package-scope-and-selector-prefix.md) | `@gdg-wroclaw` Package Scope and `gdg` Selector Prefix                    | **Accepted** | 2026-10-07 |
| [ADR-0008](0008-design-tokens-pipeline-dtcg-style-dictionary.md)  | Design Tokens Pipeline (W3C DTCG + Style Dictionary) with Semantic Tokens | **Accepted** | 2026-10-07 |
| [ADR-0009](0009-nav-button-component.md)                          | Nav Button as an Attribute Component on Native Links and Buttons          | **Accepted** | 2026-10-08 |
| [ADR-0010](0010-spacing-radius-and-medium-weight-tokens.md)       | Spacing, Radius and Medium Weight Tokens                                  | **Accepted** | 2026-10-08 |
| [ADR-0011](0011-button-component-and-phosphor-icons.md)           | Button Component and Phosphor Icons                                       | **Accepted** | 2026-10-08 |
| [ADR-0012](0012-primary-button-text-color-for-wcag-aa.md)         | Black Text on Primary Buttons for WCAG AA (Deviation from Figma)          | **Accepted** | 2026-10-08 |

---

## ADR Lifecycle

- **Proposed**: The decision is under discussion and awaiting review.
- **Accepted**: The decision has been agreed upon and is in effect.
- **Rejected**: The decision was considered but not approved.
- **Deprecated**: The decision is no longer relevant or enforced.
- **Superseded**: The decision has been replaced by a newer ADR (with link to the new ADR).

## Template

When creating a new ADR, use the format below and increment the numeric identifier (e.g., `0002-title.md`):

```markdown
# ADR-XXXX: [Short title of solved problem and solution]

- **Status**: [Proposed | Accepted | Rejected | Deprecated | Superseded by ADR-YYYY]
- **Date**: YYYY-MM-DD
- **Deciders**: [List of participants/roles]
- **Consulted**: [List of consulted stakeholders]
- **Informed**: [List of informed parties]

## Context and Problem Statement

[What is the context and problem we are trying to solve?]

## Decision Drivers

- [Driver 1]
- [Driver 2]

## Considered Options

- [Option 1]
- [Option 2]
- [Option 3]

## Decision Outcome

Chosen option: "[Option 1]", because [justification].

### Positive Consequences

- [Consequence 1]
- [Consequence 2]

### Negative Consequences / Trade-offs

- [Consequence 1]
- [Consequence 2]

## Pros and Cons of the Options

### [Option 1]

- Good, because [argument a]
- Bad, because [argument b]

### [Option 2]

- Good, because [argument a]
- Bad, because [argument b]

## Implementation Guidelines / Next Steps

- [Guideline 1]
- [Guideline 2]
```
