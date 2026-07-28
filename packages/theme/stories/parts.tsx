/**
 * Presentation helpers for the token reference.
 *
 * Everything here is styled with inline `vars`, which is deliberate: the page
 * is also a working demonstration that the tokens need no bundler plugin and
 * no vanilla-extract in the consumer.
 */
import { createContext, type CSSProperties, type ReactNode, use } from 'react';
import { vars } from '../src/themes.css';
import type { GuidanceSection } from '../src/guidance';
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

function Code({ children }: { children: ReactNode }) {
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

// Guidance prose marks code with backticks so the same string can also be
// emitted as markdown. Odd-indexed splits are the code spans.
function Inline({ text }: { text: string }) {
  return (
    <>{text.split('`').map((part, i) => (i % 2 === 1 ? <Code key={i}>{part}</Code> : part))}</>
  );
}

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

/**
 * One section of the reference, driven by `src/guidance.ts`. The layout order
 * is fixed — lead, rules, specimens, caveats — so that the same data renders
 * as markdown for the agent skill without a per-section layout hint.
 */
export function Section({ section, children }: { section: GuidanceSection; children?: ReactNode }) {
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
          {section.title}
        </h2>
        <div style={{ ...stack(vars.space[3]), maxWidth: '48rem' }}>
          {section.lead.map((paragraph) => (
            <p key={paragraph} style={{ margin: 0, lineHeight: vars.font.lineHeight.relaxed }}>
              <Inline text={paragraph} />
            </p>
          ))}
        </div>
      </div>

      {section.rows && <WhenToUse rows={section.rows} />}
      {children}

      {section.notes?.map((note) => (
        <p
          key={note}
          style={{
            margin: 0,
            maxWidth: '48rem',
            color: vars.color.mutedForeground,
            fontSize: vars.font.size.sm,
            lineHeight: vars.font.lineHeight.relaxed,
            borderLeft: `2px solid ${vars.color.border}`,
            paddingLeft: vars.space[4],
          }}
        >
          <Inline text={note} />
        </p>
      ))}
    </section>
  );
}

function WhenToUse({ rows }: { rows: readonly { token: string; when: string }[] }) {
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
              <Inline text={row.when} />
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
