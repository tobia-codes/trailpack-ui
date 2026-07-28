# trailpack-ui

A pnpm workspace monorepo for the Trailpack UI toolchain, orchestrated with
[Turborepo](https://turbo.build/repo). Packages are versioned with
[Changesets](https://github.com/changesets/changesets) and published to npm
under the `@trailpack-ui` scope.

## Packages

| Package                                 | Description                                                             |
| --------------------------------------- | ----------------------------------------------------------------------- |
| [`@trailpack-ui/theme`](packages/theme) | Design token contract, light and dark theme, built with vanilla-extract |
| [`@trailpack-ui/react`](packages/react) | React components, hooks and utilities, styled with those tokens         |

Each package carries its own build, lint, format and test setup. `react` takes
`theme` as a peer dependency — the only edge between them — so the two are
released in step; everything else stands alone.

Both ship a Storybook: `packages/theme` documents the tokens and when to reach
for each one, `packages/react` the components in light and dark.

```sh
pnpm --filter @trailpack-ui/theme dev  # :6006
pnpm --filter @trailpack-ui/react dev  # :6007
```

## Layout

```
packages/*          publishable packages (theme, react)
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
pnpm dev           # turbo run dev — Storybook, for packages that have one
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
