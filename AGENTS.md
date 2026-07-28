# AGENTS.md

Guidance for AI agents working in this repository. Read this before making
changes; it documents conventions and pitfalls that are not obvious from the
code alone.

## What this is

A pnpm workspace monorepo for the Trailpack UI toolchain, orchestrated with
Turborepo. Packages are versioned with Changesets and published to npm under the
`@trailpack-ui` scope. See [README.md](README.md) for the layout and the command
list.

Each package owns its build, lint, format and test setup. The one edge between
them is that `react` takes `theme` as a peer dependency; there is no shared
config package, and one is not the default — add it only when something is
actually duplicated three times over.

**Every package has its own AGENTS.md, and this file carries only what applies
repository-wide.** Read the package's before changing anything in it — both
document a failure that is silent rather than loud:

- [`packages/theme`](packages/theme/AGENTS.md) — the token contract. Guidance is
  written once and rendered into three places, and a renamed token breaks
  `packages/react` without an error anywhere.
- [`packages/react`](packages/react/AGENTS.md) — whether a module carries
  `'use client'` decides what lands in a consumer's client bundle, and it is
  easy to get wrong in a way nothing complains about.

A new package gets the same pair: an `AGENTS.md` beside its `package.json`, and
a `CLAUDE.md` that does nothing but `@AGENTS.md`.

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

## Functions

**Write arrow functions.** `const render = (x: string) => …` is the default
form everywhere — module scope, callbacks, components, test helpers.

Reach for the `function` keyword only where it buys something the arrow cannot:

- **Hoisting**, when a function is genuinely used above its definition and
  reordering the file would make it read worse.
- **`this`**, when a caller binds it — a plugin hook, a `mocha`-style callback.
- **Generators**, which have no arrow form.
- **Overload signatures**, which have to be declarations.

"It has always been written that way" is not one of those. If a `function` in a
diff has no such reason, it is an arrow.

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

## Where stories go

A story lives next to what it documents, not in a directory that exists only to
hold stories.

For a package that ships components, that is the component's own folder:

```
src/components/Button/
  Button.tsx
  Button.css.ts
  Button.stories.tsx
  storybook/            only when the component needs custom documentation
    Button.mdx
```

The `storybook/` folder is the one exception, and only for prose that does not
fit in the stories themselves — usage rules, dos and don'ts, migration notes. A
component without such a page does not get an empty folder.

A story that documents no component in particular belongs with the Storybook
configuration in `.storybook`. The package overview — the MDX that renders
`README.md` as the landing page — is the case both packages have.

`packages/theme` keeps a `src/stories` directory, and that is not an exception:
it ships no components, so its stories document the package itself and have no
folder to sit beside. In a package that *does* have components, reintroducing
that directory is not a shortcut — it separates a story from the thing it
documents, which is how the two drift apart.

Story helpers stay inside the story that uses them until a second story
genuinely needs the same thing. A shared helper module for one caller is
indirection without a reason.
