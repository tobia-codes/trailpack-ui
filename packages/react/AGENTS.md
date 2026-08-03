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
  `use`, `createContext`.
- A purely presentational component does **not** get one, even if it takes an
  `onClick`. It works on both sides that way; the caller passing the handler is
  the boundary.
- No barrel ever gets one — not `src/index.ts`, not the per-group
  `src/{components,utils}/index.ts` behind the subpath exports. A directive
  there makes everything imported through it a client boundary for every
  consumer.

**Nothing enforces this automatically.** The package has exactly one client
module, `src/utils/createStrictContext.ts`; everything else is server-safe, and
the rule is upheld by reading it. A stray `useState` would grow every
consumer's bundle with no error anywhere, and a directive that does not survive
the build into `dist/` fails just as quietly.

Adding state to an existing server-safe component is a real decision, not a
detail: it moves that component and everything rendered with it into the client
graph. Prefer lifting the state into a hook the consumer calls — the package
has no `src/hooks` at the moment, so that means creating it, with its own
barrel and a `./hooks` export path.

## Where a component's files go

Component, styles and story share one folder under `src/components` — see
[Where stories go](../../AGENTS.md#where-stories-go) for the rule and its one
exception. This package has components, so it applies here in full: there is no
`src/storybook` directory. The theme decorator and the package overview live in
`.storybook`, with the configuration they belong to.

A component that needs smaller components of its own keeps them in a
`components/` folder beneath it, each in the same folder-per-component shape;
[`add-component`](.claude/skills/add-component/SKILL.md) has the tree.

**Nesting is what marks them private.** They exist for the one component above
them; a subcomponent that turns out to be useful elsewhere moves up to
`src/components` rather than being imported sideways out of another component's
folder. Helpers, types and contexts follow the same shape — see [Where
utilities, types and contexts
go](../../AGENTS.md#where-utilities-types-and-contexts-go) for the level to put
them at.

**Nothing nested is exported from `src/components/index.ts`.** That barrel is
the `./components` subpath in `package.json`, so anything reachable through it
is published API a consumer may depend on — and a subcomponent exported there is
one nobody decided to ship. The same holds for `src/utils/index.ts` behind
`./utils`: a component-local `utils/` folder is private, the package-level one
is public surface.

**What two components share but nobody decided to ship goes in `src/internal/`,
not `src/utils`.** The kind still picks the folder beneath it —
`src/internal/utils/`, `src/internal/types/` — so `internal/` sorts by
visibility and does not become a drawer of its own. It gets
no barrel, no `exports` entry and no line in `vite.config.ts` or
`tsconfig.build.json`. Whatever a component imports still lands in `dist/`, and
that is fine: the `exports` map has no wildcard, so no consumer can name the
path. Moving a helper into `src/utils` is the decision to ship it, and it is
made once, when the file is placed — not later, by adding a line to a barrel.

**`src/internal/` and `src/tests/` do not merge.** Any module may import from
`internal/`; only a test file may import from `tests/`, because a component
reaching into it publishes the helper. One folder over both would hide that.

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

**A variant type is declared with the component, never derived from its
stylesheet.** `ButtonVariant` is a union written in `Button.tsx`, and the
stylesheet's exports are annotated against it — in `Button.css.ts`, not at the
point of use:

```ts
import type { ButtonSize, ButtonVariant } from './Button';

export const size: Record<ButtonSize, string> = styleVariants({ … });
export const variant: Record<ButtonVariant, Record<ToneName, string>> = { solid, subtle, ghost };
```

`keyof typeof styles.variant` reads as the same thing and is not. It makes the
published API a byproduct of a stylesheet — renaming a key there becomes a
breaking change nobody sees coming, and the emitted `.d.ts` drags the `.css.ts`
along to resolve the type. The annotation runs the check the other way instead:
a variant with no style fails the build, an unused style is only dead CSS.

The import back into the stylesheet is type-only, so the cycle it closes is
erased before either the bundler or the vanilla-extract compiler sees it, and
the component's own `.d.ts` stays a plain union. Keeping it there rather than
re-annotating `styles.variant` in the component is what makes the error land in
the file that has to change, and leaves the component reading `styles.size[size]`
directly.

**The one exception is a set the theme owns**, which is the `vars.tone` bullet
above rather than a contradiction of this. `tone` stays `ToneName` because the
theme decides which tones exist; `variant` and `size` are this package's API and
are decided here.

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
  that way. The theme especially: a second copy at a different version means
  variable names inlined here that the loaded `theme.css` never declares, and a
  browser drops an undeclared variable silently. They are listed under
  `devDependencies` as well so the package can build and run its Storybook.
- `packages/theme` must be built before this package builds or its Storybook
  starts. From the root, Turborepo handles the ordering.

## Tests

**A test is written when one is asked for** — see [Tests are asked for, never
written alongside the code](../../AGENTS.md#tests-are-asked-for-never-written-alongside-the-code).
The [`testing` skill](.claude/skills/testing/SKILL.md) has the shape a test
takes; this section carries only what breaks silently.

The harness is Vitest with `happy-dom`, Testing Library and `vitest-axe`,
configured in the `test` block of `vite.config.ts`, which keeps
`--passWithNoTests` so the Turborepo task stays green if the suite empties out.

- **Test infrastructure lives in `src/tests/`, and nothing outside a test file
  may import from it. Nothing enforces that.** A component importing
  `@tests/utils/checkA11y` builds cleanly and emits `dist/tests/…`, which then
  ships: `files: ["dist"]` filters by path, not by meaning. Test files
  themselves are safe wherever they sit — nothing imports them, so the build
  never reaches them; it is the helpers that leak. The folder sits inside `src`
  by choice — outside it, `rootDir` would have turned that mistake into a
  `TS6059` build failure instead of a silent one.
- **A test helper may never go in `src/utils`.** That folder is the `./utils`
  subpath export, so anything in it is published API by design rather than by
  accident.
- Tests reach the folder through the `@tests` alias, declared in `test.alias` in
  `vite.config.ts` **and** in `tsconfig.json`'s `paths`. Both, or the editor and
  the runner disagree about the same import.
- **`src/tests/setup.ts` calls `afterEach(cleanup)` and that call is
  load-bearing.**
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

A test that reads `dist/` needs a `turbo.json` in this package adding `build` to
the `test` task's `dependsOn`; the root config only waits for _dependencies'_
builds, not this package's own. A test failing on a missing `dist/` file is
missing that wiring.
