import type { vars } from '@trailpack-ui/theme';
import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../utils/cx';
import * as styles from './Stack.css';

// Declared here rather than derived from Stack.css.ts: these are the
// component's API, and a `keyof typeof styles.align` would make renaming a key
// in a stylesheet a breaking change for consumers. Stack.css.ts is annotated
// against these, so the completeness check runs there.
export type StackDirection = 'row' | 'column';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between';

export interface StackProps extends ComponentPropsWithRef<'div'> {
  /**
   * Which way the children flow. `column` is the common case — the contents of
   * a card, the fields of a form; `row` is a toolbar or a group of actions.
   *
   * @default 'column'
   */
  direction?: StackDirection;
  /**
   * The space between children, as a step on the theme's spacing scale. Pick it
   * by how closely the children belong together — distance is the main signal a
   * layout has for grouping.
   *
   * Typed as the scale itself rather than a union of this package's own, the
   * way `tone` stays `ToneName`: the theme decides which steps exist.
   *
   * @default 4
   */
  gap?: keyof typeof vars.space;
  /**
   * Children across the cross axis: the horizontal placement of a column, the
   * vertical placement of a row. `stretch` is what makes a column's children
   * share one width.
   *
   * @default 'stretch'
   */
  align?: StackAlign;
  /**
   * Children along the main axis, once they are narrower than the Stack.
   * `between` is the one to reach for to push a trailing action to the far end.
   *
   * @default 'start'
   */
  justify?: StackJustify;
  /**
   * Let a row run onto a second line rather than overflow. For a row of items
   * whose number is not known in advance — filters, tags, a set of tones.
   *
   * @default false
   */
  wrap?: boolean;
}

/**
 * Stacks its children in one direction with one gap between them.
 *
 * A primitive: it paints nothing and takes no `tone`, so it composes underneath
 * a component without bringing a surface of its own. Holds no state and calls
 * no hook, so it renders on the server as it is.
 */
export const Stack = ({
  direction = 'column',
  gap = 4,
  align = 'stretch',
  justify = 'start',
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
        styles.align[align],
        styles.justify[justify],
        wrap && styles.wrap,
        className,
      )}
      {...rest}
    />
  );
};
