---
name: testing
description: >-
  Use when writing, changing or running a test in @trailpack-ui/react — the
  shape a test file takes, the queries to reach for, and what the accessibility
  check does and does not cover. Load it once a test has been asked for; adding
  or changing a component is not on its own a reason to open this page, because
  tests here are written on request only.
---

# Testing @trailpack-ui/react

The rules behind this live in [AGENTS.md](../../../AGENTS.md) and the
[repository AGENTS.md](../../../../../AGENTS.md). Two of them decide whether you
should be on this page at all:

- **A test is written when one is asked for**, never as a companion to a
  component. If the request was "add a Card" or "restyle the Button", stop here.
- **Test infrastructure goes in `src/tests/`, never `src/utils`** — that folder
  is a published export path. Nothing outside a test file may import from
  `src/tests/` either; it would ship.

`src/components/Button/Button.test.tsx` is the worked example. Read it first.

## Running

```sh
pnpm test          # from packages/react, or from the root for the workspace
pnpm test:watch    # this package only
```

A change touching tests is not done until `pnpm test`, `pnpm lint` and
`pnpm format:check` all pass.

## The shape of a test file

A test sits next to what it covers — `Button.tsx` and `Button.test.tsx` in the
same folder — and opens with a `setup` arrow that wraps `render`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { checkA11y } from '@tests/utils/checkA11y';
import { Button, type ButtonProps } from './Button';

const setup = (props: Partial<ButtonProps> = {}) => {
  return render(<Button {...props}>Click me</Button>);
};

describe('Button', () => {
  it('renders its children', () => {
    setup();

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = setup();

    await checkA11y(container);
  });
});
```

- `setup` takes a `Partial<XProps>` of overrides and holds the defaults itself,
  so a test passes only the props it cares about. Write it even for a component
  with no props — one line, and the file stays the same shape as every other.
- `describe`, `it`, `expect` and `vi` are imported from `vitest`. This package
  runs without `globals`, so nothing is ambient.
- `@testing-library/jest-dom` matchers need no import; `src/tests/setup.ts` has
  them.
- Query the way a user finds things — `getByRole` first, then `getByLabelText`
  and `getByText`. `container.querySelector` and class names describe the
  implementation, and this package changes class names whenever a `.css.ts`
  changes.
- `@testing-library/user-event` is deliberately **not installed**. Add it the
  day a test needs a real click or keystroke, not before.

## The accessibility check

`checkA11y` takes the container a test has already rendered:

```tsx
const { container } = setup();

await checkA11y(container);
```

Add one per markup shape that genuinely differs — a variant that renders
different elements, a field in its error state, a dialog open versus closed. Not
one per prop combination; tone and size variants produce the same markup and one
check covers them.

**What it cannot see is the part worth knowing.** Under `happy-dom` axe checks
markup: accessible names, ARIA validity, label association, roles, heading
order, landmarks. It cannot evaluate anything needing layout, and the failure is
silent rather than loud — measured against axe-core 4.12:

| Rule                | Result under happy-dom                  | Where it is actually covered                                        |
| ------------------- | --------------------------------------- | ------------------------------------------------------------------- |
| `color-contrast`    | `incomplete`, never a violation         | `packages/theme`'s token tests assert every pairing against WCAG AA |
| `target-size`       | reported as a **pass** on a 0×0 element | a real browser only                                                 |
| visibility, overlap | unreliable                              | a real browser only                                                 |

So a green `checkA11y` means the markup is sound, not that the component is
accessible. Treat any violation it does report as a bug in the component: fix
the markup rather than configuring the rule away.

## Assertions worth writing

Prefer what the package promises a consumer over what it happens to do:

- rendered output for a given set of props, queried by role,
- documented invariants — that `className` is appended rather than replacing the
  component's own classes, that `type` defaults to `button`,
- forwarded props and refs reaching the underlying element,
- behaviour on interaction, once `user-event` is in.

Skip snapshots and skip asserting generated class names. Both fail on every
styling change while catching nothing a consumer would notice.
