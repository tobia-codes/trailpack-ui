---
name: add-component
description: >-
  Use when adding a new component or primitive to @trailpack-ui/react, or when
  moving an existing one into the package. Walks the group it belongs to, the
  folder layout, the client-boundary decision, the barrel export and the checks
  that have to pass, in the order that avoids rework.
---

# Adding a component to @trailpack-ui/react

The rules behind these steps live in [AGENTS.md](../../../AGENTS.md) and the
[repository AGENTS.md](../../../../../AGENTS.md). This is the order to do them
in. `src/components/Button` is the worked example for every step — read it
before starting rather than working from this page alone.

## 1. Pick the group

`src/primitives` or `src/components`, and the three clauses that decide are in
[AGENTS.md](../../../AGENTS.md#primitive-or-component). The short form: a
primitive carries no `tone` and no `variant`, paints no filled surface, and
names a relationship — `Stack`, `Text`, `Divider` — rather than an object.

It comes first because it picks the folder and the barrel. Both groups reach a
consumer through the package root, so moving something across later breaks
nobody — which is exactly why the folder has to be right: it is the only place
the split is recorded. Every step below reads the same in either folder; where
the page says `src/components`, substitute `src/primitives` throughout if that
is the answer here.

`src/primitives/Stack` is the worked example on that side, and `Button` on the
other; the two folders read the same.

## 2. Decide the boundary

**Do this before writing anything else** — it shapes the rest, and changing it
later means rewriting the component. The rule itself is in
[AGENTS.md](../../../AGENTS.md#the-use-client-boundary-is-the-central-invariant).

Prefer no directive. If a component needs state, consider whether the state can
live in a hook the consumer calls, leaving the component itself universal.
There is no `src/hooks` at the moment, so that means creating it: a barrel
beside the hook, re-exported from `src/index.ts` like the other groups. Nothing
else — the package has one entry and one code `exports` path.

## 3. Create the folder

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

## 4. Write `<Name>.css.ts`

[AGENTS.md](../../../AGENTS.md#styling) has the rules: `vars` only and never a
literal, tone variants through `styleVariants`, every interactive state
qualified with `:not(:disabled)`. Which token to reach for is the
[`theme` skill](../../../../../skills/theme/SKILL.md).

Write it as vanilla-extract reads — the cascade layer the package ships in is
applied to the bundle, and there is nothing to remember per rule.

What those do not cover:

- Scale variants (padding, gap): `styleVariants(vars.space, …)`.
- Focus is `vars.focusRing.width` / `.offset` with `vars.color.ring`, on
  `:focus-visible`.
- Any `transition` needs a `(prefers-reduced-motion: reduce)` escape.

## 5. Write `<Name>.tsx`

An arrow function. Props extend `ComponentPropsWithRef<'element'>` so
`className`, `ref`, `id`, `aria-*` and handlers pass through, and `className` is
appended with `cx`, never replaced.

**The signature takes the props whole — `(props: <Name>Props)` — and the body
destructures them, defaults included:**

```tsx
export const Stack = (props: StackProps) => {
  const { direction = 'column', gap = 4, className, ...rest } = props;
```

One trap worth knowing before the compiler tells you: a prop that collides with
a DOM attribute of a different type needs `Omit`. `title` is the common one —
on a div it is the tooltip string, so a heading prop called `title` must drop
the DOM one.

Variant unions belong here rather than in the stylesheet — write
`type <Name>Size = 'sm' | 'md' | 'lg'`, then go back and annotate the stylesheet's
exports against it (`export const size: Record<<Name>Size, string> = …`), never
`keyof typeof styles.size`. `tone` is the exception and stays `ToneName`.
[AGENTS.md](../../../AGENTS.md#styling) has the reasoning; `Button` has the
shape.

Document the boundary decision in the component's doc comment when it is not
obvious — why this one holds state, or why this one deliberately does not.

## 6. Write the story beside it

`<Name>.stories.tsx` in the same folder, CSF3, `satisfies Meta<typeof X>`.
Helpers (a tone list, layout objects) stay in the story file until a second
story needs them. Only add a `storybook/` folder if the component needs written
documentation beyond its stories.

## 7. Export from the group barrel

`src/components/index.ts`, or `src/primitives/index.ts` — the component and its
public prop types, alphabetically among the ones already there. That is the only
place to add it: `src/index.ts` re-exports each group with `export *`, so the
package root picks it up on its own. No barrel ever carries `'use client'`;
none of them is a boundary.

Nothing a barrel does not reach is published: `tsconfig.build.json` builds from
the entry points alone, so a component that is not exported ships nothing, and
the story next to it is never in the program.

## 8. Run the checks

```sh
pnpm build && pnpm test && pnpm lint && pnpm format
```

The suite covers `Button` and `cx`; nothing in it checks step 2, so check that
one by hand: if your component carries a directive, `dist/<Name>/<Name>.js`
starts with it, and no barrel does.

Then `pnpm dev` and look at the story in both themes via the toolbar. Nothing
verifies that a story renders; a broken one fails in the browser, not in CI.

## 9. Update the README

The API section lists what the package exports, and the directive table in
_Server rendering and Next.js_ lists which modules carry `'use client'`. A new
component belongs in both. Do not create a changeset.
