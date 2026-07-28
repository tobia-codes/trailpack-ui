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
- No barrel ever gets one — not `src/index.ts`, not the per-group
  `src/{components,utils}/index.ts` behind the subpath exports. A directive
  there makes everything imported through it a client boundary for every
  consumer.

**Nothing enforces this automatically.** `src/boundaries.test.ts` used to, in
both directions and through into `dist/`; it was removed along with the two
hooks that were its only client modules. Today the package contains no
`'use client'` at all and is server-safe end to end, so the rule is upheld by
reading it — and a stray `useState` would grow every consumer's bundle with no
error anywhere. **The first module that needs the directive should bring the
test back**, along with a `turbo.json` here adding `build` to the `test` task's
`dependsOn`, because it reads `dist/`.

Adding state to an existing server-safe component is a real decision, not a
detail: it moves that component and everything rendered with it into the client
graph. Prefer lifting the state into a hook the consumer calls — the package
has no `src/hooks` at the moment, so that means creating it, with its own
barrel and a `./hooks` export path.

## Where a component's files go

Component, styles and story share one folder under `src/components` — see
[Where stories go](../../AGENTS.md#where-stories-go) for the rule and its one
exception. This package has components, so it applies here in full: there is no
`src/stories` directory.

The theme decorator and the package overview live in `.storybook`, with the
configuration they belong to.

## Styling

**Which token to reach for is answered by the
[`theme` skill](../../skills/theme/SKILL.md).** It lives at the repository root
rather than in either package, so it applies here as much as in
`packages/theme` — which matters, because this is the package where those
decisions are actually made.

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
- **What gets published is whatever the entry points reach.**
  `tsconfig.build.json` narrows `include` to them, so stories and tests are
  never in the program. The package has three — `src/index.ts` and the two
  group barrels behind `./components` and `./utils` — and they are listed in
  **three** places that have to agree: `exports` in `package.json`,
  `build.lib.entry` in `vite.config.ts`, `include` in `tsconfig.build.json`.
  Miss the last one and the subpath ships without declarations, which nothing
  fails on until a consumer imports it.
- **A new component or hook is exported from its group barrel, not from
  `src/index.ts`.** The root re-exports the groups with `export *`; exporting
  in both places is how a symbol ends up published twice.
- `react` and `@trailpack-ui/theme` are **peer** dependencies and must stay
  that way. The theme especially: a second copy means mismatched
  vanilla-extract hashes and silently unstyled components. They are listed
  under `devDependencies` as well so the package can build and run its
  Storybook.
- `packages/theme` must be built before this package builds or its Storybook
  starts. From the root, Turborepo handles the ordering.

## Tests

There are none at present, and `test` carries `--passWithNoTests` so the script
and the Turborepo task stay green. Vitest is still installed, so a suite is one
file away.

A test that reads `dist/` — the removed boundary test did — needs a `turbo.json`
in this package adding `build` to the `test` task's `dependsOn`. The root config
only waits for _dependencies'_ builds, not this package's own. If a test starts
failing on a missing `dist/` file, that wiring is what is missing.
