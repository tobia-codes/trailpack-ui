import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Stack.css';

export type StackGap = keyof typeof styles.gap;
export type StackAlign = keyof typeof styles.align;
export type StackJustify = keyof typeof styles.justify;

export interface StackProps extends ComponentPropsWithRef<'div'> {
  /** @default 'column' */
  direction?: 'row' | 'column';
  /** A key of the theme's `space` scale. @default 4 */
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
}

/** Flex container over the token spacing scale. */
export const Stack = ({
  direction = 'column',
  gap = 4,
  align,
  justify,
  wrap = false,
  className,
  ...rest
}: StackProps) => {
  return (
    <div
      className={cx(
        styles.base,
        styles.direction[direction],
        styles.gap[gap],
        align && styles.align[align],
        justify && styles.justify[justify],
        wrap && styles.wrap,
        className,
      )}
      {...rest}
    />
  );
};
