import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Button, Card, Stack } from '../index';

const meta = {
  title: 'Components/Card',
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <Stack gap={4}>
        <Stack direction="row" gap={3} align="center" justify="between">
          <strong>Trailpack</strong>
          <Badge tone="success">Ready</Badge>
        </Stack>
        <span>Everything on this card is a Server Component. None of it ships JavaScript.</span>
        <Stack direction="row" gap={2}>
          <Button size="sm">Open</Button>
          <Button size="sm" variant="ghost" tone="neutral">
            Dismiss
          </Button>
        </Stack>
      </Stack>
    ),
  },
};

export const Elevations: Story = {
  render: () => (
    <Stack direction="row" gap={6} wrap>
      {(['none', 'sm', 'md', 'lg'] as const).map((elevation) => (
        <Card key={elevation} elevation={elevation}>
          {elevation}
        </Card>
      ))}
    </Stack>
  ),
};
