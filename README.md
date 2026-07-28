# trailpack-ui

A pnpm workspace monorepo for the Trailpack UI toolchain, orchestrated with
[Turborepo](https://turbo.build/repo). Packages are versioned with
[Changesets](https://github.com/changesets/changesets) and published to npm
under the `@trailpack-ui` scope.

## Packages

| Package                                 | Description                                                             |
| --------------------------------------- | ----------------------------------------------------------------------- |
| [`@trailpack-ui/theme`](packages/theme) | Design token contract, light and dark theme, built with vanilla-extract |

Each package stands on its own: it carries its own build, lint, format and test
setup and has no dependency on the others.

## Layout

```
packages/*          publishable packages (currently: theme)
apps/*              applications (none yet, but part of the workspace globs)
.changeset/         pending changesets + config
.github/workflows/  CI
```

The root `package.json` is `private: true` and is never published.

## Environment

- **pnpm 11** and **Node 24**. Always use `pnpm` to install and run scripts.
- Never run `npm install` or `yarn` — it would produce a competing lockfile.

## Commands

Everything runs through Turborepo from the root, which fans the task out over
the workspace:

```sh
pnpm install       # install everything
pnpm build         # turbo run build
pnpm lint          # turbo run lint
pnpm test          # turbo run test
pnpm format        # turbo run format
pnpm format:check  # turbo run format:check
pnpm changeset     # record a change for the next release
```

To run something in one package only, use `--filter`:

```sh
pnpm --filter @trailpack-ui/theme build
```

## Releasing

Changes are recorded as changesets (`pnpm changeset`), which pick the bump level
per package. The bump level is a release decision, not a mechanical consequence
of the diff — pre-1.0 packages in particular carry breaking changes in the minor
segment, because `major` there means committing to 1.0.0.

Never edit a `version` field by hand: versions are derived from the changesets.
