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
object holding `var(--…)` strings. The tokens work in any setup — React, Svelte,
plain HTML — with no bundler plugin and no vanilla-extract package.

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

The variable names themselves are vanilla-extract's hashes, so they are not
meant to be typed out in a hand-written stylesheet — go through `vars`.

The set is meant to be complete enough to style a whole application with,
without reaching for a hex value.

| Scale       | Keys                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| `color`     | `background`, `foreground`, `surface`, `muted`, `mutedForeground`, `border`, `borderStrong`, `ring`, `overlay` |
| `tone`      | `accent`, `neutral`, `danger`, `success`, `warning`, `info` — see below                                        |
| `space`     | `0`–`24`, numeric: the key × 4px, in `rem`                                                                     |
| `radius`    | `xs`, `sm`, `md`, `lg`, `xl`, `full`                                                                           |
| `iconSize`  | `sm`, `md`, `lg`, `xl`                                                                                         |
| `focusRing` | `width`, `offset` (the colour is `color.ring`)                                                                 |
| `font`      | `family`, `size`, `weight`, `lineHeight`, `letterSpacing`                                                      |
| `shadow`    | `xs`, `sm`, `md`, `lg`, `xl`                                                                                   |
| `zIndex`    | `base`, `dropdown`, `sticky`, `overlay`, `modal`, `popover`, `toast`                                           |

### Tones

A tone is one meaning — brand, danger, success — in all the forms a component
needs it. Every tone has the same nine steps, so anything that varies across
tones can be written once:

| Step                                 | For                                           |
| ------------------------------------ | --------------------------------------------- |
| `solid`, `solidHover`, `solidActive` | filled button or badge background             |
| `onSolid`                            | text and icons on those                       |
| `subtle`, `subtleHover`              | soft alert or badge fill                      |
| `onSubtle`                           | text on those                                 |
| `text`                               | the tone as text on a page surface            |
| `border`                             | outline of a subtle fill, or a tinted divider |

`text` is separate from `solid` on purpose: `tone.warning.solid` is an amber
that sits at roughly 2:1 on white, so an inline validation message needs its own
value. Every pairing in that table is asserted against WCAG AA in
`src/themes.test.ts`, in both themes.

Because the steps are nested under the tone rather than flattened into
`accentSubtle` / `dangerSubtle`, a component can take the tone as a value and
index into it. `ToneName` is exported for that:

```tsx
import { type ToneName, vars } from '@trailpack-ui/theme';

export function Callout({ tone = 'info' }: { tone?: ToneName }) {
  return (
    <div
      style={{
        background: vars.tone[tone].subtle,
        color: vars.tone[tone].onSubtle,
        border: `1px solid ${vars.tone[tone].border}`,
      }}
    />
  );
}
```

The paths on `vars` are the public API; the variable names behind them are not,
and can change between releases. Overriding tokens to build a custom theme is
not supported yet — `createTheme` requires the whole contract, and there is no
helper for producing one.

## Development

```sh
pnpm build        # dist/ — index.js, theme.css and declarations
pnpm lint
pnpm test         # contrast assertions over both themes
pnpm format
```

### Why Vite library mode

vanilla-extract evaluates `.css.ts` modules at build time, which needs a real
bundler plugin. The Vite plugin is the officially maintained one — the
alternative (tsdown, on Rolldown) would need a vanilla-extract integration that
does not exist as a Rolldown plugin yet.

`build.lib.cssFileName` pins the emitted stylesheet to `theme.css` rather than
letting it follow the entry name, because that filename is an export path in
`package.json` and therefore public API.
