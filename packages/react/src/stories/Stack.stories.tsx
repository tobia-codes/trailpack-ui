import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Stack } from '../index';

const meta = {
  title: 'Components/Stack',
  component: Stack,
  args: {
    children: [1, 2, 3].map((n) => (
      <Card key={n} padding={4} elevation="none">
        {n}
      </Card>
    )),
  },
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Column: Story = {};

export const Row: Story = {
  args: { direction: 'row' },
};

export const Gaps: Story = {
  render: (args) => (
    <Stack gap={6}>
      {([1, 2, 4, 8] as const).map((gap) => (
        <Stack key={gap} {...args} direction="row" gap={gap} />
      ))}
    </Stack>
  ),
};
