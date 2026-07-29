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
| [`code-layout`](.claude/skills/code-layout/SKILL.md) | Placing, naming, splitting or moving a file anywhere in the repository — a helper, a shared type, a context, a story. |
| [`add-component`](packages/react/.claude/skills/add-component/SKILL.md) | Adding a component to `@trailpack-ui/react` — the order of steps that avoids rework. |
| [`testing`](packages/react/.claude/skills/testing/SKILL.md) | Writing or changing a test in `@trailpack-ui/react` — once one has been asked for, which is the only time it happens. |

They carry procedure and reference, never rules: anything you must not get wrong
is in an `AGENTS.md`, which is always loaded. A skill that starts restating one
has drifted.

### Where a skill lives

A skill useful to a **consumer of the published packages** goes in
[`skills/`](skills/README.md) at the root, a tool-neutral catalogue — that file
carries the reasoning and the shape. A skill for a **contributor with the
repository checked out** goes under `.claude/skills/`, scoped to what it applies
to: the package's own when it is about one package, the root's when it is
repo-wide, because a skill under a package only reaches files beneath it.

`theme` is needed by both audiences, so `.claude/skills/theme/SKILL.md` is a
pointer at the catalogue rather than a copy. Both it and the catalogue entry are
written by `pnpm generate:skill` in `packages/theme` from `src/guidance.ts`, and
a test fails if either goes stale. **Never edit a generated `SKILL.md` or
`metadata.json` by hand** — see
[packages/theme/AGENTS.md](packages/theme/AGENTS.md).

Start one at the narrowest scope that fits and move it up when a second consumer
appears. Either way, add it to the table above — nothing generates it.

## Environment

- **pnpm 11** and **Node 24**. Always use `pnpm` to install and run scripts.
- Never run `npm install` or `yarn` — it would produce a competing lockfile.

## Critical: npm cannot run from the repository root

`devEngines.packageManager = pnpm` in the root `package.json` makes **every**
`npm` command fail there with `EBADDEVENGINES`, read-only ones like `npm view`
included. `cd` into a package first.

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
is written, restyled and reshaped several times before its behaviour settles; a
test written along the way pins down a shape nobody has committed to yet, so it
is either rewritten with every pass or quietly freezes an early decision.

"Write a test for X", "cover this", "the suite should catch Y" is the signal.
Until it comes, leave the suite alone — touching a component is not a reason to
test it, and neither is noticing that it has none. Say a change is untested if
it matters; do not fix it unprompted.

This is about *adding* coverage. A change that breaks an existing test still has
to deal with it, and `pnpm test` still has to pass before any change is done.

## Functions

**Write arrow functions.** `const render = (x: string) => …` is the default form
everywhere — module scope, callbacks, components, test helpers.

Reach for `function` only where it buys something the arrow cannot: hoisting,
when a function is genuinely used above its definition and reordering would read
worse; `this`, when a caller binds it; generators; overload signatures. "It has
always been written that way" is not one of those — a `function` in a diff with
no such reason is an arrow.

## Comments

**Write a comment only when the code cannot carry the point itself.** The bar is
*why*, not *what*: it earns its place by recording something the reader cannot
recover from the code — a constraint from outside the file, an alternative tried
and rejected, a consequence that shows up elsewhere. Restating the code,
captioning a block (`// imports`), repeating a descriptive name and documenting
what a change *is* are all noise; the last belongs in the commit message.

Keep it in proportion — two lines, not ten — and do not narrate absence unless a
reader would otherwise add the thing back and break something. If a change makes
a comment wrong, fix it or delete it: a stale comment is trusted, so it is worse
than none. Doc comments on exported API are outside all of this and stay.

## File names

**camelCase, with components the one exception** — they are PascalCase, after
the component they export: `Button.tsx`, `Button.css.ts`, `Button.stories.tsx`.
Everything else is `useDisclosure.ts`, `renderGuidance.ts`, `cx.ts`, whether or
not it has a single primary export. No kebab-case, no snake_case. No `.utils`
or `.types` in the name either — the folder already says that, see
[below](#where-utilities-types-and-contexts-go).

Directories follow the same rule: `generateTokens/`, and a component's folder
takes its PascalCase name, `components/Button/`. The one exception is a skill
directory — `.claude/skills/<name>/` or `skills/<name>/` — where the folder name
has to match the skill's `name:` field and that format is kebab-case —
`add-component/`.

Keep the casing of a name stable once chosen. macOS and Windows do not
distinguish `Foo.ts` from `foo.ts`, so a case-only rename travels badly through
Git and has to go via a temporary name.

## Where utilities, types and contexts go

**A helper goes in a `utils/` folder, a shared type in a `types/` folder and a
React context in a `contexts/` folder, never loose beside the modules that use
them** — as components go in a `components/` folder. The folder sits at whatever
level the thing is scoped to: `src/utils/cx.ts` is the package's, and a helper
only one component needs gets a `utils/` inside that component's own folder.
The folder is what classifies the file, so the name stays plain and says only
the subject — `cx.ts`, not `cx.utils.ts`; `contexts/theme.tsx`, not
`themeContext.tsx`.

**A context keeps its provider and its hook in one file.** They close over a
`createContext` value that stays module-private, so splitting them gives each
file its own instance and the hook then reads the default forever — with
nothing failing anywhere. That the provider is a component is not a reason to
move it to `components/`.

**A file groups what its contents are *about*, never what shape they have.** A
`string.ts` or a `class.ts` is named after the type of an argument or a return
value, which excludes nothing, and fills up like the drawer it is.

**A file with one member is named after that member, and renamed when a second
one arrives.** Start it at the level closest to its only consumer and move it up
when a second appears, never in anticipation of one.

**A type stays in the module that uses it until a second module needs it.** A
component's props type is the case that comes up most: `ButtonProps` is declared
directly above `Button` in `Button.tsx` and does not move to `types/` for being
exported alongside it.

Placing, naming, splitting or moving one of these is what the
[`code-layout` skill](.claude/skills/code-layout/SKILL.md) is for.

## Where stories go

**A story lives next to what it documents, not in a directory that exists only
to hold stories** — the component's own folder in a package that ships
components, `.storybook` for a story documenting no component in particular.

**Where Storybook material does need a folder of its own, that folder is
`storybook/`, never `stories/`.** Beside a component it holds the prose that
does not fit in the stories — and only when there is some. A package shipping
no components keeps its whole reference in `src/storybook/`. The name is what
lets the stories lie flat in it: the folder says what it is for, so the
components, contexts and helpers a story is built from go in its own
`components/`, `contexts/` and `utils/` rather than beside the stories. The
[`code-layout` skill](.claude/skills/code-layout/SKILL.md) has the trees.
