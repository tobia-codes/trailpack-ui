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

## The theme package

`packages/theme` is the token contract. Two things about it are easy to break:

- **Token values are asserted, not decorative.** `src/themes.test.ts` checks
  every colour pairing the token set promises against WCAG AA, in both themes.
  Changing a hex value without running `pnpm test` is how a contrast regression
  gets in.
- **`dist/theme.css` is an export path in `package.json`, so its filename is
  public API.** It is pinned via `build.lib.cssFileName` in `vite.config.ts`;
  nothing in the build output may be content-hashed.
