/**
 * When to reach for which token — the prose half of the token contract.
 *
 * This is the single source for both renderings of that guidance: the
 * Storybook reference under `stories/`, and the generated agent skill at
 * `.claude/skills/tokens/SKILL.md`. Written twice, it would be wrong once.
 *
 * Prose uses `backticks` for code; each renderer turns them into whatever it
 * needs. Avoid `|`, which would break the generated markdown tables.
 */

/** A row of the "use it for" table: a path under `vars`, and the rule for it. */
export type GuidanceRow = { token: string; when: string };

export type GuidanceSection = {
  title: string;
  /** Paragraphs of lead-in prose, before the table. */
  lead: readonly string[];
  rows?: readonly GuidanceRow[];
  /** Caveats, rendered after the specimens. */
  notes?: readonly string[];
};

export type GuidanceChapter = {
  title: string;
  sections: Readonly<Record<string, GuidanceSection>>;
};

export const guidance = {
  overview: {
    title: 'Tokens',
    sections: {
      whatTheseAre: {
        title: 'What these are',
        lead: [
          'Every value a component needs — a colour, a gap, a corner, a type size — comes from this set. A component that writes `#7c3aed` or `12px` directly is a component that will not follow the dark theme and will drift from the rest of the UI the first time a value is adjusted.',
          'Reach for tokens by role, not by appearance. The question is never "which grey looks right here" but "what is this element" — a recessed fill, a secondary label, a divider. Pick the token that names that, and both themes come out correct for free.',
        ],
        rows: [
          {
            token: 'tone.*',
            when: 'The thing carries a meaning: a primary action, an error, a success state. Start here — if a tone fits, nothing else does.',
          },
          {
            token: 'color.*',
            when: 'Neutral chrome with no meaning attached: the page, cards, dividers, body and secondary text.',
          },
          {
            token: 'space, radius, font, iconSize, shadow, zIndex',
            when: 'Geometry and type. Never theme-dependent except for shadows.',
          },
        ],
        notes: [
          'The paths on `vars` are the public API. The CSS variable names behind them are vanilla-extract hashes and can change between releases — always go through `vars`, never type a `var(--…)` by hand.',
        ],
      },
      lightAndDark: {
        title: 'Light and dark',
        lead: [
          'There is one contract and two sets of values. The light theme sits on `:root`, the dark theme is a class you put on any element. Nothing in a component needs to know which is active — that is the whole point of going through the tokens.',
        ],
        notes: [
          'Every colour pairing this set promises — `onSolid` on `solid`, `onSubtle` on `subtle`, `text` on the three page surfaces — is asserted against WCAG AA in `src/themes.test.ts`, in both themes. Combinations outside those pairs are not covered, which is the reason to stay inside them.',
        ],
      },
    },
  },

  color: {
    title: 'Color',
    sections: {
      surfaces: {
        title: 'Surfaces and text',
        lead: [
          'The neutral layer: everything that is structure rather than meaning. Three surfaces, two text weights, two borders, and two single-purpose values.',
        ],
        rows: [
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
        ],
        notes: [
          '`surface` and `muted` are roles, not brightness steps. In the dark theme a raised surface is lighter than the page; in the light theme it is the same white and the separation comes from `border` and `shadow`. Choosing by role is what keeps that working in both directions.',
        ],
      },
    },
  },

  tones: {
    title: 'Tones',
    sections: {
      pickTheMeaning: {
        title: 'Pick the meaning, then the step',
        lead: [
          'A tone is one meaning in all the forms a component needs it. Choosing is two decisions: which tone says what you mean, then which step matches the role the colour plays — background, text on that background, or outline.',
          'Because every tone has the same nine steps, anything that varies across tones can be written once and indexed: `vars.tone[tone].subtle`.',
        ],
        rows: [
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
        ],
      },
      theNineSteps: {
        title: 'The nine steps',
        lead: [
          'The steps are pairs. Foreground steps belong to a specific background step, and only those combinations are contrast-tested — `onSubtle` on a solid fill, or `text` on `solid`, are outside the guarantee.',
        ],
        rows: [
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
            when: 'The tone as text directly on `background`, `surface` or `muted`: inline validation messages, tinted links, status labels with no fill behind them.',
          },
          {
            token: 'border',
            when: 'The outline of a subtle fill, or a divider that should carry the tone.',
          },
        ],
        notes: [
          '`text` exists separately from `solid` because they cannot be the same value. `tone.warning.solid` is an amber at roughly 2:1 on white — fine as a fill, unreadable as a sentence. Reaching for `solid` as a text colour is the single most common way to fail contrast with this set.',
        ],
      },
      inUse: {
        title: 'In use',
        lead: ['Each tone in the three shapes it is actually used in, and its full ramp.'],
      },
    },
  },

  spacing: {
    title: 'Spacing',
    sections: {
      oneScale: {
        title: 'One scale for gaps and padding',
        lead: [
          'The key is the multiplier: `space[4]` is 4 × 4px = `1rem`. In `rem`, so spacing grows with the reader’s browser font size and stays in proportion with the text it surrounds.',
          'Pick a step by how closely two things belong together. Distance is the main signal a layout has for grouping — inconsistent gaps read as accidental relationships.',
        ],
        rows: [
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
        ],
        notes: [
          'The scale is insertable — a step between `6` and `8` would be `7`. That is a reason to add a token rather than to write `1.75rem` inline.',
        ],
      },
    },
  },

  radius: {
    title: 'Radius',
    sections: {
      corners: {
        title: 'Corners',
        lead: [
          'Radii stay in `px` while spacing is in `rem`, deliberately: a corner is a fixed optical detail. Scaling it with the reader’s font size makes large containers look inflated rather than more readable.',
        ],
        rows: [
          {
            token: 'radius.xs',
            when: 'Small square-ish things: checkboxes, tags, inline code, a progress bar.',
          },
          { token: 'radius.sm', when: 'Buttons, inputs, selects — the everyday control radius.' },
          { token: 'radius.md', when: 'Cards, dropdown menus, popovers, toasts.' },
          { token: 'radius.lg', when: 'Large containers: dialogs, drawers, page panels.' },
          {
            token: 'radius.xl',
            when: 'Deliberately soft, oversized surfaces. Marketing and empty states more than application UI.',
          },
          { token: 'radius.full', when: 'Pills, avatars, circular icon buttons, status dots.' },
        ],
        notes: [
          'When one rounded box sits inside another, drop the inner one a step. Matching radii on nested corners leaves a visibly uneven margin at the curve.',
        ],
      },
    },
  },

  typography: {
    title: 'Typography',
    sections: {
      family: {
        title: 'Family',
        lead: [
          'A self-contained stack, so the package renders correctly with nothing installed. Naming a webfont here would tie the tokens to one app’s font loading and silently fall back everywhere else.',
        ],
        rows: [
          { token: 'font.family.sans', when: 'Everything.' },
          {
            token: 'font.family.mono',
            when: 'Content where character alignment carries meaning: code, IDs, hashes, numeric columns in a table.',
          },
        ],
      },
      size: {
        title: 'Size',
        lead: [
          'Seven steps. Two adjacent steps should not appear in the same block of UI — if the difference is not obvious, it reads as a mistake rather than a hierarchy.',
        ],
        rows: [
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
        ],
      },
      weight: {
        title: 'Weight',
        lead: [
          'Weight carries hierarchy at the same size. In UI, prefer `medium` where print would use bold — at small sizes on a screen, `bold` reads as shouting.',
        ],
        rows: [
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
        ],
      },
      rhythm: {
        title: 'Line height and letter spacing',
        lead: [
          'These two move together with size: the larger the text, the tighter both should be. Body copy needs air between lines to be readable; a 2.5rem headline with the same settings falls apart into separate lines.',
        ],
        rows: [
          {
            token: 'font.lineHeight.none',
            when: 'A box that must match the glyph exactly: an icon button, a numeric badge.',
          },
          {
            token: 'font.lineHeight.tight',
            when: 'Display and heading sizes — xl and above.',
          },
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
        ],
      },
    },
  },

  elevation: {
    title: 'Elevation',
    sections: {
      shadows: {
        title: 'Shadows',
        lead: [
          'A shadow is a claim that something floats above the page — not decoration. The step should match how far above: a card is barely lifted, a dialog sits well clear of everything. Use the same step for everything at the same layer.',
        ],
        rows: [
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
        ],
        notes: [
          'This is the one geometric scale that is themed. In the dark theme a black shadow on a near-black page does almost nothing, so elevation is carried by `color.surface` being lighter than `color.background` — the shadows are deepened but play a supporting role. Always pair a shadow with a surface token; a shadow alone will not read in dark mode.',
        ],
      },
      layering: {
        title: 'Layering',
        lead: [
          '`zIndex` is the same idea in stacking order. Never write a raw z-index: the value only means something relative to the others, so a literal is a guess about code you cannot see. The steps are 100 apart to leave room for local stacking inside a layer.',
        ],
        rows: [
          { token: 'zIndex.base', when: 'In-flow content. The default; rarely written out.' },
          { token: 'zIndex.dropdown', when: 'Menus and selects anchored to a trigger.' },
          { token: 'zIndex.sticky', when: 'Sticky headers, toolbars, table header rows.' },
          {
            token: 'zIndex.overlay',
            when: 'The scrim behind a modal — pairs with `color.overlay`.',
          },
          { token: 'zIndex.modal', when: 'Dialogs and drawers, above their own scrim.' },
          {
            token: 'zIndex.popover',
            when: 'Popovers and tooltips that have to work while a modal is open.',
          },
          { token: 'zIndex.toast', when: 'Notifications. Above everything, by definition.' },
        ],
      },
    },
  },

  iconsAndFocus: {
    title: 'Icons and focus',
    sections: {
      iconSize: {
        title: 'Icon size',
        lead: [
          'Discrete steps rather than a size derived from `font-size`: stroke-based icons keep a constant stroke width, so they do not scale linearly with text — an icon set to `2em` looks heavier, not just bigger.',
        ],
        rows: [
          {
            token: 'iconSize.sm',
            when: 'Inline with `font.size.sm` text: table cells, dense lists, input affordances.',
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
        ],
        notes: [
          '`md` is 1.25rem while body text is 1rem. That is intentional: an icon at exactly the text size looks small next to it.',
        ],
      },
      focusRing: {
        title: 'Focus ring',
        lead: [
          'The geometry of the ring; its colour is `color.ring`. Separate tokens because every focusable component needs them, and they are only noticed once they are inconsistent.',
        ],
        rows: [
          {
            token: 'focusRing.width',
            when: 'The `outline-width` of the ring, on every focusable element.',
          },
          {
            token: 'focusRing.offset',
            when: 'The `outline-offset`, so the ring clears the element’s own border instead of sitting on it.',
          },
          {
            token: 'color.ring',
            when: 'The ring colour — one value for the whole UI, including on tone-coloured controls.',
          },
        ],
        notes: [
          'Use `outline` rather than a `box-shadow` ring: an outline follows `border-radius`, survives `overflow: hidden`, and stays visible in forced-colours mode. And never remove the ring without putting an equivalent in its place — it is the only affordance a keyboard user has.',
        ],
      },
    },
  },
} satisfies Record<string, GuidanceChapter>;
