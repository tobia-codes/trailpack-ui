import type { Meta, StoryObj } from '@storybook/react-vite';
import { vars } from '@trailpack-ui/theme';
import type { CSSProperties, ReactNode } from 'react';
import { Stack } from './Stack';

// Inline token values rather than components of this package's own: a story
// should fail for the primitive it documents, not for its scaffolding.
const item: CSSProperties = {
  padding: vars.space[3],
  borderRadius: vars.radius.sm,
  background: vars.color.muted,
  color: vars.color.foreground,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.sm,
};

const outline: CSSProperties = {
  border: `1px dashed ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: vars.space[3],
};

const Item = ({ children }: { children: ReactNode }) => <div style={item}>{children}</div>;

const meta = {
  title: 'Primitives/Stack',
  component: Stack,
  // Stack paints nothing, so a dashed outline is what makes its box visible;
  // it belongs to the story rather than to the primitive.
  decorators: [(Story) => <div style={outline}>{Story()}</div>],
  args: {
    children: (
      <>
        <Item>One</Item>
        <Item>Two</Item>
        <Item>Three</Item>
      </>
    ),
  },
  // `direction`, `align` and `justify` need nothing here — react-docgen reads
  // their unions off Stack.tsx. `gap` is a `keyof typeof` over an import, which
  // it resolves to `unknown`, and an unknown type gets the object control.
  // Derived from the scale rather than listed, so a step added to the theme
  // shows up here on its own.
  argTypes: {
    gap: { options: Object.keys(vars.space).map(Number), control: 'select' },
  },
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Directions: Story = {
  render: (args) => (
    <Stack gap={6}>
      <Stack {...args} direction="column" />
      <Stack {...args} direction="row" align="start" />
    </Stack>
  ),
};

export const Gaps: Story = {
  render: (args) => (
    <Stack gap={6}>
      {([1, 3, 6, 10] as const).map((gap) => (
        <Stack key={gap} {...args} direction="row" gap={gap} align="start" />
      ))}
    </Stack>
  ),
};

export const Justify: Story = {
  args: { direction: 'row', justify: 'between', align: 'start' },
};

export const Wrap: Story = {
  args: {
    direction: 'row',
    wrap: true,
    gap: 2,
    children: Array.from({ length: 12 }, (_, index) => <Item key={index}>Item {index + 1}</Item>),
  },
};
