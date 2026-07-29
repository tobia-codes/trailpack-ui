---
name: code-layout
description: >-
  Use when deciding where a file goes in this repository — a helper, a shared
  type, a story — or when a file has outgrown its name and should be split or
  renamed. Covers the reasoning behind the placement rules in AGENTS.md: how to
  tell a real module from a drawer, when to widen a file's subject, and when a
  helper moves up a level.
---

# Where a file goes

The rules are in [AGENTS.md](../../../AGENTS.md#where-utilities-and-types-go)
and are always loaded. This page is the reasoning behind them — read it when you
are placing, naming, splitting or moving a file and the rule alone does not
settle it.

## Telling a module from a drawer

`date.ts` is a real module: its exports share a subject, they change together
when the library underneath them does, and they get imported together. A
`string.ts` or a `class.ts` holding everything that returns a className is not —
those are named after the type of an argument or of a return value, which
excludes nothing. `capitalize`, `slugify` and `parseQueryString` end up side by
side while belonging to three unrelated features.

**The usable test is whether you can say what does *not* belong in the file.**
If the only answer is "anything not shaped like X", it is a drawer and will fill
up like one.

The same question splits a file later: once its exports stop being imported
together, it is holding two subjects.

Neither extreme is the safe default. Fifteen single-function files with nothing
to do with one another are that same drawer spread thinner. `src/utils/cx.ts` is
alone because there is no class-helper subject for it to join yet, not because
one export per file is a rule.

## Naming a file with one member in it

It is named after that member, and renamed when a second one arrives — `cx.ts`
becomes `className.ts` the day something else has to build a class attribute,
not before.

Naming it for the subject up front invents a category to fill. Waiting costs a
`git mv` and one import line, because a file name inside `utils/` reaches
consumers only through the barrel and is not part of the published surface.

The same restraint applies to the subject itself: it has to be an actual job, so
that `slugify` is recognisably outside it. Widen it to "anything that returns a
class name" and it is a drawer again under a better name.

## Which level to start at

Scope narrowly and move up later. Something starts in the folder closest to its
only consumer; it moves to the package-level `utils/` when a second consumer
appears, not in anticipation of one. The reverse — a helper parked at the top
because it might be useful — is what turns `src/utils` into a drawer.

In `packages/react` the levels are the component's own folder and the package
root:

```
src/components/Input/
  utils/                only what Input alone needs
src/utils/              a second component needs it too — and this is
                        the ./utils subpath, so it is published API
```

Promoting a helper into `src/utils` is therefore a decision to ship it. A test
helper never goes there at all; `src/tests/` is its home, and
[packages/react/AGENTS.md](../../../packages/react/AGENTS.md#tests) has why.

## Types

A type stays in the module that uses it until a second module needs it. A
component's props type is the case that comes up most: `ButtonProps` is declared
directly above `Button` in `Button.tsx` and does not move to a `types/` folder
for being exported alongside it. Promoting one on first use costs a file and an
import and buys nothing.

## Stories

A story lives next to what it documents. In a package that ships components that
is the component's own folder:

```
src/components/Button/
  Button.tsx
  Button.css.ts
  Button.stories.tsx
  storybook/            only when the component needs custom documentation
    Button.mdx
```

`storybook/` is for prose that does not fit in the stories — usage rules, dos
and don'ts, migration notes. No such page, no empty folder.

A story documenting no component in particular goes to `.storybook`, with the
configuration; the overview page that renders `README.md` is the case both
packages have. `packages/theme` keeps a `src/stories` directory because it ships
no components at all — that is the rule's fallback, not an exception to it.

Story helpers — a tone list, a layout object — stay inside the story that uses
them until a second story needs the same thing.
