# AGENTS.md — packages/theme

Applies to `packages/theme`, on top of the [repository AGENTS.md](../../AGENTS.md).
That file's rules — arrow functions, the comment bar, where stories go, never
commit unasked, changesets on hold — hold here unchanged. This file covers what
is specific to this package.

## What this package is

The token contract: a light theme applied to `:root`, a dark theme as a class,
and an object of CSS variable references. It ships **no components and depends
on no UI library** — React and Storybook are `devDependencies`, `files` is
`["dist"]`, and that is what makes the tokens usable from any framework. Keep it
that way.

Several things about it are easy to break:

- **Token values are asserted, not decorative.** `src/themes.test.ts` checks
  every colour pairing the token set promises against WCAG AA, in both themes.
  Changing a hex value without running `pnpm test` is how a contrast regression
  gets in.
- **`dist/theme.css` is an export path in `package.json`, so its filename is
  public API.** It is pinned via `build.lib.cssFileName` in `vite.config.ts`;
  nothing in the build output may be content-hashed.
- **What gets published is whatever `src/index.ts` reaches.**
  `tsconfig.build.json` narrows `include` to that one entry, so the module graph
  decides the declaration output — `src/storybook`, `scripts` and `guidance.ts`
  are never in the program and need no exclusion, whether they sit under `src`
  or not. Adding a new export path to `package.json` is therefore the one case
  that also needs a new entry in `files` there.
- **Token usage guidance is written once, in `src/guidance.ts`.** The Storybook
  tables, `generated/TOKENS.md` and the agent skill are all renderings of it,
  the last two through the shared functions in `scripts/utils/renderGuidance.ts`.
  Never edit a generated file by hand.
- **`generate:skill` writes only outside this package.** It produces
  `skills/theme/SKILL.md` and `skills/theme/metadata.json` at the _repository
  root_ — the tool-neutral catalogue described in
  [`skills/README.md`](../../skills/README.md) — plus the pointer at
  `.claude/skills/theme/SKILL.md` that Claude Code loads. A change to
  `guidance.ts` therefore shows up in a diff two levels up, which is intended;
  `metadata.json` also picks up this package's `version`, so a release moves it
  with no edit.
- **`pnpm generate` runs both generators**, and every output has a test that
  fails if the committed copy is stale. So a new token means the token, the
  guidance and one command — in the same change, or the reference silently
  describes a set that no longer exists.

## A changed token reaches further than this package

`packages/react` inlines the hashed variable names into its own stylesheet at
build time. Renaming a token, or moving it in the contract, therefore breaks
that package's CSS — silently, because the names are values rather than
imports. Run the workspace build, not just this package's.

Removing a tone is the sharper case: `styleVariants(vars.tone, …)` over there is
built from the contract, so a tone that disappears takes a component variant
with it.

## Stories

This package ships no components, so its stories document the package itself
and live in `src/storybook` — the fallback the [root
rule](../../AGENTS.md#where-stories-go) describes, not an exception to it. The
components, contexts and helpers the reference is built from sit in that
folder's own `components/`, `contexts/` and `utils/`, so what lies flat beside
`tokens.stories.tsx` is stories and nothing else. The overview page that renders
`README.md` sits in `.storybook`, as it does in every package.

The stories style themselves with inline `vars` rather than `.css.ts` files, on
purpose: it keeps the reference honest about the package's central claim, that
the tokens work with no vanilla-extract and no bundler plugin in the consumer.
