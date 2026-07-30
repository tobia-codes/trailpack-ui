/**
 * The reference is styled with inline `vars` throughout, which is deliberate:
 * the page is also a working demonstration that the tokens need no bundler
 * plugin and no vanilla-extract in the consumer.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { guidance } from '../guidance';
import { vars } from '../themes.css';
import { breakpoints, media, toneNames, type ToneName } from '../tokens';
import { Grid } from './components/Grid';
import { Label } from './components/Label';
import { Page } from './components/Page';
import { Section } from './components/Section';
import { Swatch } from './components/Swatch';
import { useTokens } from './contexts/theme';

const meta: Meta = {
  title: 'Foundations/Tokens',
};

export default meta;
type Story = StoryObj;

// Keys are listed rather than derived from `Object.keys`, so that indexing
// `vars` stays typed and the display order is the order that makes sense to
// read, not insertion order.
const colorKeys = [
  'background',
  'surface',
  'muted',
  'foreground',
  'mutedForeground',
  'border',
  'borderStrong',
  'ring',
  'overlay',
] as const;

const toneSteps = [
  'solid',
  'solidHover',
  'solidActive',
  'onSolid',
  'subtle',
  'subtleHover',
  'onSubtle',
  'text',
  'border',
] as const;

const spaceKeys = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24] as const;
const breakpointKeys = ['sm', 'md', 'lg', 'xl'] as const;
const radiusKeys = ['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const;
const fontSizeKeys = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
const weightKeys = ['regular', 'medium', 'semibold', 'bold'] as const;
const lineHeightKeys = ['none', 'tight', 'snug', 'normal', 'relaxed'] as const;
const trackingKeys = ['tight', 'normal', 'wide'] as const;
const shadowKeys = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const iconKeys = ['sm', 'md', 'lg', 'xl'] as const;
const layerKeys = ['base', 'dropdown', 'sticky', 'overlay', 'modal', 'popover', 'toast'] as const;

export const Overview: Story = {
  render: () => {
    const { title, sections } = guidance.overview;

    return (
      <Page title={title}>
        <Section section={sections.whatTheseAre} />
        <Section section={sections.lightAndDark} />
      </Page>
    );
  },
};

export const Color: Story = {
  render: function ColorStory() {
    const tokens = useTokens();
    const { title, sections } = guidance.color;

    return (
      <Page title={title}>
        <Section section={sections.surfaces}>
          <Grid>
            {colorKeys.map((key) => (
              <Swatch
                key={key}
                name={`color.${key}`}
                value={tokens.color[key]}
                fill={vars.color[key]}
              />
            ))}
          </Grid>
          <SurfaceDemo />
        </Section>
      </Page>
    );
  },
};

const SurfaceDemo = () => {
  return (
    <div
      style={{
        background: vars.color.background,
        border: `1px solid ${vars.color.border}`,
        borderRadius: vars.radius.lg,
        padding: vars.space[6],
      }}
    >
      <div
        style={{
          background: vars.color.surface,
          border: `1px solid ${vars.color.border}`,
          borderRadius: vars.radius.md,
          boxShadow: vars.shadow.sm,
          padding: vars.space[5],
          display: 'flex',
          flexDirection: 'column',
          gap: vars.space[2],
        }}
      >
        <span style={{ fontWeight: vars.font.weight.semibold }}>Card on the page</span>
        <span style={{ color: vars.color.mutedForeground, fontSize: vars.font.size.sm }}>
          Secondary text inside it
        </span>
        <div
          style={{
            background: vars.color.muted,
            border: `1px solid ${vars.color.border}`,
            borderRadius: vars.radius.sm,
            padding: `${vars.space[2]} ${vars.space[3]}`,
            color: vars.color.mutedForeground,
            fontSize: vars.font.size.sm,
          }}
        >
          A recessed input fill
        </div>
      </div>
    </div>
  );
};

export const Tones: Story = {
  render: function TonesStory() {
    const tokens = useTokens();
    const { title, sections } = guidance.tones;

    return (
      <Page title={title}>
        <Section section={sections.pickTheMeaning} />
        <Section section={sections.theNineSteps} />
        <Section section={sections.inUse}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space[8] }}>
            {toneNames.map((tone) => (
              <ToneRow key={tone} tone={tone} values={tokens.tone[tone]} />
            ))}
          </div>
        </Section>
      </Page>
    );
  },
};

const ToneRow = ({ tone, values }: { tone: ToneName; values: Record<string, string> }) => {
  const t = vars.tone[tone];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space[3] }}>
      <span style={{ fontFamily: vars.font.family.mono, fontSize: vars.font.size.sm }}>
        tone.{tone}
      </span>

      <div style={{ display: 'flex', gap: vars.space[3], alignItems: 'center', flexWrap: 'wrap' }}>
        <span
          style={{
            background: t.solid,
            color: t.onSolid,
            padding: `${vars.space[2]} ${vars.space[4]}`,
            borderRadius: vars.radius.sm,
            fontSize: vars.font.size.sm,
            fontWeight: vars.font.weight.medium,
          }}
        >
          solid / onSolid
        </span>
        <span
          style={{
            background: t.subtle,
            color: t.onSubtle,
            border: `1px solid ${t.border}`,
            padding: `${vars.space[2]} ${vars.space[4]}`,
            borderRadius: vars.radius.sm,
            fontSize: vars.font.size.sm,
          }}
        >
          subtle / onSubtle / border
        </span>
        <span style={{ color: t.text, fontSize: vars.font.size.sm }}>text on the page</span>
      </div>

      <div style={{ display: 'flex', gap: vars.space[2], flexWrap: 'wrap' }}>
        {toneSteps.map((step) => (
          <div key={step} style={{ display: 'flex', flexDirection: 'column', gap: vars.space[1] }}>
            <div
              style={{
                width: vars.space[16],
                height: vars.space[8],
                background: t[step],
                border: `1px solid ${vars.color.border}`,
                borderRadius: vars.radius.sm,
              }}
            />
            <Label name={step} value={values[step]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const Spacing: Story = {
  render: function SpacingStory() {
    const tokens = useTokens();
    const { title, sections } = guidance.spacing;

    return (
      <Page title={title}>
        <Section section={sections.oneScale}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space[2] }}>
            {spaceKeys.map((key) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: vars.space[4] }}>
                <span
                  style={{
                    fontFamily: vars.font.family.mono,
                    fontSize: vars.font.size.xs,
                    width: vars.space[20],
                    color: vars.color.mutedForeground,
                  }}
                >
                  space[{key}]
                </span>
                <div
                  style={{
                    width: vars.space[key],
                    height: vars.space[4],
                    background: vars.tone.accent.solid,
                    borderRadius: vars.radius.xs,
                  }}
                />
                <span
                  style={{
                    fontFamily: vars.font.family.mono,
                    fontSize: vars.font.size.xs,
                    color: vars.color.mutedForeground,
                  }}
                >
                  {tokens.space[key]}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </Page>
    );
  },
};

export const Breakpoints: Story = {
  render: () => {
    const { title, sections } = guidance.breakpoints;

    return (
      <Page title={title}>
        <Section section={sections.mobileFirst}>
          <style>{breakpointCss}</style>
          <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space[4] }}>
            <div style={{ display: 'flex', gap: vars.space[2], flexWrap: 'wrap' }}>
              {breakpointKeys.map((key) => (
                <div key={key} className="tp-breakpoint-chip" data-breakpoint={key}>
                  <span>media.{key}</span>
                  <span>{breakpoints[key]}</span>
                </div>
              ))}
            </div>
            <p
              style={{
                margin: 0,
                color: vars.color.mutedForeground,
                fontSize: vars.font.size.sm,
              }}
            >
              Resize the canvas: a chip fills in once its own query matches, and the pair below
              stops being stacked at <code style={{ fontFamily: vars.font.family.mono }}>md</code>.
            </p>
            <div className="tp-breakpoint-pair">
              <StackedPanel label="Stacked below md" />
              <StackedPanel label="Side by side from md" />
            </div>
          </div>
        </Section>

        <Section section={sections.writingTheQuery} />
      </Page>
    );
  },
};

// The chips light up from the same `media` strings a component would use, so
// what the reference shows is the tokens working rather than a picture of them.
const breakpointCss = `
.tp-breakpoint-chip {
  display: flex;
  flex-direction: column;
  gap: ${vars.space[1]};
  background: ${vars.color.muted};
  color: ${vars.color.mutedForeground};
  border: 1px solid ${vars.color.border};
  border-radius: ${vars.radius.sm};
  padding: ${vars.space[2]} ${vars.space[3]};
  font-family: ${vars.font.family.mono};
  font-size: ${vars.font.size.xs};
}
.tp-breakpoint-pair {
  display: flex;
  flex-direction: column;
  gap: ${vars.space[3]};
}
${breakpointKeys
  .map(
    (key) => `@media ${media[key]} {
  .tp-breakpoint-chip[data-breakpoint="${key}"] {
    background: ${vars.tone.accent.subtle};
    color: ${vars.tone.accent.onSubtle};
    border-color: ${vars.tone.accent.border};
  }
}`,
  )
  .join('\n')}
@media ${media.md} {
  .tp-breakpoint-pair {
    flex-direction: row;
  }
}
`;

const StackedPanel = ({ label }: { label: string }) => {
  return (
    <div
      style={{
        flex: 1,
        background: vars.color.surface,
        border: `1px solid ${vars.color.border}`,
        borderRadius: vars.radius.md,
        boxShadow: vars.shadow.xs,
        padding: vars.space[5],
        fontSize: vars.font.size.sm,
      }}
    >
      {label}
    </div>
  );
};

export const Radius: Story = {
  render: function RadiusStory() {
    const tokens = useTokens();
    const { title, sections } = guidance.radius;

    return (
      <Page title={title}>
        <Section section={sections.corners}>
          <Grid min="9rem">
            {radiusKeys.map((key) => (
              <div
                key={key}
                style={{ display: 'flex', flexDirection: 'column', gap: vars.space[2] }}
              >
                <div
                  style={{
                    height: vars.space[20],
                    background: vars.color.muted,
                    border: `1px solid ${vars.color.borderStrong}`,
                    borderRadius: vars.radius[key],
                  }}
                />
                <Label name={`radius.${key}`} value={tokens.radius[key]} />
              </div>
            ))}
          </Grid>
        </Section>
      </Page>
    );
  },
};

export const Typography: Story = {
  render: function TypographyStory() {
    const tokens = useTokens();
    const { title, sections } = guidance.typography;

    return (
      <Page title={title}>
        <Section section={sections.family} />

        <Section section={sections.size}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space[4] }}>
            {fontSizeKeys.map((key) => (
              <div
                key={key}
                style={{ display: 'flex', alignItems: 'baseline', gap: vars.space[4] }}
              >
                <span
                  style={{
                    fontFamily: vars.font.family.mono,
                    fontSize: vars.font.size.xs,
                    color: vars.color.mutedForeground,
                    width: vars.space[24],
                    flexShrink: 0,
                  }}
                >
                  {key} · {tokens.font.size[key]}
                </span>
                <span
                  style={{ fontSize: vars.font.size[key], lineHeight: vars.font.lineHeight.tight }}
                >
                  Pack my box
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section section={sections.weight}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space[2] }}>
            {weightKeys.map((key) => (
              <div
                key={key}
                style={{ display: 'flex', alignItems: 'baseline', gap: vars.space[4] }}
              >
                <span
                  style={{
                    fontFamily: vars.font.family.mono,
                    fontSize: vars.font.size.xs,
                    color: vars.color.mutedForeground,
                    width: vars.space[24],
                    flexShrink: 0,
                  }}
                >
                  {key} · {tokens.font.weight[key]}
                </span>
                <span style={{ fontSize: vars.font.size.lg, fontWeight: vars.font.weight[key] }}>
                  Pack my box with five dozen jugs
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section section={sections.rhythm}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space[6] }}>
            {lineHeightKeys.map((key) => (
              <div
                key={key}
                style={{ display: 'flex', flexDirection: 'column', gap: vars.space[1] }}
              >
                <Label name={`lineHeight.${key}`} value={tokens.font.lineHeight[key]} />
                <p
                  style={{
                    margin: 0,
                    maxWidth: '34rem',
                    lineHeight: vars.font.lineHeight[key],
                    background: vars.color.muted,
                    borderRadius: vars.radius.sm,
                    padding: vars.space[3],
                    fontSize: vars.font.size.sm,
                  }}
                >
                  Distance between the lines is what makes a paragraph scannable; it is the setting
                  people notice only when it is wrong.
                </p>
              </div>
            ))}
            {trackingKeys.map((key) => (
              <div
                key={key}
                style={{ display: 'flex', flexDirection: 'column', gap: vars.space[1] }}
              >
                <Label name={`letterSpacing.${key}`} value={tokens.font.letterSpacing[key]} />
                <span
                  style={{
                    fontSize: vars.font.size.xl,
                    letterSpacing: vars.font.letterSpacing[key],
                  }}
                >
                  Tracking changes the texture
                </span>
              </div>
            ))}
          </div>
        </Section>
      </Page>
    );
  },
};

export const Elevation: Story = {
  render: function ElevationStory() {
    const tokens = useTokens();
    const { title, sections } = guidance.elevation;

    return (
      <Page title={title}>
        <Section section={sections.shadows}>
          <Grid min="10rem">
            {shadowKeys.map((key) => (
              <div
                key={key}
                style={{ display: 'flex', flexDirection: 'column', gap: vars.space[3] }}
              >
                <div
                  style={{
                    height: vars.space[20],
                    background: vars.color.surface,
                    border: `1px solid ${vars.color.border}`,
                    borderRadius: vars.radius.md,
                    boxShadow: vars.shadow[key],
                  }}
                />
                <Label name={`shadow.${key}`} value={tokens.shadow[key]} />
              </div>
            ))}
          </Grid>
        </Section>

        <Section section={sections.layering}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space[1] }}>
            {layerKeys.map((key) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  background: vars.color.muted,
                  border: `1px solid ${vars.color.border}`,
                  borderRadius: vars.radius.sm,
                  padding: `${vars.space[2]} ${vars.space[3]}`,
                  fontFamily: vars.font.family.mono,
                  fontSize: vars.font.size.xs,
                }}
              >
                <span>zIndex.{key}</span>
                <span style={{ color: vars.color.mutedForeground }}>{tokens.zIndex[key]}</span>
              </div>
            ))}
          </div>
        </Section>
      </Page>
    );
  },
};

export const IconsAndFocus: Story = {
  render: function IconsAndFocusStory() {
    const tokens = useTokens();
    const { title, sections } = guidance.iconsAndFocus;

    return (
      <Page title={title}>
        <Section section={sections.iconSize}>
          <div style={{ display: 'flex', gap: vars.space[8], alignItems: 'flex-end' }}>
            {iconKeys.map((key) => (
              <div
                key={key}
                style={{ display: 'flex', flexDirection: 'column', gap: vars.space[2] }}
              >
                <svg
                  width={vars.iconSize[key]}
                  height={vars.iconSize[key]}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={vars.color.foreground}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
                <Label name={key} value={tokens.iconSize[key]} />
              </div>
            ))}
          </div>
        </Section>

        <Section section={sections.focusRing}>
          <style>{focusRingCss}</style>
          <div style={{ display: 'flex', gap: vars.space[4], flexWrap: 'wrap' }}>
            <FocusDemo
              label="Primary"
              background={vars.tone.accent.solid}
              color={vars.tone.accent.onSolid}
            />
            <FocusDemo
              label="Secondary"
              background={vars.color.surface}
              color={vars.color.foreground}
            />
          </div>
        </Section>
      </Page>
    );
  },
};

// `:focus-visible` cannot be expressed as an inline style, so the ring goes
// through a stylesheet — which is also how a real component would apply it.
const focusRingCss = `
.tp-focus-demo {
  outline: none;
}
.tp-focus-demo:focus-visible {
  outline: ${vars.focusRing.width} solid ${vars.color.ring};
  outline-offset: ${vars.focusRing.offset};
}
`;

const FocusDemo = ({
  label,
  background,
  color,
}: {
  label: string;
  background: string;
  color: string;
}) => {
  return (
    <button
      type="button"
      className="tp-focus-demo"
      style={{
        background,
        color,
        fontFamily: 'inherit',
        fontSize: vars.font.size.sm,
        fontWeight: vars.font.weight.medium,
        border: `1px solid ${vars.color.border}`,
        borderRadius: vars.radius.sm,
        padding: `${vars.space[2]} ${vars.space[4]}`,
        cursor: 'pointer',
      }}
    >
      {label} — focus me
    </button>
  );
};
