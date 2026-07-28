'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Tracks a CSS media query.
 *
 * The server snapshot is always `false`, because `matchMedia` does not exist
 * there and the first client render has to produce the same markup as the HTML
 * it hydrates. A query that is true resolves on the pass right after hydration
 * rather than mismatching — so this reports "not matching" for one frame, and
 * must not be used to decide what renders at all on a first paint.
 */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onStoreChange);

      return () => list.removeEventListener('change', onStoreChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
};
