import type { ReactNode } from 'react';
import { vars } from '../../themes.css';
import { stack } from '../utils/stack';

export const Page = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <article style={{ maxWidth: '64rem', margin: '0 auto', ...stack(vars.space[16]) }}>
      <h1
        style={{
          margin: 0,
          fontSize: vars.font.size['3xl'],
          fontWeight: vars.font.weight.bold,
          lineHeight: vars.font.lineHeight.tight,
          letterSpacing: vars.font.letterSpacing.tight,
        }}
      >
        {title}
      </h1>
      {children}
    </article>
  );
};
