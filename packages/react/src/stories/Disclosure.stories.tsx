import type { Meta, StoryObj } from '@storybook/react-vite';
import { Disclosure, Stack } from '../index';

const meta = {
  title: 'Components/Disclosure',
  component: Disclosure,
  args: {
    title: 'Why does this one carry a directive?',
    children: 'Because it holds its own open/closed state, and state runs in the browser.',
  },
} satisfies Meta<typeof Disclosure>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultOpen: Story = {
  args: { defaultOpen: true },
};

export const Group: Story = {
  render: (args) => (
    <Stack gap={2}>
      <Disclosure {...args} title="First" />
      <Disclosure {...args} title="Second" defaultOpen />
      <Disclosure {...args} title="Third" />
    </Stack>
  ),
};
