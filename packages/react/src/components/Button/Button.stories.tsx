import type { Meta, StoryObj } from '@storybook/react-vite';
import { vars } from '@trailpack-ui/theme';
import type { CSSProperties } from 'react';
import type { ToneName } from '../../index';
import { Button } from './Button';

/**
 * The theme exports `ToneName` as a type but no runtime list, so the story
 * keeps its own. `satisfies` is what makes a tone added later fail here rather
 * than quietly go undocumented.
 */
const tones = ['accent', 'neutral', 'info', 'success', 'warning', 'danger'] satisfies ToneName[];

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
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div style={column}>
      {(['solid', 'subtle', 'ghost'] as const).map((variant) => (
        <div key={variant} style={row}>
          {tones.map((tone) => (
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
