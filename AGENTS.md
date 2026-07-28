# AGENTS.md

Guidance for AI agents working in this repository. Read this before making
changes; it documents conventions and pitfalls that are not obvious from the
code alone.

## What this is

A pnpm workspace monorepo for the Trailpack UI toolchain, orchestrated with
Turborepo. Packages are versioned with Changesets and published to npm under the
`@trailpack-ui` scope. See [README.md](README.md) for the layout and the command
list.

Packages here are **self-contained**: each owns its build, lint, format and test
setup, and none depends on another. A shared config package is not the default —
add one only when something is actually duplicated three times over.

## Environment

- **pnpm 11** and **Node 24**. Always use `pnpm` to install and run scripts.
- Never run `npm install` or `yarn` — it would produce a competing lockfile.

## Critical: npm cannot run from the repository root

The root `package.json` declares `devEngines.packageManager = pnpm`. As a
result **every** `npm` command invoked with the repository root as its working
directory exits with `EBADDEVENGINES`, including read-only ones:

```sh
npm view vite version                       # from the root  → exit 1, EBADDEVENGINES
cd packages/theme && npm view vite version  #                → exit 0
```

Always `cd` into a package directory before running `npm`.

## Git

**Never commit without being asked.** Make the changes, leave them in the
working tree, and report what was changed. Committing is the maintainer's step,
and an unrequested commit forces them to undo it before they can review or
reshape the work. The same applies to `git push`, branch creation, tags and any
other operation that publishes state — including staging with `git add`, which
is only useful as a prelude to a commit.

"Commit this" authorises exactly the commit being discussed, not the ones after
it. Ask again for the next one.

## Changesets

**Changesets are on hold for now — ignore them entirely.** Nothing has been
published yet, so there is no released version for a bump to be relative to and
no consumer for a changelog entry to inform. Adding one per change at this stage
is pure overhead.

So: do not create a changeset, and do not suggest one either. The setup stays in
the repository and is picked up again once the first release approaches; the
maintainer will say when that is.

When that happens, the rule reverts to: never create a changeset unless asked.
The bump level is a release decision, not a mechanical consequence of the diff —
a removed export is formally a `major`, but the maintainer may still want it
released as a `minor`, because pre-1.0 a `major` means committing to 1.0.0.

## Two rules that apply to every change

- **Never edit a `version` field by hand.** Versions are derived from changesets;
  a manual bump desynchronises the pipeline.
- **Never remove `repository`, `publishConfig` or `files` from a published
  package's `package.json`.** Each one causes a failure only much later, at
  publish time.

## Comments

**Write a comment only when the code cannot carry the point itself.** Comments
are not free: they take up reading space, they go stale silently, and a file
padded with them takes longer to understand than the same file without.

The bar is *why*, not *what*. A comment earns its place when it records
something the reader cannot recover from the code — a constraint from outside
the file, an alternative that was tried and rejected, a consequence that only
shows up somewhere else. Everything else is noise:

- Restating the code in prose (`// increment the counter`).
- Captioning an obvious block (`// imports`, `// helper functions`).
- Repeating a name that is already descriptive.
- Documenting what a change *is*. That belongs in the commit message.

Keep length in proportion. A paragraph above four lines of configuration is a
sign the reasoning belongs in the README or a commit message, not inline — and
if it must stay inline, it can almost always be two lines instead of ten.

Do not narrate absence. Explaining why something is *not* in the file is worth
it only when a reader is genuinely likely to add it back and break something;
otherwise it is a comment about a file that does not exist.

Same rule when editing: if a change makes an existing comment wrong, fix it or
delete it. A stale comment is worse than none, because it is trusted.

None of this restricts doc comments on exported API — a `/** */` on an exported
symbol is part of the package's surface, and those stay.

## The theme package

`packages/theme` is the token contract. Three things about it are easy to break:

- **Token values are asserted, not decorative.** `src/themes.test.ts` checks
  every colour pairing the token set promises against WCAG AA, in both themes.
  Changing a hex value without running `pnpm test` is how a contrast regression
  gets in.
- **`dist/theme.css` is an export path in `package.json`, so its filename is
  public API.** It is pinned via `build.lib.cssFileName` in `vite.config.ts`;
  nothing in the build output may be content-hashed.
- **What gets published is whatever `src/index.ts` reaches.**
  `tsconfig.build.json` narrows `include` to that one entry, so the module graph
  decides the declaration output — stories, scripts and `guidance.ts` are never
  in the program and need no exclusion. Adding a new export path to
  `package.json` is therefore the one case that also needs a new entry in
  `files` there. The package is framework-agnostic in what it ships: React and
  Storybook are `devDependencies`, and `files` is `["dist"]`. Keep it that way.
- **Token usage guidance is written once, in `src/guidance.ts`.** The Storybook
  tables and the generated agent skill at `.claude/skills/tokens/SKILL.md` are
  both renderings of it. Never edit the skill by hand — run `pnpm
  generate:skill`; a test fails if the committed file is stale. Adding or
  changing a token means updating the guidance in the same change, or the
  reference silently describes a set that no longer exists.
