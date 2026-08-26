# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the **GDG Wrocław** project.

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision made along with its context, considered options, and consequences.

For more information on ADRs, see [Architecture Decision Records](https://adr.github.io/).

## Decision Log

| ID                                                       | Title                                | Status       | Date       |
| :------------------------------------------------------- | :----------------------------------- | :----------- | :--------- |
| [ADR-0001](0001-use-angular-for-frontend-development.md) | Use Angular for Frontend Development | **Accepted** | 2026-08-26 |

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
