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
| [`theme`](skills/theme/SKILL.md) | Writing or reviewing UI code anywhere in the repository — which colour, spacing, radius, type or shadow token to reach for. |
| [`add-component`](packages/react/.claude/skills/add-component/SKILL.md) | Adding a component to `@trailpack-ui/react` — the order of steps that avoids rework. |
| [`testing`](packages/react/.claude/skills/testing/SKILL.md) | Writing or changing a test in `@trailpack-ui/react` — once one has been asked for, which is the only time it happens. |

They carry procedure and reference, never rules: anything you must not get wrong
is in an `AGENTS.md`, which is always loaded. A skill that starts restating one
has drifted.

### Where a skill lives, and why the two places differ

A skill that only makes sense **with this repository checked out** sits under
`<package>/.claude/skills/<name>/`, scoped to the package it applies to.
`add-component` is one: it is about editing `packages/react`, and would mean
nothing in someone else's project.

A skill that is useful to a **consumer of the published packages** goes in
[`skills/`](skills/README.md) at the root — a tool-neutral catalogue, plain
markdown, no assistant in particular. `theme` is one: which token to reach for
is the same question in a consumer's app as it is here.

`theme` is needed by both audiences, so `.claude/skills/theme/SKILL.md` at the
root **points at the catalogue instead of repeating it**. Both files are written
by `pnpm generate:skill` in `packages/theme` from `src/guidance.ts`, and a test
fails if either goes stale. **Never edit a generated `SKILL.md` or
`metadata.json` by hand** — see
[packages/theme/AGENTS.md](packages/theme/AGENTS.md).

The pointer is at the root rather than under `packages/theme` on purpose: a
skill under a package only applies to files beneath it, and this one is needed
in `packages/react` just as much.

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

## Tests are asked for, never written alongside the code

**Never add a test file unless the change explicitly asks for one.** A component
gets written, restyled and reshaped several times before its behaviour is
settled. A test written along the way pins down a shape nobody has committed to
yet, so it either gets rewritten with every pass or quietly freezes an early
decision — and both cost more than the test was worth.

"Write a test for X", "cover this", "the suite should catch Y" is the signal.
Until it comes, leave the suite alone: touching a component is not a reason to
test it, and neither is noticing that it has none. Say that a change is untested
if it matters; do not fix it unprompted.

This is about *adding* coverage. A change that breaks an existing test still has
to deal with that test, and `pnpm test` still has to pass before any change is
done.

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
not it has a single primary export. No kebab-case, no snake_case. No `.utils`
or `.types` in the name either — the folder already says that, see
[below](#where-utilities-and-types-go).

Directories follow the same rule: `generateTokens/`, and a component's folder
takes its PascalCase name, `components/Button/`. The one exception is a skill
directory — `.claude/skills/<name>/` or `skills/<name>/` — where the folder name
has to match the skill's `name:` field and that format is kebab-case —
`add-component/`.

Keep the casing of a name stable once chosen. macOS and Windows do not
distinguish `Foo.ts` from `foo.ts`, so a case-only rename travels badly through
Git and has to go via a temporary name.

## Where utilities and types go

**A helper goes in a `utils/` folder and a shared type in a `types/` folder,
never loose beside the modules that use them.** The folder sits at whatever
level the thing is scoped to: `src/utils/cx.ts` is the package's, and a helper
only one component needs gets a `utils/` inside that component's own folder.
The folder is what classifies the file, so the name stays plain camelCase —
`cx.ts`, not `cx.utils.ts`.

**A file groups what its contents are *about*, never what shape they have.**
`date.ts` is a real module: its exports share a subject, they change together
when the library underneath them does, and they get imported together. A
`string.ts` or a `class.ts` holding everything that returns a className is not
— those are named after the type of an argument or of a return value, which
excludes nothing, so `capitalize`, `slugify` and `parseQueryString` end up side
by side while belonging to three unrelated features.

The usable test is whether you can say what does **not** belong in the file. If
the only answer is "anything not shaped like X", it is a drawer and will fill up
like one. The same question splits a file later: once its exports stop being
imported together, it is holding two subjects. Neither extreme is the safe
default — fifteen single-function files with nothing to do with one another are
that same drawer spread thinner. `cx.ts` is alone because there is no
class-helper subject for it to join yet, not because one export per file is a
rule.

**A file with one member is named after that member, and renamed when a second
one arrives** — `cx.ts` becomes `className.ts` the day something else has to
build a class attribute, not before. Naming it for the subject up front invents
a category to fill; waiting costs a `git mv` and one import line, because a file
name inside `utils/` reaches consumers only through the barrel and is not part
of the published surface. The same restraint applies to the subject itself: it
has to be an actual job, so that `slugify` is recognisably outside it. Widen it
to "anything that returns a class name" and it is a drawer again under a better
name.

Scope narrowly and move up later. Something starts in the folder closest to its
only consumer; it moves to the package-level `utils/` when a second consumer
appears, not in anticipation of one. The reverse — a helper parked at the top
because it might be useful — is what turns `src/utils` into a drawer.

**A type stays in the module that uses it until a second module needs it.** A
component's props type is the case that comes up most: `ButtonProps` is declared
directly above `Button` in `Button.tsx` and does not move to a `types/` folder
for being exported alongside it. `types/` is for types that are genuinely
shared; promoting one on first use costs a file and an import and buys nothing.

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
