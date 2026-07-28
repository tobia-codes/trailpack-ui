import type { ToneName } from '@trailpack-ui/theme';
import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Button.css';

export type ButtonVariant = keyof typeof styles.variant;
export type ButtonSize = keyof typeof styles.size;

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** @default 'accent' */
  tone?: ToneName;
  /** @default 'solid' */
  variant?: ButtonVariant;
  /** @default 'md' */
  size?: ButtonSize;
  fullWidth?: boolean;
}

/**
 * Button in every tone the token set carries.
 *
 * Holds no state and calls no hook, so it renders on the server as it is. A
 * Server Component can render it without an `onClick` and ship no JavaScript
 * for it; passing a handler makes the *caller* the client boundary, and this
 * module joins that graph on its own.
 */
export const Button = ({
  tone = 'accent',
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  type = 'button',
  className,
  ...rest
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cx(
        styles.base,
        styles.size[size],
        styles.variant[variant][tone],
        fullWidth && styles.fullWidth,
        className,
      )}
      {...rest}
    />
  );
};
