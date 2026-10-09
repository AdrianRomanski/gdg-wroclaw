# ADR-0014: Contact Form, Form Control Primitives, and Layout and Form Tokens

- **Status**: Accepted
- **Date**: 2026-10-09
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group, Designers
- **Informed**: All project contributors

---

## Context and Problem Statement

The Figma **Contact Form** page (`Contact / 3 /`, node `181:9133`) is the first page section to build in `@gdg-wroclaw/ui` (ADR-0013). It holds:

- a section title (48px heading and an 18px description)
- three labelled fields: Name and Email (`Text input`, 48px tall), Message (`Text Area`, 180px tall), each with a 1px `Colors/Brand-Blue-Primary` stroke and a 12px padding and radius
- an "I accept the Terms" `Checkbox`
- a blue Primary `Button`

Building it raises questions that go beyond one component:

1. **Form controls.** The text input, text area and checkbox are primitives, but the design system has none. Figma draws the inputs as plain frames, not components. The checkbox is an instance from an unstyled template: white fill, black stroke, Roboto label.
2. **Missing tokens.**
   - The section uses Figma variables we don't export yet: `Page Padding/padding-global` (64), `Section Padding/padding-section-large` (112), `Container/container-large` (1280), `Max Width/max-width-large` (768) and `Max Width/max-width-medium` (560).
   - It uses a 48px gap that is not on the spacing scale.
   - Figma shows no error state, so there are no colors for validation.
3. **Heading size.** The 48px heading is a raw value. The Figma type scale (`Headings Bold/H1`) tops out at 36px.
4. **Behavior.** How validation works, and where the message is sent.

## Decision Drivers

- The ADR-0013 layers: primitives in `design-system-components`, composed product UI in `ui`, with no data access in `ui`.
- Native form semantics: labels, `type="email"`, autocomplete and keyboard behavior, with Angular forms working as-is.
- Tokens follow Figma variables where they exist (ADR-0008, ADR-0010).
- WCAG AA, enforced by the Storybook a11y checks (ADR-0006, ADR-0012).

## Considered Options

- **Form controls**:
  - attribute components on native `<input>`, `<textarea>` and `<input type="checkbox">` (chosen)
  - custom `ControlValueAccessor` components (`<gdg-text-field>`)
  - styling the controls inside `ContactForm` only
- **Checkbox look**:
  - match the text inputs' blue stroke, filled brand blue when checked (chosen)
  - copy Figma's white box with a black stroke
- **Heading**:
  - `font.heading-1` (36px) (chosen)
  - a new 48px display size
- **Form state**:
  - Reactive Forms inside the presentational component, emitting a typed value (chosen)
  - Signal Forms
  - the consumer owns the form

## Decision Outcome

### Tokens (`design-system-tokens`)

- New `layout.*` group (`tokens/layout.tokens.json`), mapped one-to-one to the Figma variables:
  - `--gdg-layout-padding-global`
  - `--gdg-layout-padding-section-large`
  - `--gdg-layout-container-large`
  - `--gdg-layout-max-width-large`
  - `--gdg-layout-max-width-medium`
- `spacing.48` (`--gdg-spacing-48`) for the gap between a section title and its content. It is not yet a Figma variable.
- Semantic colors:
  - `color.border.input`, set to Brand-Blue-Primary as in Figma
  - `color.border.error` and `color.content.error`, both halftone red. Figma has no error state. Halftone red is the brand red with at least 4.5:1 contrast on the default background, and a unit test checks this.
- The Foundations "Spacing & Radius" page gains a Layout table.

### Primitives (`design-system-components`)

- **`TextInput`** (`input[gdg-text-input], textarea[gdg-text-input]`)
  - Applies the Figma stroke, padding, radius and P7 text, with 48px inputs and a 180px vertically resizable text area.
  - The placeholder uses the `Content-Disabled` color.
  - States: hover (blue secondary), focus ring, disabled, and `aria-invalid="true"` for the error stroke.
- **`Checkbox`** (`input[type=checkbox][gdg-checkbox]`)
  - An 18px native checkbox with `appearance: none`, using the input stroke.
  - When checked it fills with brand blue and shows an on-brand (black) check mark.
  - It has the same focus, disabled and invalid states as `TextInput`.
  - This intentionally deviates from Figma's placeholder styling, which reads as a white block on the dark page. The label uses Google Sans 14px instead of Roboto.
- Both follow ADR-0009: attribute components with empty templates on native elements, so `<label for>`, `formControlName`, `disabled` and autofill keep working, and no `ControlValueAccessor` is needed.

### `ContactForm` (`ui`, `<gdg-contact-form>`)

- The full `Contact / 3 /` section: section paddings, a 1280px container, a 768px title block and a 560px form, using the tokens above.
- Below 48rem the paddings shrink to 64/20px. Figma has only the desktop frame.
- The heading uses `font.heading-1` (36px) rather than the raw 48px, keeping the type scale. If the design should keep 48px, add a display step to the scale in a follow-up.
- **Inputs**: `heading` (default "Contact us"), `description`, `termsUrl` (required), `submitLabel` (default "Submit"), `pending`.
- **Output**: `submitted` emits `ContactFormValue` `{ name, email, message }`, with the name and email trimmed. It is emitted only when the form is valid.
- **Public method**: `reset()`.
- **Validation** uses Reactive Forms (`NonNullableFormBuilder`):
  - Name, Email and Message are required, Email must be a valid address, and the terms must be accepted.
  - Errors appear after a field is left or after a submit attempt.
  - Each error is linked to its field through `aria-invalid` and `aria-describedby`.
  - An invalid submit focuses the first invalid field.
- **Presentational** (ADR-0013): the component does not send anything. The consumer, a future `feature-*` or `data-access-*` library, sends the message, sets `pending` while it is in flight (this disables Submit and sets `aria-busy`), and calls `reset()` on success.

### Positive Consequences

- The text input and checkbox can be reused for future forms, such as workshop registration.
- Native controls keep the browser's accessibility, autofill and mobile keyboards.
- Section layout tokens are ready for the other Figma sections (Team, FAQ, Partners).

### Negative Consequences / Trade-offs

- Two visual deviations from Figma (checkbox styling, 36px heading) need designer confirmation. The fix is a token or CSS change.
- Error colors and `spacing.48` exist only in code until they are added as Figma variables.
- Field labels and error messages are English strings in the template. Internationalization is out of scope.

## Pros and Cons of the Options

### Attribute components on native controls

- Good, because it is the same pattern as `Button` and `NavButton`, with no CVA boilerplate and full native semantics.
- Bad, because the label and error layout are not part of the primitive; each form composes them.

### `ControlValueAccessor` components

- Good, because they could bundle label, control and error.
- Bad, because they hide the native element and need extra work for a11y, autofill and focus.

### Reactive Forms vs Signal Forms

- Reactive Forms are stable and well known. Signal Forms can replace them later without changing the component's inputs and outputs.

## Implementation Guidelines / Next Steps

- New forms: label + `gdg-text-input` / `gdg-checkbox` + an error `<p>` linked via `aria-describedby`, laid out with tokens, as `ContactForm` does.
- Ask the designers to confirm the checkbox and heading deviations, and to add `spacing-48` and error colors as Figma variables.
- Wire `ContactForm` to a backend in a feature library once the contact channel is chosen.
