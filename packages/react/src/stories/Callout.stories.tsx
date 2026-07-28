import type { Meta, StoryObj } from '@storybook/react-vite';
import { Callout, Stack } from '../index';
import { tones } from './tones';

const meta = {
  title: 'Components/Callout',
  component: Callout,
  args: {
    title: 'Tokens are the contract',
    children: 'The variable names behind them are not, and can change between releases.',
  },
} satisfies Meta<typeof Callout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <Stack gap={3}>
      {tones.map((tone) => (
        <Callout key={tone} {...args} tone={tone} title={tone} />
      ))}
    </Stack>
  ),
};

export const WithoutTitle: Story = {
  args: { title: undefined },
};
