# AGENTS.md — packages/react

Applies to `packages/react`, on top of the [repository AGENTS.md](../../AGENTS.md).
That file's rules — arrow functions, the comment bar, never commit unasked,
changesets on hold — hold here unchanged. This file covers what is specific to
this package.

## What this package is

The React surface of Trailpack UI: components, hooks and small utilities,
styled with `@trailpack-ui/theme` through vanilla-extract. The line that keeps
it coherent is **no heavy dependencies** — anything needing one (a data grid, a
date picker, a charting layer) belongs in its own package, not here.

Adding a component is a procedure with an order that matters; the
[`add-component` skill](.claude/skills/add-component/SKILL.md) has it. This file
stays the source for the rules it applies.

## The `'use client'` boundary is the central invariant

Read [README.md](README.md#server-rendering-and-nextjs) before touching it. The
short form:

- A module gets `'use client'` **if and only if** it calls into React's runtime
  itself — `useState`, `useEffect`, `useId`, `useRef`, `useSyncExternalStore`,
  `useContext`.
- A purely presentational component does **not** get one, even if it takes an
  `onClick`. It works on both sides that way; the caller passing the handler is
  the boundary.
- `src/index.ts` never gets one. A directive on the barrel makes the entire
  package a client boundary for every consumer.

`src/boundaries.test.ts` asserts exactly this, in both directions, and then
asserts that the directives survive into `dist/`. It is not a formality — it
is the only thing standing between a stray `useState` and every consumer's
bundle growing silently. **Run `pnpm test` after adding or changing a
component.**

Adding state to an existing server-safe component is a real decision, not a
detail: it moves that component and everything rendered with it into the client
graph. Prefer lifting the state into a hook the consumer calls.

## Where a component's files go

Component, styles and story share one folder under `src/components` — see
[Where stories go](../../AGENTS.md#where-stories-go) for the rule and its one
exception. This package has components, so it applies here in full: there is no
`src/stories` directory.

The theme decorator and the package overview live in `.storybook`, with the
configuration they belong to.

## Styling

**Which token to reach for is answered by the
[`tokens` skill](../theme/.claude/skills/tokens/SKILL.md).** It sits in the theme
package, so a directory-scoped tool will not surface it while you are working
here — open it anyway; this is the package where those decisions are actually
made.

- Styles live in a `.css.ts` next to the component and read `vars` from
  `@trailpack-ui/theme`. Never write a hex value here — if a token is missing,
  it is added in the theme package, with its guidance entry and generators. See
  [that package's rules](../theme/README.md).
- `styleVariants(vars.tone, …)` is how tone variants are built, so a tone added
  to the theme cannot arrive half-supported.
- Every interactive state is qualified with `:not(:disabled)`. A disabled
  control still receives `:hover`.
- `className` on a component is appended through `cx`, never replaced —
  consumers rely on being able to add to it.

## The build

- **`preserveModules` is load-bearing, not an optimisation.** It is what allows
  per-module directives. Do not collapse the output into a single bundle.
- **`dist/styles.css` is an export path in `package.json`, so its filename is
  public API.** It is pinned via `build.lib.cssFileName`; nothing in the output
  may be content-hashed.
- **What gets published is whatever `src/index.ts` reaches.**
  `tsconfig.build.json` narrows `include` to that one entry, so stories and
  tests are never in the program. A new export path in `package.json` needs a
  new entry there too.
- `react` and `@trailpack-ui/theme` are **peer** dependencies and must stay
  that way. The theme especially: a second copy means mismatched
  vanilla-extract hashes and silently unstyled components. They are listed
  under `devDependencies` as well so the package can build and run its
  Storybook.
- `packages/theme` must be built before this package builds or its Storybook
  starts. From the root, Turborepo handles the ordering.

## Tests

`pnpm test` runs against `dist/`, so the package's own `turbo.json` adds
`build` to the `test` task's `dependsOn` — the root config only waits for
_dependencies'_ builds. If a test starts failing on a missing `dist/` file,
that wiring is what to check.
