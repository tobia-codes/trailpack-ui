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

  it('appends className rather than replacing its own', () => {
    setup({ className: 'consumer-class' });

    const button = screen.getByRole('button');

    expect(button).toHaveClass('consumer-class');
    expect(button.className.split(' ').length).toBeGreaterThan(1);
  });

  it('has no accessibility violations', async () => {
    const { container } = setup();

    await checkA11y(container);
  });
});
