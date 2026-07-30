import type { Meta, StoryObj } from '@storybook/react-vite';
import { toneNames, vars } from '@trailpack-ui/theme';
import type { CSSProperties } from 'react';
import { Button } from './Button';

// Inline token values rather than a layout component of this package's own:
// a story should fail for the component it documents, not for its scaffolding.
const column: CSSProperties = { display: 'flex', flexDirection: 'column', gap: vars.space[4] };
const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space[2],
};

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Continue' },
  // `variant` and `size` need nothing here — react-docgen reads their unions
  // off Button.tsx. `ToneName` crosses a package boundary, which it does not
  // follow, so that one control has to be given its options.
  argTypes: { tone: { options: toneNames, control: 'select' } },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div style={column}>
      {(['solid', 'subtle', 'ghost'] as const).map((variant) => (
        <div key={variant} style={row}>
          {toneNames.map((tone) => (
            <Button key={tone} {...args} variant={variant} tone={tone}>
              {tone}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};
