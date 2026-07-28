import type { ToneName } from '@trailpack-ui/theme';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Callout.css';

// `title` on a div is the tooltip attribute, a string. Ours is a heading, so
// the DOM one is dropped rather than widened.
export interface CalloutProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  /** @default 'info' */
  tone?: ToneName;
  title?: ReactNode;
}

/** Block of text set apart in a tone — a note, a warning, a result. */
export const Callout = ({ tone = 'info', title, children, className, ...rest }: CalloutProps) => {
  return (
    <div className={cx(styles.base, styles.tone[tone], className)} {...rest}>
      {title !== undefined && <p className={styles.title}>{title}</p>}
      {children}
    </div>
  );
};
