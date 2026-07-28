# tokens

Which design token to reach for, when styling anything against
`@trailpack-ui/theme`.

The package ships a token contract rather than components: a light theme on
`:root`, a dark theme as a class, and a `vars` object of CSS variable
references. That leaves one question open on every line of UI code — *which*
token — and getting it wrong is quiet. A hard-coded `#7c3aed` renders correctly
until someone switches to the dark theme; a text colour on the wrong background
step passes review and fails WCAG AA.

[`SKILL.md`](SKILL.md) answers that question. It covers:

- the five rules that decide most cases — pick by role rather than appearance,
  stay inside the tested colour pairings, never type a `var(--…)` by hand;
- every token in the nine scales, each with the rule for when it applies;
- how to reach the tokens from inline styles, `.css.ts` files and plain
  JavaScript, and why hand-written `.css` cannot use them.

## When to install it

Any project that depends on `@trailpack-ui/theme` and has an agent writing or
reviewing UI code in it. It is worth having in front of a human reviewer too —
the contrast pairings in particular are not guessable.

It assumes nothing beyond the package. There is no vanilla-extract requirement
and no bundler plugin in the consumer; that is the package's central claim, and
the guidance stays inside it.

## Where it comes from

`SKILL.md` and `metadata.json` are generated from
`packages/theme/src/guidance.ts` by `pnpm generate:skill`, and a test fails if
either falls behind. The same source renders the Storybook token reference and
`packages/theme/generated/TOKENS.md`, which shows every token at its real value
in both themes.

So the guidance here cannot disagree with the reference, the stories, or the
tokens themselves. Edit `guidance.ts`, never these files.
