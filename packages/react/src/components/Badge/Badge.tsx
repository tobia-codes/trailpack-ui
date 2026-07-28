import type { ToneName } from '@trailpack-ui/theme';
import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Badge.css';

export type BadgeVariant = keyof typeof styles.variant;

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  /** @default 'neutral' */
  tone?: ToneName;
  /** @default 'subtle' */
  variant?: BadgeVariant;
}

/** Short status label in one of the token tones. */
export const Badge = ({ tone = 'neutral', variant = 'subtle', className, ...rest }: BadgeProps) => {
  return <span className={cx(styles.base, styles.variant[variant][tone], className)} {...rest} />;
};
