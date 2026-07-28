import type { Meta, StoryObj } from '@storybook/react-vite';
import { vars } from '../src/themes.css';
import type { ToneName } from '../src/tokens';
import { Code, Grid, Label, Note, P, Page, Section, Swatch, useTokens, WhenToUse } from './parts';

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

const toneNames = ['accent', 'neutral', 'danger', 'success', 'warning', 'info'] as const;

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
const radiusKeys = ['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const;
const fontSizeKeys = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
const weightKeys = ['regular', 'medium', 'semibold', 'bold'] as const;
const lineHeightKeys = ['none', 'tight', 'snug', 'normal', 'relaxed'] as const;
const trackingKeys = ['tight', 'normal', 'wide'] as const;
const shadowKeys = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const iconKeys = ['sm', 'md', 'lg', 'xl'] as const;
const layerKeys = ['base', 'dropdown', 'sticky', 'overlay', 'modal', 'popover', 'toast'] as const;

/* -------------------------------------------------------------------------- */

export const Overview: Story = {
  render: () => (
    <Page title="Tokens">
      <Section
        title="What these are"
        lead={
          <>
            <P>
              Every value a component needs — a colour, a gap, a corner, a type size — comes from
              this set. A component that writes <Code>#7c3aed</Code> or <Code>12px</Code> directly
              is a component that will not follow the dark theme and will drift from the rest of the
              UI the first time a value is adjusted.
            </P>
            <P>
              Reach for tokens by <strong>role</strong>, not by appearance. The question is never
              &ldquo;which grey looks right here&rdquo; but &ldquo;what is this element&rdquo; — a
              recessed fill, a secondary label, a divider. Pick the token that names that, and both
              themes come out correct for free.
            </P>
          </>
        }
      >
        <WhenToUse
          rows={[
            {
              token: 'tone.*',
              when: (
                <>
                  The thing carries a meaning: a primary action, an error, a success state. Start
                  here — if a tone fits, nothing else does.
                </>
              ),
            },
            {
              token: 'color.*',
              when: (
                <>
                  Neutral chrome with no meaning attached: the page, cards, dividers, body and
                  secondary text.
                </>
              ),
            },
            {
              token: 'space, radius, font, iconSize, shadow, zIndex',
              when: <>Geometry and type. Never theme-dependent except for shadows.</>,
            },
          ]}
        />
        <Note>
          The paths on <Code>vars</Code> are the public API. The CSS variable names behind them are
          vanilla-extract hashes and can change between releases — always go through{' '}
          <Code>vars</Code>, never type a <Code>var(--…)</Code> by hand.
        </Note>
      </Section>

      <Section
        title="Light and dark"
        lead={
          <P>
            There is one contract and two sets of values. The light theme sits on <Code>:root</Code>
            , the dark theme is a class you put on any element. Nothing in a component needs to know
            which is active — that is the whole point of going through the tokens.
          </P>
        }
      >
        <Note>
          Every colour pairing this set promises — <Code>onSolid</Code> on <Code>solid</Code>,{' '}
          <Code>onSubtle</Code> on <Code>subtle</Code>, <Code>text</Code> on the three page surfaces
          — is asserted against WCAG AA in <Code>src/themes.test.ts</Code>, in both themes.
          Combinations outside those pairs are not covered, which is the reason to stay inside them.
        </Note>
      </Section>
    </Page>
  ),
};

/* -------------------------------------------------------------------------- */

export const Color: Story = {
  render: function ColorStory() {
    const tokens = useTokens();

    return (
      <Page title="Color">
        <Section
          title="Surfaces and text"
          lead={
            <P>
              The neutral layer: everything that is structure rather than meaning. Three surfaces,
              two text weights, two borders, and two single-purpose values.
            </P>
          }
        >
          <WhenToUse
            rows={[
              { token: 'color.background', when: 'The page itself. One per view, at the root.' },
              {
                token: 'color.surface',
                when: 'Anything raised off the page: cards, panels, dropdowns, dialogs.',
              },
              {
                token: 'color.muted',
                when: 'Anything recessed into the page: input fills, table stripes, code blocks, disabled controls.',
              },
              {
                token: 'color.foreground',
                when: 'Primary text, and icons that carry the same weight as text.',
              },
              {
                token: 'color.mutedForeground',
                when: 'Secondary text: labels, help text, placeholders, timestamps. Not for body copy — it is quieter on purpose.',
              },
              {
                token: 'color.border',
                when: 'The default hairline: card outlines, dividers, input borders at rest.',
              },
              {
                token: 'color.borderStrong',
                when: 'A border that has to hold its own next to a filled control, or a divider that must read as a real separation.',
              },
              {
                token: 'color.ring',
                when: 'The focus ring colour, and nothing else. Give it no second job.',
              },
              {
                token: 'color.overlay',
                when: 'The scrim behind a modal or drawer. Already semi-transparent — do not add opacity on top.',
              },
            ]}
          />

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

          <Note>
            <Code>surface</Code> and <Code>muted</Code> are roles, not brightness steps. In the dark
            theme a raised surface is <em>lighter</em> than the page; in the light theme it is the
            same white and the separation comes from <Code>border</Code> and <Code>shadow</Code>.
            Choosing by role is what keeps that working in both directions.
          </Note>

          <SurfaceDemo />
        </Section>
      </Page>
    );
  },
};

function SurfaceDemo() {
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
}

/* -------------------------------------------------------------------------- */

export const Tones: Story = {
  render: function TonesStory() {
    const tokens = useTokens();

    return (
      <Page title="Tones">
        <Section
          title="Pick the meaning, then the step"
          lead={
            <>
              <P>
                A tone is one meaning in all the forms a component needs it. Choosing is two
                decisions: <strong>which tone</strong> says what you mean, then{' '}
                <strong>which step</strong> matches the role the colour plays — background, text on
                that background, or outline.
              </P>
              <P>
                Because every tone has the same nine steps, anything that varies across tones can be
                written once and indexed: <Code>vars.tone[tone].subtle</Code>.
              </P>
            </>
          }
        >
          <WhenToUse
            rows={[
              {
                token: 'tone.accent',
                when: 'Brand and primary action. The one call to action in a view, links, selected state. Not a success colour.',
              },
              {
                token: 'tone.neutral',
                when: 'A tone-shaped grey. For secondary buttons and badges, and as the default when a component takes a tone but the content carries no meaning.',
              },
              {
                token: 'tone.danger',
                when: 'Destructive actions and errors: delete, validation failures, failed jobs.',
              },
              {
                token: 'tone.success',
                when: 'Something completed or is passing. Confirmations, healthy status.',
              },
              {
                token: 'tone.warning',
                when: 'Needs attention but nothing is broken: quota nearly reached, deprecated setting.',
              },
              {
                token: 'tone.info',
                when: 'Neutral information that is not a state: tips, hints, in-progress notices.',
              },
            ]}
          />
        </Section>

        <Section
          title="The nine steps"
          lead={
            <P>
              The steps are pairs. Foreground steps belong to a specific background step, and only
              those combinations are contrast-tested — <Code>onSubtle</Code> on a solid fill, or{' '}
              <Code>text</Code> on <Code>solid</Code>, are outside the guarantee.
            </P>
          }
        >
          <WhenToUse
            rows={[
              {
                token: 'solid',
                when: 'The filled background: primary button, filled badge, progress bar. A background, never a text colour.',
              },
              {
                token: 'solidHover / solidActive',
                when: 'Pointer feedback on that fill. Hover brightens in dark, darkens in light; active is always the pressed step.',
              },
              { token: 'onSolid', when: 'Text and icons sitting on any of the three solid steps.' },
              {
                token: 'subtle',
                when: 'The soft fill: alert background, quiet badge, selected row. Sits on the page without shouting.',
              },
              { token: 'subtleHover', when: 'Pointer feedback on a subtle fill.' },
              { token: 'onSubtle', when: 'Text and icons on a subtle fill.' },
              {
                token: 'text',
                when: (
                  <>
                    The tone as text directly on <Code>background</Code>, <Code>surface</Code> or{' '}
                    <Code>muted</Code>: inline validation messages, tinted links, status labels with
                    no fill behind them.
                  </>
                ),
              },
              {
                token: 'border',
                when: 'The outline of a subtle fill, or a divider that should carry the tone.',
              },
            ]}
          />

          <Note>
            <Code>text</Code> exists separately from <Code>solid</Code> because they cannot be the
            same value. <Code>tone.warning.solid</Code> is an amber at roughly 2:1 on white — fine
            as a fill, unreadable as a sentence. Reaching for <Code>solid</Code> as a text colour is
            the single most common way to fail contrast with this set.
          </Note>
        </Section>

        <Section
          title="In use"
          lead={<P>Each tone in the three shapes it is actually used in, and its full ramp.</P>}
        >
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

function ToneRow({ tone, values }: { tone: ToneName; values: Record<string, string> }) {
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
}

/* -------------------------------------------------------------------------- */

export const Spacing: Story = {
  render: function SpacingStory() {
    const tokens = useTokens();

    return (
      <Page title="Spacing">
        <Section
          title="One scale for gaps and padding"
          lead={
            <>
              <P>
                The key is the multiplier: <Code>space[4]</Code> is 4 × 4px = <Code>1rem</Code>. In{' '}
                <Code>rem</Code>, so spacing grows with the reader&rsquo;s browser font size and
                stays in proportion with the text it surrounds.
              </P>
              <P>
                Pick a step by how closely two things belong together. Distance is the main signal a
                layout has for grouping — inconsistent gaps read as accidental relationships.
              </P>
            </>
          }
        >
          <WhenToUse
            rows={[
              {
                token: 'space[1] – space[2]',
                when: 'Inside a single control: icon-to-label gap, badge padding, the space between a checkbox and its text.',
              },
              {
                token: 'space[3] – space[4]',
                when: 'Padding of buttons and inputs; the gap between two elements that form one unit, like a label and its field.',
              },
              {
                token: 'space[5] – space[6]',
                when: 'Card and panel padding; the gap between fields in a form.',
              },
              {
                token: 'space[8] – space[12]',
                when: 'Between distinct blocks inside a view: a heading and the section it introduces, one card from the next.',
              },
              {
                token: 'space[16] – space[24]',
                when: 'Page-level rhythm: the space around a layout, or between major sections of a long page.',
              },
            ]}
          />

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

          <Note>
            The scale is insertable — a step between <Code>6</Code> and <Code>8</Code> would be{' '}
            <Code>7</Code>. That is a reason to add a token rather than to write{' '}
            <Code>1.75rem</Code> inline.
          </Note>
        </Section>
      </Page>
    );
  },
};

/* -------------------------------------------------------------------------- */

export const Radius: Story = {
  render: function RadiusStory() {
    const tokens = useTokens();

    return (
      <Page title="Radius">
        <Section
          title="Corners"
          lead={
            <P>
              Radii stay in <Code>px</Code> while spacing is in <Code>rem</Code>, deliberately: a
              corner is a fixed optical detail. Scaling it with the reader&rsquo;s font size makes
              large containers look inflated rather than more readable.
            </P>
          }
        >
          <WhenToUse
            rows={[
              {
                token: 'radius.xs',
                when: 'Small square-ish things: checkboxes, tags, inline code, a progress bar.',
              },
              {
                token: 'radius.sm',
                when: 'Buttons, inputs, selects — the everyday control radius.',
              },
              { token: 'radius.md', when: 'Cards, dropdown menus, popovers, toasts.' },
              { token: 'radius.lg', when: 'Large containers: dialogs, drawers, page panels.' },
              {
                token: 'radius.xl',
                when: 'Deliberately soft, oversized surfaces. Marketing and empty states more than application UI.',
              },
              { token: 'radius.full', when: 'Pills, avatars, circular icon buttons, status dots.' },
            ]}
          />

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

          <Note>
            When one rounded box sits inside another, drop the inner one a step. Matching radii on
            nested corners leaves a visibly uneven margin at the curve.
          </Note>
        </Section>
      </Page>
    );
  },
};

/* -------------------------------------------------------------------------- */

export const Typography: Story = {
  render: function TypographyStory() {
    const tokens = useTokens();

    return (
      <Page title="Typography">
        <Section
          title="Family"
          lead={
            <P>
              A self-contained stack, so the package renders correctly with nothing installed.
              Naming a webfont here would tie the tokens to one app&rsquo;s font loading and
              silently fall back everywhere else.
            </P>
          }
        >
          <WhenToUse
            rows={[
              { token: 'font.family.sans', when: 'Everything.' },
              {
                token: 'font.family.mono',
                when: 'Content where character alignment carries meaning: code, IDs, hashes, numeric columns in a table.',
              },
            ]}
          />
        </Section>

        <Section
          title="Size"
          lead={
            <P>
              Seven steps. Two adjacent steps should not appear in the same block of UI — if the
              difference is not obvious, it reads as a mistake rather than a hierarchy.
            </P>
          }
        >
          <WhenToUse
            rows={[
              { token: 'font.size.xs', when: 'Captions, badge text, table metadata, footnotes.' },
              {
                token: 'font.size.sm',
                when: 'Secondary text, form labels, help text, and dense UI such as tables and sidebars.',
              },
              { token: 'font.size.md', when: 'Body text. The default — most of the UI is this.' },
              { token: 'font.size.lg', when: 'Card titles and lead paragraphs.' },
              { token: 'font.size.xl', when: 'Section headings inside a page.' },
              { token: 'font.size["2xl"]', when: 'Page titles.' },
              {
                token: 'font.size["3xl"]',
                when: 'Hero and marketing headlines. Rare in application UI.',
              },
            ]}
          />

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
                  style={{
                    fontSize: vars.font.size[key],
                    lineHeight: vars.font.lineHeight.tight,
                  }}
                >
                  Pack my box
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Weight"
          lead={
            <P>
              Weight carries hierarchy at the same size. In UI, prefer <Code>medium</Code> where
              print would use bold — at small sizes on a screen, <Code>bold</Code> reads as
              shouting.
            </P>
          }
        >
          <WhenToUse
            rows={[
              { token: 'font.weight.regular', when: 'Body text and anything long-form.' },
              {
                token: 'font.weight.medium',
                when: 'Button labels, form labels, table headers, the emphasised half of a key/value pair.',
              },
              {
                token: 'font.weight.semibold',
                when: 'Headings, card titles, the active item in a nav.',
              },
              { token: 'font.weight.bold', when: 'Page titles and display type. Sparingly.' },
            ]}
          />

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

        <Section
          title="Line height and letter spacing"
          lead={
            <P>
              These two move together with size: the larger the text, the tighter both should be.
              Body copy needs air between lines to be readable; a 2.5rem headline with the same
              settings falls apart into separate lines.
            </P>
          }
        >
          <WhenToUse
            rows={[
              {
                token: 'font.lineHeight.none',
                when: 'A box that must match the glyph exactly: an icon button, a numeric badge.',
              },
              { token: 'font.lineHeight.tight', when: 'Display and heading sizes — xl and above.' },
              {
                token: 'font.lineHeight.snug',
                when: 'Headings at UI sizes, and multi-line labels.',
              },
              { token: 'font.lineHeight.normal', when: 'Body text. The default.' },
              {
                token: 'font.lineHeight.relaxed',
                when: 'Long-form prose, documentation, help panels.',
              },
              {
                token: 'font.letterSpacing.tight',
                when: 'Large text (2xl and up), which looks loosely set at default tracking.',
              },
              { token: 'font.letterSpacing.normal', when: 'Everything else.' },
              {
                token: 'font.letterSpacing.wide',
                when: 'Uppercase micro-labels — the one case where letterforms need separating.',
              },
            ]}
          />

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

/* -------------------------------------------------------------------------- */

export const Elevation: Story = {
  render: function ElevationStory() {
    const tokens = useTokens();

    return (
      <Page title="Elevation">
        <Section
          title="Shadows"
          lead={
            <P>
              A shadow is a claim that something floats above the page — not decoration. The step
              should match how far above: a card is barely lifted, a dialog sits well clear of
              everything. Use the same step for everything at the same layer.
            </P>
          }
        >
          <WhenToUse
            rows={[
              {
                token: 'shadow.xs',
                when: 'A resting card or table row — just enough to separate it.',
              },
              { token: 'shadow.sm', when: 'An interactive card, or the hover state of an xs one.' },
              {
                token: 'shadow.md',
                when: 'Anchored floating layers: dropdowns, popovers, tooltips.',
              },
              { token: 'shadow.lg', when: 'Dialogs and drawers — things that come with a scrim.' },
              {
                token: 'shadow.xl',
                when: 'Full-screen panels and command palettes. If everything is xl, nothing reads as elevated.',
              },
            ]}
          />

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

          <Note>
            This is the one geometric scale that is themed. In the dark theme a black shadow on a
            near-black page does almost nothing, so elevation is carried by{' '}
            <Code>color.surface</Code> being lighter than <Code>color.background</Code> — the
            shadows are deepened but play a supporting role. Always pair a shadow with a surface
            token; a shadow alone will not read in dark mode.
          </Note>
        </Section>

        <Section
          title="Layering"
          lead={
            <P>
              <Code>zIndex</Code> is the same idea in stacking order. Never write a raw z-index: the
              value only means something relative to the others, so a literal is a guess about code
              you cannot see. The steps are 100 apart to leave room for local stacking inside a
              layer.
            </P>
          }
        >
          <WhenToUse
            rows={[
              { token: 'zIndex.base', when: 'In-flow content. The default; rarely written out.' },
              { token: 'zIndex.dropdown', when: 'Menus and selects anchored to a trigger.' },
              { token: 'zIndex.sticky', when: 'Sticky headers, toolbars, table header rows.' },
              {
                token: 'zIndex.overlay',
                when: (
                  <>
                    The scrim behind a modal — pairs with <Code>color.overlay</Code>.
                  </>
                ),
              },
              { token: 'zIndex.modal', when: 'Dialogs and drawers, above their own scrim.' },
              {
                token: 'zIndex.popover',
                when: 'Popovers and tooltips that have to work while a modal is open.',
              },
              { token: 'zIndex.toast', when: 'Notifications. Above everything, by definition.' },
            ]}
          />

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

/* -------------------------------------------------------------------------- */

export const IconsAndFocus: Story = {
  render: function IconsAndFocusStory() {
    const tokens = useTokens();

    return (
      <Page title="Icons and focus">
        <Section
          title="Icon size"
          lead={
            <P>
              Discrete steps rather than a size derived from <Code>font-size</Code>: stroke-based
              icons keep a constant stroke width, so they do not scale linearly with text — an icon
              set to <Code>2em</Code> looks heavier, not just bigger.
            </P>
          }
        >
          <WhenToUse
            rows={[
              {
                token: 'iconSize.sm',
                when: (
                  <>
                    Inline with <Code>font.size.sm</Code> text: table cells, dense lists, input
                    affordances.
                  </>
                ),
              },
              {
                token: 'iconSize.md',
                when: 'The default. Buttons, nav items, anything beside body text.',
              },
              { token: 'iconSize.lg', when: 'Section headers and standalone icon buttons.' },
              {
                token: 'iconSize.xl',
                when: 'Empty states and feature callouts, where the icon is the subject.',
              },
            ]}
          />

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

          <Note>
            <Code>md</Code> is 1.25rem while body text is 1rem. That is intentional: an icon at
            exactly the text size looks small next to it.
          </Note>
        </Section>

        <Section
          title="Focus ring"
          lead={
            <P>
              The geometry of the ring; its colour is <Code>color.ring</Code>. Separate tokens
              because every focusable component needs them, and they are only noticed once they are
              inconsistent. Tab into the buttons below to see it.
            </P>
          }
        >
          <WhenToUse
            rows={[
              {
                token: 'focusRing.width',
                when: (
                  <>
                    The <Code>outline-width</Code> of the ring, on every focusable element.
                  </>
                ),
              },
              {
                token: 'focusRing.offset',
                when: (
                  <>
                    The <Code>outline-offset</Code>, so the ring clears the element&rsquo;s own
                    border instead of sitting on it.
                  </>
                ),
              },
              {
                token: 'color.ring',
                when: 'The ring colour — one value for the whole UI, including on tone-coloured controls.',
              },
            ]}
          />

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

          <Note>
            Use <Code>outline</Code> rather than a <Code>box-shadow</Code> ring: an outline follows{' '}
            <Code>border-radius</Code>, survives <Code>overflow: hidden</Code>, and stays visible in
            forced-colours mode. And never remove the ring without putting an equivalent in its
            place — it is the only affordance a keyboard user has.
          </Note>
        </Section>
      </Page>
    );
  },
};

/**
 * `:focus-visible` cannot be expressed as an inline style, so the ring itself
 * goes through a stylesheet — which is also the honest demonstration, since
 * that is how a real component would apply it.
 */
const focusRingCss = `
.tp-focus-demo {
  outline: none;
}
.tp-focus-demo:focus-visible {
  outline: ${vars.focusRing.width} solid ${vars.color.ring};
  outline-offset: ${vars.focusRing.offset};
}
`;

function FocusDemo({
  label,
  background,
  color,
}: {
  label: string;
  background: string;
  color: string;
}) {
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
}
