# @trailpack-ui/theme

Design tokens for Trailpack projects, built with
[vanilla-extract](https://vanilla-extract.style). Ships a token contract, a
light theme applied to `:root`, and a dark theme as a class.

This package is **framework-agnostic**. It contains no components and depends on
no UI library — just a stylesheet and an object of CSS variable references.

## Install

```sh
pnpm add @trailpack-ui/theme
```

**vanilla-extract is not required in the consuming app.** The `.css.ts` files are
evaluated here at build time; what ships is a plain stylesheet plus a token
object holding `var(--…)` strings. `dist/index.js` has no imports at all — the
tokens work in any setup that can read a value from JavaScript, with no bundler
plugin and no vanilla-extract package. What they do not work in is a
hand-written `.css` file — see
[Where the tokens reach](#where-the-tokens-reach-and-where-they-do-not).

You only need vanilla-extract in your app if you want to write your _own_
`.css.ts` files against these tokens — and then it is your dependency, on your
terms, not something this package imposes. See [Tokens](#tokens).

## Usage

Import the stylesheet once, at the root of your app. It carries the light theme
applied to `:root`:

```ts
import '@trailpack-ui/theme/theme.css';
```

## Dark mode

Dark mode is a class you put on any element; everything below it switches.

```tsx
import { darkTheme } from '@trailpack-ui/theme';

<div className={darkTheme}>{/* tokens resolve to their dark values in here */}</div>;
```

Apply it to `<html>` for a whole-app switch, or to a subtree to invert just one
section.

## Tokens

`vars` is the token contract — an object of CSS variable references, usable in
your own `.css.ts` files:

```ts
// Card.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '@trailpack-ui/theme';

export const card = style({
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: vars.space[6],
  boxShadow: vars.shadow.sm,
});
```

That snippet is the one case where the app needs its own vanilla-extract setup
(`@vanilla-extract/css` plus a bundler plugin) — because `style()` comes from
there, not from here.

Because `vars` holds plain `var(--…)` strings, it also works in inline styles,
with nothing installed:

```tsx
<div style={{ background: vars.tone.info.subtle, color: vars.tone.info.onSubtle }} />
```

### Where the tokens reach, and where they do not

Both the variable names and the `darkTheme` class name are vanilla-extract
hashes — but they ship as _values_, which is why the hashing is invisible as
long as you go through `vars` and `darkTheme`.

| Context                                | Works                                                       |
| -------------------------------------- | ----------------------------------------------------------- |
| Inline styles, CSS-in-JS, any JS value | Yes, with nothing installed                                 |
| Your own `.css.ts`                     | Yes, but `style()` means vanilla-extract becomes your dep   |
| A hand-written `.css` or `.scss` file  | **No** — it cannot import `vars`, and the names are not API |

The hashes are deterministic across rebuilds, but they are not part of the
public API: they shift if the file path, the package name or the declaration
order changes. So a plain stylesheet has nothing stable to type.

If you need the tokens in hand-written CSS anyway, alias them once at startup
into names you own, and use those:

```ts
document.documentElement.style.setProperty('--app-surface', vars.color.surface);
```

### The token set

Nine scales — `color`, `tone`, `space`, `radius`, `iconSize`, `focusRing`,
`font`, `shadow`, `zIndex` — meant to be complete enough to style a whole
application with, without reaching for a hex value.

**[TOKENS.md](generated/TOKENS.md)** is the reference: every token, with the rule
for when to reach for it. `pnpm dev` shows the same thing with the values
rendered in both themes — see [Storybook](#storybook).

### Tones

A tone is one meaning — brand, danger, success — in all the forms a component
needs it: a filled step and the text that sits on it, a soft step and the text
on that, a text step for use on a page surface, a border. Every tone carries the
same nine, and every pairing the set promises is asserted against WCAG AA in
`src/themes.test.ts`, in both themes.

Because the steps are nested under the tone rather than flattened into
`accentSubtle` / `dangerSubtle`, a component can take the tone as a value and
index into it. `ToneName` is exported for that:

```tsx
import { type ToneName, vars } from '@trailpack-ui/theme';

export const Callout = ({ tone = 'info' }: { tone?: ToneName }) => {
  return (
    <div
      style={{
        background: vars.tone[tone].subtle,
        color: vars.tone[tone].onSubtle,
        border: `1px solid ${vars.tone[tone].border}`,
      }}
    />
  );
};
```

The paths on `vars` are the public API; the variable names behind them are not,
and can change between releases. Overriding tokens to build a custom theme is
not supported yet — `createTheme` requires the whole contract, and there is no
helper for producing one.

## Development

```sh
pnpm dev              # Storybook on :6006 — the token reference
pnpm build            # dist/ — index.js, theme.css and declarations
pnpm build:storybook  # storybook-static/
pnpm generate         # both generators below
pnpm generate:tokens  # rewrite generated/TOKENS.md from src/guidance.ts
pnpm generate:skill   # rewrite both copies of the tokens skill from src/guidance.ts
pnpm lint
pnpm test             # contrast assertions, generated-doc freshness
pnpm format
```

### Generated documentation

The rules for _when_ to reach for a token live in `src/guidance.ts`, as data.
Three things render them, and none of them owns them:

- `generated/TOKENS.md`, the reference a person reads;
- the agent skill, which is what an agent reads when writing UI code against
  this package;
- the Storybook stories, as the "use it for" tables.

The first two are the same guidance in a different frame — the skill opens with
rules addressed to whoever is writing the code, `generated/TOKENS.md` with where
it sits among the others. They render through the same functions in
`scripts/lib/renderGuidance.ts`, so they cannot differ in shape either.
`pnpm generate` writes both.

The skill lands in two places, byte-identical: `.claude/skills/tokens/SKILL.md`,
where Claude Code finds it for work in this repository, and
[`skills/tokens/`](../../skills/README.md) at the repository root, the
tool-neutral catalogue a consumer of the published package copies from. The
second gets a `metadata.json` alongside it, whose `packageVersion` range is
derived from this package's `version` — so a copy that has fallen behind can be
recognised, and nothing about it is hand-maintained.

Prose in the guidance marks code with backticks, because every renderer needs it
— Storybook turns them into `<code>`, markdown leaves them alone. Avoid `|`,
which would split a generated table row.

Each generator has a test beside it that fails if any committed output no longer
matches the guidance, so they cannot drift apart silently. The outputs inside
this package are excluded from `oxfmt` via `ignorePatterns` in
`oxfmt.config.mts` — formatting a generated file would make it differ from what
the generator produces and fail that test on the next run. The root catalogue
needs no such entry: it sits outside this package, and no formatter runs there.

`guidance.ts` is not part of the runtime API, and neither is `src/stories`.
Living under `src` does not put them in the package: `tsconfig.build.json` builds
from `src/index.ts` alone, so anything the entry point does not import is not in
the program, and `files` ships only `dist`.

### Storybook

`pnpm dev` opens on **Overview**, which is this file: `.storybook/readme.mdx`
reads it with Vite's `?raw` and hands it to the `Markdown` block from
`@storybook/addon-docs`, so the landing page cannot fall behind the README.
Relative links are rewritten to the repository there, since they would otherwise
resolve against Storybook's own URL.

It lives with the Storybook configuration rather than under `src/stories`
because it documents the package rather than any one story — the same split
`packages/react` makes.

The token reference itself is under **Foundations → Tokens**: the same guidance
as [TOKENS.md](generated/TOKENS.md), but with every token rendered at its real
value next to the rule for it.

The toolbar switches between light and dark, and the values printed under each
swatch follow — the class swap is exactly the one a consuming app does, so what
you see is what the tokens resolve to.

One thing about how the stories are built is deliberate: **they style themselves
with inline `vars`**, not with `.css.ts` files. That keeps the reference honest
about the package's central claim — that the tokens work with no
vanilla-extract and no bundler plugin in the consumer.

Nothing verifies that a story _renders_. `pnpm build:storybook` only bundles
them, so a story that throws fails in the browser rather than in CI.

React and Storybook are `devDependencies` here, and `files` ships only `dist`.
The published package stays framework-agnostic; nothing from the stories
reaches a consumer.

### Why Vite library mode

vanilla-extract evaluates `.css.ts` modules at build time, which needs a real
bundler plugin. The Vite plugin is the officially maintained one — the
alternative (tsdown, on Rolldown) would need a vanilla-extract integration that
does not exist as a Rolldown plugin yet.

`build.lib.cssFileName` pins the emitted stylesheet to `theme.css` rather than
letting it follow the entry name, because that filename is an export path in
`package.json` and therefore public API.
