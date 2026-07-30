import type { ToneName } from '@trailpack-ui/theme';
import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Button.css';

// Declared here rather than derived from Button.css.ts: these are the
// component's API, and a `keyof typeof styles.variant` would make renaming a
// key in a stylesheet a breaking change for consumers. Button.css.ts is
// annotated against these, so the completeness check runs there.
export type ButtonVariant = 'solid' | 'subtle' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /**
   * Which semantic tone the button carries. Pick it for what the action means,
   * not for the colour it happens to produce — `danger` for anything
   * destructive, `neutral` for the secondary action beside a primary one.
   *
   * @default 'accent'
   */
  tone?: ToneName;
  /**
   * How much emphasis the button takes within its tone: `solid` is filled,
   * `subtle` is tinted with a border, `ghost` is transparent until hovered.
   * One `solid` button per group of actions is the usual shape.
   *
   * @default 'solid'
   */
  variant?: ButtonVariant;
  /**
   * Height, padding and label size together. The hit area stays at least
   * 2rem tall at `sm`.
   *
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Stretch to the width of the container instead of the label. For a button
   * on its own in a narrow column — a form submit, a sheet's confirm.
   *
   * @default false
   */
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
