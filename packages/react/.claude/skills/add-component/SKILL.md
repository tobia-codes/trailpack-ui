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

**Do this before writing anything else** — it shapes the rest, and changing it
later means rewriting the component. The rule itself is in
[AGENTS.md](../../../AGENTS.md#the-use-client-boundary-is-the-central-invariant).

Prefer no directive. If a component needs state, consider whether the state can
live in a hook the consumer calls, leaving the component itself universal.
There is no `src/hooks` at the moment, so that means creating it: a barrel
beside the hook, a `./hooks` entry in `exports`, `build.lib.entry` and
`tsconfig.build.json`.

## 2. Create the folder

```
src/components/<Name>/
  <Name>.css.ts
  <Name>.tsx
  <Name>.stories.tsx
```

No `index.ts` per component folder — `src/components/index.ts` imports the file
directly.

A component with smaller components of its own nests them, each in the same
shape. Nesting is what marks them private:

```
src/components/Input/
  Input.tsx
  Input.css.ts
  Input.stories.tsx
  components/
    Label/
      Label.tsx
      Label.css.ts
  utils/                only what Input alone needs
```

## 3. Write `<Name>.css.ts`

[AGENTS.md](../../../AGENTS.md#styling) has the rules: `vars` only and never a
literal, tone variants through `styleVariants`, every interactive state
qualified with `:not(:disabled)`. Which token to reach for is the
[`theme` skill](../../../../../skills/theme/SKILL.md).

What those do not cover:

- Scale variants (padding, gap): `styleVariants(vars.space, …)`.
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

## 6. Export from `src/components/index.ts`

The component and its public prop types, alphabetically among the existing
components. That is the only place to add it — `src/index.ts` re-exports the
group with `export *`, so the package root picks it up on its own. No barrel
ever carries `'use client'`; none of them is a boundary.

Nothing a barrel does not reach is published: `tsconfig.build.json` builds from
the entry points alone, so a component that is not exported ships nothing, and
the story next to it is never in the program.

## 7. Run the checks

```sh
pnpm build && pnpm test && pnpm lint && pnpm format
```

The suite covers `Button` and `cx`; nothing in it checks step 1.
`src/boundaries.test.ts` used to catch a wrong answer there — it asserted that a
module declares `'use client'` exactly when it touches React's runtime, and that
the directive survives into `dist/`. It was
removed with the hooks it covered. **If your component carries a directive, it
is the first one in the package again: bring that test back with it**, plus a
`turbo.json` here adding `build` to the `test` task's `dependsOn`, since it
reads `dist/`. Until then, check by hand that `dist/<Name>/<Name>.js` starts
with the directive and that no barrel does.

Then `pnpm dev` and look at the story in both themes via the toolbar. Nothing
verifies that a story renders; a broken one fails in the browser, not in CI.

## 8. Update the README

The API section lists what the package exports, and the directive table in
_Server rendering and Next.js_ lists which modules carry `'use client'`. A new
component belongs in both. Do not create a changeset.
