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

A component that needs smaller components of its own keeps them in a
`components/` folder beneath it, each in the same folder-per-component shape:

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

**Nesting is what marks them private.** They exist for the one component above
them; a subcomponent that turns out to be useful elsewhere moves up to
`src/components` rather than being imported sideways out of another component's
folder. Helpers and types follow the same shape — see
[Where utilities and types go](../../AGENTS.md#where-utilities-and-types-go) for
the level to put them at.

**Nothing nested is exported from `src/components/index.ts`.** That barrel is
the `./components` subpath in `package.json`, so anything reachable through it
is published API a consumer may depend on — and a subcomponent exported there is
one nobody decided to ship. The same holds for `src/utils/index.ts` behind
`./utils`: a component-local `utils/` folder is private, the package-level one
is public surface.

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

**A test is written when one is asked for** — see [Tests are asked for, never
written alongside the code](../../AGENTS.md#tests-are-asked-for-never-written-alongside-the-code).
The [`testing` skill](.claude/skills/testing/SKILL.md) has the shape a test
takes; this section carries only what breaks silently.

The harness is Vitest with `happy-dom`, Testing Library and `vitest-axe`,
configured in the `test` block of `vite.config.ts`. `test` keeps
`--passWithNoTests` so the Turborepo task stays green if the suite ever empties
out.

- **Test infrastructure lives in `src/tests/`, and nothing outside a test file
  may import from it. Nothing enforces that.** A component importing
  `@tests/utils/checkA11y` builds cleanly and emits `dist/tests/…`, which then
  ships: `files: ["dist"]` filters by path, not by meaning, so anything that
  reaches `dist` is published. Test files themselves are safe wherever they sit
  — nothing imports them, so the build never reaches them. It is the helpers
  that leak. Holding this folder outside `src` would have turned that mistake
  into a `TS6059` build failure through `rootDir`; it sits inside by choice, so
  the rule is upheld by reading.
- **A test helper may never go in `src/utils`.** That folder is the `./utils`
  subpath export, so anything in it is published API by design rather than by
  accident.
- Tests reach the folder through the `@tests` alias, declared in `test.alias` in
  `vite.config.ts` **and** in `tsconfig.json`'s `paths`. Both, or the editor and
  the runner disagree about the same import.
- **`tests/setup.ts` calls `afterEach(cleanup)` and that call is load-bearing.**
  Testing Library only registers its own cleanup when it can see a global
  `afterEach`, and this package runs without `globals`. Drop it and every render
  in a file stays mounted — scoped queries carry on working, so what surfaces is
  axe failing on a previous test's markup.
- **The `vanillaExtractPlugin` in `vite.config.ts` is what lets a test import a
  component at all.** Vitest reads that config, so anything reaching a `.css.ts`
  fails outright without it.
- **Never edit a `version` field to satisfy a test**, and do not reach for
  `axe.configure` or rule-disabling to quiet a violation. A violation is a bug
  in the component's markup.

A test that reads `dist/` — the removed boundary test did — needs a `turbo.json`
in this package adding `build` to the `test` task's `dependsOn`. The root config
only waits for _dependencies'_ builds, not this package's own. If a test starts
failing on a missing `dist/` file, that wiring is what is missing.
