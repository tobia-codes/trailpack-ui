# AGENTS.md

Guidance for AI agents working in this repository. It carries the defaults you
would otherwise get wrong without noticing — read it before making changes.

## What this is

A pnpm workspace monorepo for the Trailpack UI toolchain, orchestrated with
Turborepo and published to npm under the `@trailpack-ui` scope. See
[README.md](README.md) for the layout, the commands and the release model.

**Every package has its own AGENTS.md; this file carries only what applies
repository-wide.** Read the package's before changing anything in it — both
document a failure that is silent rather than loud:

- [`packages/theme`](packages/theme/AGENTS.md) — a renamed token breaks
  `packages/react` with no error anywhere.
- [`packages/react`](packages/react/AGENTS.md) — whether a module carries
  `'use client'` decides what lands in a consumer's client bundle.

A new package gets the same pair: an `AGENTS.md` beside its `package.json`, and
a `CLAUDE.md` containing nothing but `@AGENTS.md`. If it brings a skill, list it
under [Skills](#skills) too — nothing generates that table.

There is no shared config package, and one is not the default — add it only when
something is actually duplicated three times over. That includes rules and
skills scoped to one package: hoist them on the second real case, rules into
this file before the skill that points at them.

## Skills

Some guidance is too long to keep here and is only needed for one kind of task.
It lives in `SKILL.md` files with a short YAML header. The directory name is
Claude Code's, but the files are plain markdown — **read the one that matches
what you are doing, whatever tool you are**:

| Skill | Read it when |
| --- | --- |
| [`tokens`](packages/theme/.claude/skills/tokens/SKILL.md) | Writing or reviewing UI code — which colour, spacing, radius, type or shadow token to reach for. Applies in `packages/react` as much as in `packages/theme`, despite where it sits. |
| [`add-component`](packages/react/.claude/skills/add-component/SKILL.md) | Adding a component to `@trailpack-ui/react` — the order of steps that avoids rework. |

They carry procedure and reference, never rules: anything you must not get wrong
is in an `AGENTS.md`, which is always loaded. A skill that starts restating one
has drifted.

### Two locations, and which one a skill belongs in

`<package>/.claude/skills/<name>/` is where Claude Code discovers skills for
work **in this repository**, and it is the default. Both skills above are there.

[`skills/`](skills/README.md) at the root is a second, tool-neutral catalogue,
for guidance that is useful **without this repository checked out** — a consumer
of the published packages, whatever assistant they run. Only `tokens` qualifies;
`add-component` is about editing `packages/react` and would mean nothing in
someone else's project.

`tokens` therefore exists in both places, byte-identical, because neither
location can serve the other's audience. That duplication is generated, not
maintained: `pnpm generate:skill` in `packages/theme` writes both from
`src/guidance.ts`, and a test fails if either goes stale. **Never edit a
generated `SKILL.md` or `metadata.json` by hand** — see
[packages/theme/AGENTS.md](packages/theme/AGENTS.md).

A skill scoped to one package starts under that package. Promote it to the root
catalogue only when a consumer would need it, and add it to both tables when you
do — nothing generates either.

## Environment

- **pnpm 11** and **Node 24**. Always use `pnpm` to install and run scripts.
- Never run `npm install` or `yarn` — it would produce a competing lockfile.

## Critical: npm cannot run from the repository root

`devEngines.packageManager = pnpm` in the root `package.json` makes **every**
`npm` command fail there with `EBADDEVENGINES`, read-only ones included. `cd`
into a package first.

```sh
npm view vite version                       # from the root  → exit 1, EBADDEVENGINES
cd packages/theme && npm view vite version  #                → exit 0
```

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

**On hold — do not create one, and do not suggest one either.** Nothing has been
published, so there is no released version for a bump to be relative to. The
setup stays in the repository; the maintainer will say when releases start, and
the rule then reverts to: never create a changeset unless asked, because the
bump level is a release decision. See [Releasing](README.md#releasing).

## Two rules that apply to every change

- **Never edit a `version` field by hand.** Versions are derived from changesets;
  a manual bump desynchronises the pipeline.
- **Never remove `repository`, `publishConfig` or `files` from a published
  package's `package.json`.** Each one causes a failure only much later, at
  publish time.

## Functions

**Write arrow functions.** `const render = (x: string) => …` is the default form
everywhere — module scope, callbacks, components, test helpers.

Reach for `function` only where it buys something the arrow cannot: hoisting,
when a function is genuinely used above its definition and reordering would read
worse; `this`, when a caller binds it; generators; overload signatures. "It has
always been written that way" is not one of those — a `function` in a diff with
no such reason is an arrow.

## Comments

**Write a comment only when the code cannot carry the point itself.** Comments
are not free: they take up reading space, they go stale silently, and a file
padded with them takes longer to understand than the same file without.

The bar is *why*, not *what*. A comment earns its place when it records
something the reader cannot recover from the code — a constraint from outside
the file, an alternative that was tried and rejected, a consequence that shows
up somewhere else. Restating the code, captioning a block (`// imports`),
repeating a descriptive name, or documenting what a change *is* are all noise;
the last belongs in the commit message.

Keep length in proportion: a paragraph above four lines of configuration means
the reasoning belongs in the README, and inline it can almost always be two
lines instead of ten. Do not narrate absence — explaining why something is *not*
in the file is worth it only when a reader is likely to add it back and break
something.

If a change makes an existing comment wrong, fix it or delete it. A stale
comment is worse than none, because it is trusted. None of this restricts doc
comments on exported API; a `/** */` on an exported symbol is part of the
package's surface, and those stay.

## File names

**camelCase, with components the one exception** — they are PascalCase, after
the component they export: `Button.tsx`, `Button.css.ts`, `Button.stories.tsx`.
Everything else is `useDisclosure.ts`, `renderGuidance.ts`, `cx.ts`, whether or
not it has a single primary export. No kebab-case, no snake_case.

Directories follow the same rule: `generateTokens/`, and a component's folder
takes its PascalCase name, `components/Button/`. The one exception is a skill
directory — `.claude/skills/<name>/` or `skills/<name>/` — where the folder name
has to match the skill's `name:` field and that format is kebab-case —
`add-component/`.

Keep the casing of a name stable once chosen. macOS and Windows do not
distinguish `Foo.ts` from `foo.ts`, so a case-only rename travels badly through
Git and has to go via a temporary name.

## Where stories go

**A story lives next to what it documents, not in a directory that exists only
to hold stories.** In a package that ships components, that is the component's
own folder:

```
src/components/Button/
  Button.tsx
  Button.css.ts
  Button.stories.tsx
  storybook/            only when the component needs custom documentation
    Button.mdx
```

`storybook/` is the one exception, for prose that does not fit in the stories —
usage rules, dos and don'ts, migration notes. No such page, no empty folder.

A story documenting no component in particular goes to `.storybook`, with the
configuration; the overview page that renders `README.md` is the case both
packages have. `packages/theme` keeps a `src/stories` directory because it ships
no components at all — that is the rule's fallback, not an exception to it.

Story helpers stay inside the story that uses them until a second story needs
the same thing.
