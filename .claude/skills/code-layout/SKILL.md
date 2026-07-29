---
name: code-layout
description: >-
  Use when deciding where a file goes in this repository — a helper, a shared
  type, a context, a story — or when a file has outgrown its name and should be
  split or renamed. Covers the reasoning behind the placement rules in
  AGENTS.md: how to tell a real module from a drawer, when to widen a file's
  subject, and when a helper moves up a level.
---

# Where a file goes

The rules are in
[AGENTS.md](../../../AGENTS.md#where-utilities-types-and-contexts-go) and are
always loaded. This page is the reasoning behind them — read it when you are
placing, naming, splitting or moving a file and the rule alone does not settle
it.

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

A context is the one file named for its subject from the start, and it is not
an inconsistency: `theme.tsx` holds a provider and a hook that arrived together
and cannot be separated, so there is no single member for the name to follow
and no second one to wait for.

## Which level to start at

What is deferred is the level, never the folder. A helper that has earned a file
is in a `utils/` from the first day — the question is only whose: the folder
closest to its only consumer, moving up to the package-level `utils/` when a
second consumer appears and not in anticipation of one. The reverse — a helper
parked at the top because it might be useful — is what turns `src/utils` into a
drawer.

In `packages/react` the levels are the component's own folder and the package
root, and at the root the same level forks by visibility:

```
src/components/Input/
  utils/                only what Input alone needs
src/internal/utils/     a second component needs it too
src/utils/              …and it is worth shipping — this is the ./utils
                        subpath, so it is published API
```

The second consumer forces the move up. It does not decide the fork: `internal/`
is where a shared helper lands unless shipping it was the point, so
`src/utils` stays a list of things somebody chose to publish rather than
everything that happened to be needed twice.

Read the fork as a question about the helper's audience, not its size or its
quality. `cx` is one line and is published anyway, because a consumer adding to
a `className` needs the same helper the components use. What nobody outside the
package would ever call is internal however good it is.

A test helper is in neither: `src/tests/` is its home, it is off limits to
everything but a test file, and
[packages/react/AGENTS.md](../../../packages/react/AGENTS.md#tests) has why.

## Types

The rule that a type waits for its second module is in AGENTS.md; what it saves
is a file and an import that buy nothing, since a props type exported alongside
its component is already reachable everywhere the component is.

## Contexts

One file per context, holding the `createContext` value, the provider and the
hook that reads it. Why the provider and the hook cannot separate is the rule
in AGENTS.md; the value stays unexported for a second reason — a consumer that
can reach it calls `use()` on it directly and bypasses whatever the hook does.

`providers/` is the name to reject: a provider is one export of the module
rather than what the module is, and a folder named after it makes the hook
beside it look misfiled — which is how the split above gets made.

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
packages have. A package that ships no components at all keeps its whole
reference under `src/storybook/`, the rule's fallback rather than an exception
to it — `packages/theme` is the one:

```
src/storybook/
  tokens.stories.tsx      flat, because it is a story
  components/             what the stories render with
    Swatch.tsx
  contexts/               provider and hook in one file
    theme.tsx
  utils/                  what those components share
    stack.ts
```

**The folder is `storybook/` in both cases, never `stories/`.** A folder named
for one of the file kinds inside it invites everything else to lie flat beside
the stories; named for what it is for, it takes the same `components/`,
`contexts/` and `utils/` split as anywhere else, and what stays flat in it is
stories.

That split starts when there is something to split — a tone list or a layout
object one story uses is still inside that story.
