import type { CSSProperties } from 'react';

export const stack = (gap: string): CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  gap,
});
