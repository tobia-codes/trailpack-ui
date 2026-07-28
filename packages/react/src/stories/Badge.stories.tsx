import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Stack } from '../index';
import { tones } from './tones';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Beta' },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <Stack gap={3}>
      {(['subtle', 'solid'] as const).map((variant) => (
        <Stack key={variant} direction="row" gap={2} align="center" wrap>
          {tones.map((tone) => (
            <Badge key={tone} {...args} variant={variant} tone={tone}>
              {tone}
            </Badge>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};
