# @trailpack-ui/react

React components, hooks and utilities for Trailpack projects, styled with the
tokens from [`@trailpack-ui/theme`](../theme) via
[vanilla-extract](https://vanilla-extract.style).

This is the package for everything React needs and nothing needs a heavy
dependency for. Anything that would pull in a large one — a data grid, a date
picker, a charting layer — gets its own package rather than a slot here.

It is being built up one component at a time. `Button` is what exists so far;
the structure around it — the token styling, the client-boundary rules, the
build — is settled, so a new component is a new folder under `src/components`
and nothing else.

**It renders on the server and in the browser, in any React setup.** Next.js App
Router is supported specifically, but not required, and nothing here is written
against it — see [Server rendering and Next.js](#server-rendering-and-nextjs).

## Install

```sh
pnpm add @trailpack-ui/react @trailpack-ui/theme react
```

`react` and `@trailpack-ui/theme` are **peer dependencies**, so they are
installed by you rather than nested underneath this package. For React that is
the usual reason — two copies of React in one tree do not work. For the theme
the reason is specific to how the tokens are built:

> The `vars` object holds vanilla-extract's hashed variable names, and this
> package inlines those hashes into its stylesheet at build time. If the app
> loads `theme.css` from a _different_ theme version, the names on the two sides
> no longer agree and every component renders unstyled — with no error, in the
> browser, at runtime. A peer dependency turns that into an install-time
> warning instead.

Keep the two versions in step.

## Usage

Import both stylesheets once, at the root of your app. Order matters only in
that the theme carries the variables the components read:

```ts
import '@trailpack-ui/theme/theme.css';
import '@trailpack-ui/react/styles.css';
```

Then:

```tsx
import { Button } from '@trailpack-ui/react';

export const Actions = () => (
  <>
    <Button tone="accent">Continue</Button>
    <Button tone="neutral" variant="ghost">
      Cancel
    </Button>
  </>
);
```

Dark mode is the theme's, unchanged: put `darkTheme` on any element and
everything below it switches. See the [theme README](../theme#dark-mode).

### Entry points

Everything is reachable from the package root. The two subpaths export the same
symbols, grouped:

```ts
import { Button } from '@trailpack-ui/react/components';
import { cx } from '@trailpack-ui/react/utils';
```

Reach for them when you want the grouping to be visible at the import site.
They are not needed for tree-shaking: the build emits one file per module and
the package declares `sideEffects: ["*.css"]`, so a bundler drops what you do
not use whichever path you import from. `styles.css` is unaffected either way —
it stays one stylesheet, imported once.

## Server rendering and Next.js

`'use client'` is often read as "this does not render on the server". It does
not mean that. It marks a **boundary**: a Client Component is still rendered to
HTML on the server, and _additionally_ shipped to the browser and hydrated. What
it costs is the JavaScript, not the server pass.

So this package puts the directive on the modules that genuinely need it, and
nowhere else. **Right now that is no module at all**: nothing here calls
React's runtime, so the package carries no `'use client'` and is server-safe
end to end. The rule is what matters, because the first component that holds
state changes the picture:

| Module                           | Directive | Why                                                |
| -------------------------------- | --------- | -------------------------------------------------- |
| `Button`, `cx`                   | no        | No state, no effects, no browser APIs              |
| a module calling React's runtime | **yes**   | `useState`, `useEffect`, `useSyncExternalStore`, … |

The consequence is worth being precise about, because it is the whole point:

- In a **Server Component**, `<Button>` renders to HTML and ships **zero
  JavaScript**. It is a Server Component itself.
- Pass an `onClick` and the _caller_ becomes the client boundary — `Button`
  joins that graph on its own, without a directive of its own. That is why a
  purely presentational component is better off without one: it works on both
  sides, and only pays where it is used interactively.
- A component that holds its own state is the other case: it carries the
  directive and is a client boundary wherever it appears. A Server Component
  may still render it, and its HTML arrives in the first response.

**The barrel is deliberately not a boundary.** `src/index.ts` carries no
directive, so importing from `@trailpack-ui/react` in a Server Component does
not drag the whole package into the client bundle — the directives are per
module and the module graph decides.

### Outside Next.js

`'use client'` is a string literal at the top of a file. A bundler without an
RSC graph — a Vite SPA, Remix, Astro, webpack — evaluates it as an expression
with no effect and moves on. **One build serves every target**; there is no
separate server build and no `react-server` export condition.

The only trace it leaves elsewhere is that some bundlers warn that module-level
directives have no effect when bundling. Cosmetic, and suppressible.

Worth separating, because the two get conflated: **SSR is not RSC.** Rendering
to HTML on a server — Remix, Astro, the Next Pages Router, your own
`renderToString` — works throughout this package regardless of any directive.
The directive only ever concerns React Server Components.

## API

**Components** — `Button`, in every tone the token set carries, with `solid`,
`subtle` and `ghost` variants and three sizes.

Components take the props of the element they render, so `className`, `ref`,
`id`, `aria-*` and handlers pass straight through. `className` is appended, not
replaced.

**Utilities** — `cx`, which joins class names and drops the falsy ones.

`ToneName` is re-exported from the theme, so a consumer can type a tone prop
without depending on the theme's JavaScript entry point directly.

Tones come from the token set — `accent`, `neutral`, `info`, `success`,
`warning`, `danger` — and every pairing a component uses is asserted against
WCAG AA in the theme package, in both themes. See
[TOKENS.md](../theme/generated/TOKENS.md).

## Development

```sh
pnpm dev              # Storybook on :6007
pnpm build            # dist/ — one file per module, styles.css and declarations
pnpm build:storybook  # storybook-static/
pnpm lint
pnpm test             # vitest — no suites at present, see below
pnpm format
```

`packages/theme` has to be built first — Storybook and the build both consume
its `dist`, exactly as a consuming app would. From the root, `pnpm build`
handles that ordering through Turborepo.

The package has no test suites right now. It had one, `src/boundaries.test.ts`,
which asserted the `'use client'` rule above in both directions and checked
that the directives survived into `dist/`; it went when the two hooks that were
its only client modules did. Nothing enforces the rule automatically today — a
misplaced directive is caught by review, not by CI. Worth restoring the test
along with the first module that carries one, and note that it read `dist/`, so
it needed a `turbo.json` in this package adding `build` to the `test` task's
`dependsOn`.

### Why the build emits one file per module

`build.rollupOptions.output.preserveModules` is not an optimisation here, it is
a requirement. Bundled into a single `index.js` there would be exactly one place
to put a directive — and therefore only the choice between "the entire package
is a client boundary" and "none of it is". Per-module output is what lets a
stateful module carry one while `Button` does not.

Vite 8 (on Rolldown) preserves the directives as they are; no plugin is needed
for it. That it keeps doing so is currently unverified — see the note on the
missing test above.

### Why the CSS filename is pinned

`dist/styles.css` is an export path in `package.json`, so its filename is public
API. `build.lib.cssFileName` pins it; nothing in the build output may be
content-hashed.

### Why React 19

Refs are plain props there, so components need no `forwardRef` wrapper and their
types stay legible. Supporting React 18 as well would mean reintroducing that
wrapper everywhere — reversible, but not for free.

### Storybook

`pnpm dev` opens on **Overview**, which is this file, rendered the same way the
theme package does it. The components are under **Components**, with the light
and dark toolbar switch driving the same class swap a consuming app performs.

**A story lives beside the component it documents**, in that component's folder
under `src/components` — there is no separate stories directory. A component
that needs written documentation beyond its stories gets a `storybook/` folder
next to them for the MDX; nothing else goes there. The overview page and the
theme decorator are the exceptions and sit in `.storybook`, since they belong
to the Storybook setup rather than to any one component.

```
src/components/Button/
  Button.tsx
  Button.css.ts
  Button.stories.tsx
```

Nothing verifies that a story _renders_. `pnpm build:storybook` only bundles
them, so a story that throws fails in the browser rather than in CI.

React, Storybook and vanilla-extract are `devDependencies`, and `files` ships
only `dist`. The published package carries no build tooling; consumers need no
vanilla-extract setup, because the `.css.ts` files are evaluated here and what
ships is a plain stylesheet.
