import type { ReactNode } from 'react';
import { vars } from '../../themes.css';
import type { GuidanceSection } from '../../guidance';
import { stack } from '../utils/stack';

/**
 * One section of the reference, driven by `src/guidance.ts`. The layout order
 * is fixed — lead, rules, specimens, caveats — so that the same data renders
 * as markdown for the agent skill without a per-section layout hint.
 */
export const Section = ({
  section,
  children,
}: {
  section: GuidanceSection;
  children?: ReactNode;
}) => {
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
};

const WhenToUse = ({ rows }: { rows: readonly { token: string; when: string }[] }) => {
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
};

// Guidance prose marks code with backticks so the same string can also be
// emitted as markdown. Odd-indexed splits are the code spans.
const Inline = ({ text }: { text: string }) => {
  return (
    <>{text.split('`').map((part, i) => (i % 2 === 1 ? <Code key={i}>{part}</Code> : part))}</>
  );
};

const Code = ({ children }: { children: ReactNode }) => {
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
};
