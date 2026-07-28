import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Stack } from '../index';
import { tones } from './tones';

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
    <Stack gap={4}>
      {(['solid', 'subtle', 'ghost'] as const).map((variant) => (
        <Stack key={variant} direction="row" gap={2} align="center" wrap>
          {tones.map((tone) => (
            <Button key={tone} {...args} variant={variant} tone={tone}>
              {tone}
            </Button>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" gap={3} align="center">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </Stack>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};
