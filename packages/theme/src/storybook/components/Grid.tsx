import type { ReactNode } from 'react';
import { vars } from '../../themes.css';

export const Grid = ({ min = '11rem', children }: { min?: string; children: ReactNode }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${min}, 1fr))`,
        gap: vars.space[4],
      }}
    >
      {children}
    </div>
  );
};
