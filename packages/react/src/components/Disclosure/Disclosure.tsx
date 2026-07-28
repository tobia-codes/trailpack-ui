'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';
import { useId } from 'react';
import { useDisclosure } from '../../hooks/useDisclosure';
import { cx } from '../../utils/cx';
import * as styles from './Disclosure.css';

export interface DisclosureProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  title: ReactNode;
  /** @default false */
  defaultOpen?: boolean;
}

/**
 * Panel that expands and collapses.
 *
 * Holds its own state, which is what puts `'use client'` at the top of this
 * module — it is a client boundary wherever it is rendered, and a Server
 * Component may still render it.
 */
export const Disclosure = ({
  title,
  defaultOpen = false,
  children,
  className,
  ...rest
}: DisclosureProps) => {
  const { isOpen, toggle } = useDisclosure(defaultOpen);
  const panelId = useId();

  return (
    <div className={cx(styles.root, className)} {...rest}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={toggle}
      >
        {title}
        <svg
          className={cx(styles.marker, isOpen && styles.markerOpen)}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
      <div id={panelId} className={styles.panel} hidden={!isOpen}>
        {children}
      </div>
    </div>
  );
};
