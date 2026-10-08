# ADR-0012: Black Text on Primary Buttons for WCAG AA (Deviation from Figma)

- **Status**: Accepted (supersedes the Contrast section of ADR-0011)
- **Date**: 2026-10-08
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group, Designers
- **Informed**: All project contributors

---

## Context and Problem Statement

In Figma, Primary buttons put **OFF White `#F0F0F0`** text on the Google brand fills. This fails WCAG 2.1 AA contrast in every color and state ([#13](https://github.com/AdrianRomanski/gdg-wroclaw/issues/13)). Ratios range from 1.25:1 (Halftone Yellow, Hover) to 3.44:1 (Red 500). The button label is 16px Medium, which counts as normal text, so it needs **4.5:1**.

ADR-0011 shipped the Figma colors and tracked this as debt. We now want the design system to meet AA.

There is a hard constraint: the **brand fills cannot change**. Blue 500, Green 500, Yellow 600, Red 500 and their halftones are Google's brand colors. Only the text color can change.

---

## Decision Drivers

- Reach WCAG 2.1 AA (4.5:1) for every Primary color in both Default and Hover.
- Leave the Google brand palette unchanged.
- Use one text color for all Primary buttons, not a different one per color.
- Reuse an existing Figma color rather than introduce a new one.

---

## Considered Options

| Text color                    | Lowest ratio over the 8 fills | Passes AA?          |
| :---------------------------- | ----------------------------: | :------------------ |
| OFF White `#F0F0F0` (Figma)   |        1.25 (Halftone Yellow) | ❌ none of the 8    |
| White `#FFFFFF`               |        1.43 (Halftone Yellow) | ❌ none of the 8    |
| Black 02 `#1E1E1E`            |                4.25 (Red 500) | ❌ fails on Red 500 |
| **Neutral Darkest `#000000`** |            **5.35 (Red 500)** | ✅ all 8            |

The darkest neutral that still fails on Red 500 is `#191919`; `#181818` is the lightest that passes. Two other options were rejected:

- **Per-color text colors**: inconsistent, and harder to maintain.
- **Changing the fills**: ruled out by the brand constraint above.

---

## Decision Outcome

Chosen option: **black `#000000` text and icons on all Primary buttons**, in both Default and Hover.

- New primitive token **`color.neutral-darkest`** (`#000000`). Figma already has this color as the variable `Color/Neutral Darkest`, on the Contact Form page.
- **`color.content.on-brand`** now points to `color.neutral-darkest` instead of `color.off-white`. The Button CSS was already using this token, so the component code doesn't change.
- **Unchanged**:
  - the brand fills
  - Secondary buttons: OFF White text on Black 02, 14.63:1
  - Disabled buttons, which WCAG 1.4.3 exempts
- Contrast with black text:

  | Fill   | Default | Hover |
  | :----- | ------: | ----: |
  | Blue   |    5.89 | 11.30 |
  | Green  |    6.87 | 11.81 |
  | Yellow |   10.85 | 14.70 |
  | Red    |    5.35 |  8.80 |

- **Guard**: a unit test in `shared-ui-tokens` computes WCAG contrast for `content.on-brand` against every `brand.*.primary|secondary` fill, and for `content.default` on `background.default`. It fails below 4.5:1.
- **Storybook**: the `a11y.test: 'todo'` exception is removed from the Button stories. They now use the global `'error'` setting like every other story.
- **Figma**: Figma no longer matches the code. [#15](https://github.com/AdrianRomanski/gdg-wroclaw/issues/15) asks the designers to update the 48 Primary Default and Hover variants in `143:2772`.

### Positive Consequences

- Every button state meets WCAG 2.1 AA.
- The Google brand palette is unchanged.
- A regression guard catches any future token change that breaks contrast.

### Negative Consequences / Trade-offs

- Code and Figma disagree until #15 is done.
- Primary buttons look different from the original design: dark labels on bright fills.

## Implementation Guidelines / Next Steps

- Use `--gdg-color-content-on-brand` for any text or icon placed on a brand fill, not only in buttons.
- Close #15 once the Figma component set uses `Color/Neutral Darkest` for Primary text.
