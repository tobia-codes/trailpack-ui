import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Card.css';

export type CardPadding = keyof typeof styles.padding;
export type CardElevation = keyof typeof styles.elevation;

export interface CardProps extends ComponentPropsWithRef<'div'> {
  /** A key of the theme's `space` scale. @default 6 */
  padding?: CardPadding;
  /** @default 'sm' */
  elevation?: CardElevation;
}

/** Surface panel: the page's `surface` colour, a border and a shadow. */
export const Card = ({ padding = 6, elevation = 'sm', className, ...rest }: CardProps) => {
  return (
    <div
      className={cx(styles.base, styles.padding[padding], styles.elevation[elevation], className)}
      {...rest}
    />
  );
};
