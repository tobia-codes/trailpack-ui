---
name: add-component
description: >-
  Use when adding a new component to @trailpack-ui/react, or when moving an
  existing one into the package. Walks the folder layout, the client-boundary
  decision, the barrel export and the checks that have to pass, in the order
  that avoids rework.
---

# Adding a component to @trailpack-ui/react

The rules behind these steps live in [AGENTS.md](../../../AGENTS.md) and the
[repository AGENTS.md](../../../../../AGENTS.md). This is the order to do them
in. `src/components/Button` is the worked example for every step — read it
before starting rather than working from this page alone.

## 1. Decide the boundary first

It shapes the rest, and changing it later means rewriting the component.

Ask only this: **does the module itself call React's runtime** — `useState`,
`useEffect`, `useId`, `useRef`, `useSyncExternalStore`, `useContext`?

- **No** → no directive. The component works on the server and in the client,
  and a Server Component renders it with zero JavaScript. Taking an `onClick` as
  a prop does _not_ count; the caller passing the handler is the boundary.
- **Yes** → `'use client';` as the first line of the `.tsx`.

Prefer the first. If a component needs state, consider whether the state can
live in a hook under `src/hooks` that the consumer calls, leaving the component
itself universal.

## 2. Create the folder

```
src/components/<Name>/
  <Name>.css.ts
  <Name>.tsx
  <Name>.stories.tsx
```

No `index.ts` per folder — the barrel imports the file directly.

## 3. Write `<Name>.css.ts`

Read every value from `vars`; never write a hex, a px radius or a font stack
here. If a token is missing, it is added in `packages/theme` first, with its
guidance entry and both generators — not worked around here.

- Tone variants: `styleVariants(vars.tone, (tone) => ({ … }))`, so a tone added
  to the theme cannot arrive half-supported.
- Scale variants (padding, gap): `styleVariants(vars.space, …)`.
- Qualify every interactive state with `:not(:disabled)`.
- Focus is `vars.focusRing.width` / `.offset` with `vars.color.ring`, on
  `:focus-visible`.
- Any `transition` needs a `(prefers-reduced-motion: reduce)` escape.

## 4. Write `<Name>.tsx`

An arrow function. Props extend `ComponentPropsWithRef<'element'>` so
`className`, `ref`, `id`, `aria-*` and handlers pass through, and `className` is
appended with `cx`, never replaced.

Two traps worth knowing before the compiler tells you:

- A prop that collides with a DOM attribute of a different type needs `Omit`.
  `title` is the common one — on a div it is the tooltip string, so a heading
  prop called `title` must drop the DOM one.
- Defaults go in the parameter list (`tone = 'accent'`), not in the body.

Document the boundary decision in the component's doc comment when it is not
obvious — why this one holds state, or why this one deliberately does not.

## 5. Write the story beside it

`<Name>.stories.tsx` in the same folder, CSF3, `satisfies Meta<typeof X>`.
Helpers (a tone list, layout objects) stay in the story file until a second
story needs them. Only add a `storybook/` folder if the component needs written
documentation beyond its stories.

## 6. Export from `src/index.ts`

The component and its public prop types, alphabetically among the existing
components. `src/index.ts` never carries `'use client'` — the barrel is not a
boundary.

Nothing the barrel does not reach is published: `tsconfig.build.json` builds
from that one entry, so a component that is not exported ships nothing, and the
story next to it is never in the program.

## 7. Run the checks

```sh
pnpm build && pnpm test && pnpm lint && pnpm format
```

`src/boundaries.test.ts` is the one that matters here. It asserts that a module
declares `'use client'` exactly when it touches React's runtime, and that the
directive survives into `dist/`. If step 1 was answered wrong, this is where it
surfaces — a mismatch means the component and the directive disagree, not that
the test is too strict.

Then `pnpm dev` and look at the story in both themes via the toolbar. Nothing
verifies that a story renders; a broken one fails in the browser, not in CI.

## 8. Update the README

The API section lists what the package exports, and the directive table in
_Server rendering and Next.js_ lists which modules carry `'use client'`. A new
component belongs in both. Do not create a changeset.
