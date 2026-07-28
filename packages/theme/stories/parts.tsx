/**
 * Presentation helpers for the token reference story.
 *
 * Everything here is styled with inline `vars`, which is deliberate: the page
 * is also a working demonstration that the tokens need no bundler plugin and
 * no vanilla-extract in the consumer.
 */
import { createContext, type CSSProperties, type ReactNode, use } from 'react';
import { vars } from '../src/themes.css';
import { darkTokens, lightTokens } from '../src/tokens';

const ThemeContext = createContext<'light' | 'dark'>('light');

export function ThemeProvider({
  theme,
  children,
}: {
  theme: 'light' | 'dark';
  children: ReactNode;
}) {
  return <ThemeContext value={theme}>{children}</ThemeContext>;
}

/**
 * The raw token values for whichever theme the toolbar has selected. `vars`
 * gives the `var(--…)` reference that renders the swatch; this gives the value
 * printed underneath it.
 */
export function useTokens() {
  return use(ThemeContext) === 'dark' ? darkTokens : lightTokens;
}

const stack = (gap: string): CSSProperties => ({ display: 'flex', flexDirection: 'column', gap });

export function Page({ title, children }: { title: string; children: ReactNode }) {
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
}

// `lead` before `children` on purpose: the guidance is the point of the page,
// the specimens only make it concrete.
export function Section({
  title,
  lead,
  children,
}: {
  title: string;
  lead: ReactNode;
  children: ReactNode;
}) {
  return (
    <section style={stack(vars.space[6])}>
      <div style={stack(vars.space[3])}>
        <h2
          style={{
            margin: 0,
            fontSize: vars.font.size.xl,
            fontWeight: vars.font.weight.semibold,
            lineHeight: vars.font.lineHeight.tight,
          }}
        >
          {title}
        </h2>
        <div style={{ ...stack(vars.space[3]), maxWidth: '48rem' }}>{lead}</div>
      </div>
      {children}
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p style={{ margin: 0, lineHeight: vars.font.lineHeight.relaxed }}>{children}</p>;
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        margin: 0,
        color: vars.color.mutedForeground,
        fontSize: vars.font.size.sm,
        lineHeight: vars.font.lineHeight.relaxed,
        borderLeft: `2px solid ${vars.color.border}`,
        paddingLeft: vars.space[4],
      }}
    >
      {children}
    </p>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code
      style={{
        fontFamily: vars.font.family.mono,
        fontSize: '0.9em',
        background: vars.color.muted,
        color: vars.color.foreground,
        padding: `0 ${vars.space[1]}`,
        borderRadius: vars.radius.xs,
      }}
    >
      {children}
    </code>
  );
}

/** `token` is the path under `vars`; `when` is the rule for reaching for it. */
export type UseRow = { token: string; when: ReactNode };

export function WhenToUse({ rows }: { rows: readonly UseRow[] }) {
  return (
    <table
      style={{
        borderCollapse: 'collapse',
        width: '100%',
        textAlign: 'left',
        fontSize: vars.font.size.sm,
      }}
    >
      <thead>
        <tr style={{ borderBottom: `1px solid ${vars.color.borderStrong}` }}>
          <th
            style={{ padding: vars.space[2], fontWeight: vars.font.weight.semibold, width: '30%' }}
          >
            Token
          </th>
          <th style={{ padding: vars.space[2], fontWeight: vars.font.weight.semibold }}>
            Use it for
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.token} style={{ borderBottom: `1px solid ${vars.color.border}` }}>
            <td
              style={{
                padding: vars.space[2],
                fontFamily: vars.font.family.mono,
                color: vars.tone.accent.text,
                verticalAlign: 'top',
                whiteSpace: 'nowrap',
              }}
            >
              {row.token}
            </td>
            <td
              style={{
                padding: vars.space[2],
                color: vars.color.mutedForeground,
                lineHeight: vars.font.lineHeight.snug,
              }}
            >
              {row.when}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Grid({ min = '11rem', children }: { min?: string; children: ReactNode }) {
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
}

export function Label({ name, value }: { name: string; value?: string }) {
  return (
    <div style={stack(vars.space[1])}>
      <span style={{ fontFamily: vars.font.family.mono, fontSize: vars.font.size.xs }}>{name}</span>
      {value !== undefined && (
        <span
          style={{
            fontFamily: vars.font.family.mono,
            fontSize: vars.font.size.xs,
            color: vars.color.mutedForeground,
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

export function Swatch({ name, value, fill }: { name: string; value: string; fill: string }) {
  return (
    <div style={stack(vars.space[2])}>
      <div
        style={{
          background: fill,
          height: vars.space[16],
          borderRadius: vars.radius.md,
          // Without this, `surface` on `background` in the light theme is an
          // invisible swatch on an invisible card.
          border: `1px solid ${vars.color.border}`,
        }}
      />
      <Label name={name} value={value} />
    </div>
  );
}
