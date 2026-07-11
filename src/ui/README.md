# UI kit

A small, owned design system: **design tokens + accessible primitives**, built on
[Radix](https://www.radix-ui.com/primitives) and styled with [Tailwind v4](https://tailwindcss.com/).
No component _library_ is imposed — you own every file here and restyle by editing tokens, not by
fighting someone else's theme.

## The layers

1. **Tokens** — `src/styles/tailwind.css`. CSS variables for color/radius, with a light and a `.dark`
   set, mapped into Tailwind's theme (`bg-primary`, `text-muted-foreground`, `ring-ring`, …). This is
   the single source of truth for appearance. **To rebrand, edit the variables here** — nothing else.
2. **Primitives** — this folder. `Button`, `Input`, `Field`, `Card`, `Badge`, `ThemeToggle`. The
   Tailwind utility classes live _here_, set up once; feature code composes named components.
3. **Theming** — `theme.ts` + the pre-paint script in `index.html`. Dark mode is a `.dark` class on
   `<html>`, set before first paint (no flash) and flipped by `ThemeToggle`.

## Why this shape

Feature code stays semantic — `<Field label="Email" error={…}><Input /></Field>`, not a wall of
utilities. The utility classes are confined to these primitive files, which are also the files an AI
generates most fluently and you hand-edit least. Accessibility (focus rings, label association,
`aria-invalid`/`aria-describedby`) is solved once in the primitive and inherited everywhere.

## Adding a component

1. New file in `src/ui/`, styled with tokens (`bg-card`, `text-foreground`, `border-border`, …) — not
   hard-coded colors, so it themes for free.
2. For variants, use `class-variance-authority` (see `button.tsx`).
3. For interactive/overlay components, build on a Radix primitive so the a11y comes for free.
4. Merge incoming `className` last via `cn()` (`src/lib/utils.ts`) so callers can override.

## A11y baseline

- Every form control goes in a `<Field>`, which wires the label + `aria-invalid` + `aria-describedby`.
- Interactive elements have visible `focus-visible` rings (via tokens).
- Icon-only controls (e.g. `ThemeToggle`) carry an `aria-label`.
