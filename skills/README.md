# Trailpack agent skills

Packaged guidance for building **with** the `@trailpack-ui` packages. It is
written for an AI agent working in a project that consumes them, and it reads
perfectly well as documentation for the person supervising that agent.

Nothing here is specific to one assistant. The files are plain markdown with a
short YAML header, so Claude Code, Cursor, Copilot and anything else that reads
a repository can use them — which is why the catalogue sits at the top level
rather than inside a vendor's dot-directory.

## The catalogue

| Skill | Read it when |
| --- | --- |
| [`tokens`](tokens/) | Writing or reviewing UI code against `@trailpack-ui/theme` — which colour, spacing, radius, type, shadow, icon size, focus ring or z-index token to reach for, and which pairings are contrast-checked. |

## Using one

Point your assistant at the `SKILL.md`, or copy the directory into wherever it
looks for skills. For Claude Code that is your own project:

```sh
cp -r skills/tokens ~/my-app/.claude/skills/
```

A copy is a snapshot. `metadata.json` records the range of package versions the
guidance was written against — `packageVersion` — so a copy that has fallen
behind can be recognised rather than trusted.

## What a skill looks like

| File | |
| --- | --- |
| `SKILL.md` | The guidance itself, with a `name` and `description` header. The entry point, and for most skills the whole thing. |
| `README.md` | What the skill covers and when to reach for it, for a human deciding whether to install it. |
| `metadata.json` | Which package the skill describes and the version range it applies to. |

There is deliberately no `AGENTS.md` inside a skill. In this repository that
filename means *rules that are always loaded*, and one here would be read as
rules for editing the skill itself. See the root
[AGENTS.md](../AGENTS.md#skills) for the split.

## What is not here

Skills about working **on** this repository — adding a component, wiring a
package — stay under `<package>/.claude/skills/`, where Claude Code discovers
them automatically. They are addressed to a contributor with the monorepo
checked out, and mean nothing in a consumer's project. The root
[AGENTS.md](../AGENTS.md#skills) lists both sets.

## Adding one

A skill earns a place here only if it is useful without this repository checked
out. Give it a kebab-case directory and the three files above, then add it to
the catalogue table — nothing generates that.

If the guidance already exists as data in a package, render it rather than
retyping it: `tokens` is generated from `packages/theme/src/guidance.ts` by
`pnpm generate:skill`, with a test that fails if the committed copy goes stale.
**Never edit a generated `SKILL.md` or `metadata.json` by hand.**
