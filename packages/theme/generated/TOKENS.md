<!-- Generated from packages/theme/src/guidance.ts by `pnpm generate:tokens`. Do not edit. -->

# Token reference

Every token in `@trailpack-ui/theme`, and the rule for when to reach for it.
For installing the package, importing the stylesheet and switching themes, see
the [README](../README.md).

Three things render this guidance, and none of them owns it: this file, the
Storybook reference (`pnpm dev`, which shows every token at its real value in
both themes), and the agent skill at
[`skills/theme/`](../../../skills/README.md).

## Tokens

### What these are

Every value a component needs — a colour, a gap, a corner, a type size — comes from this set. A component that writes `#7c3aed` or `12px` directly is a component that will not follow the dark theme and will drift from the rest of the UI the first time a value is adjusted.

Reach for tokens by role, not by appearance. The question is never "which grey looks right here" but "what is this element" — a recessed fill, a secondary label, a divider. Pick the token that names that, and both themes come out correct for free.

| Token | Use it for |
| --- | --- |
| `tone.*` | The thing carries a meaning: a primary action, an error, a success state. Start here — if a tone fits, nothing else does. |
| `color.*` | Neutral chrome with no meaning attached: the page, cards, dividers, body and secondary text. |
| `space, radius, font, iconSize, shadow, zIndex` | Geometry and type. Never theme-dependent except for shadows. |

> The paths on `vars` are the public API. The CSS variable names behind them are vanilla-extract hashes and can change between releases — always go through `vars`, never type a `var(--…)` by hand.

### Light and dark

There is one contract and two sets of values. The light theme sits on `:root`, the dark theme is a class you put on any element. Nothing in a component needs to know which is active — that is the whole point of going through the tokens.

> Every colour pairing this set promises — `onSolid` on `solid`, `onSubtle` on `subtle`, `text` on the three page surfaces — is asserted against WCAG AA in `src/themes.test.ts`, in both themes. Combinations outside those pairs are not covered, which is the reason to stay inside them.

## Color

### Surfaces and text

The neutral layer: everything that is structure rather than meaning. Three surfaces, two text weights, two borders, and two single-purpose values.

| Token | Use it for |
| --- | --- |
| `color.background` | The page itself. One per view, at the root. |
| `color.surface` | Anything raised off the page: cards, panels, dropdowns, dialogs. |
| `color.muted` | Anything recessed into the page: input fills, table stripes, code blocks, disabled controls. |
| `color.foreground` | Primary text, and icons that carry the same weight as text. |
| `color.mutedForeground` | Secondary text: labels, help text, placeholders, timestamps. Not for body copy — it is quieter on purpose. |
| `color.border` | The default hairline: card outlines, dividers, input borders at rest. |
| `color.borderStrong` | A border that has to hold its own next to a filled control, or a divider that must read as a real separation. |
| `color.ring` | The focus ring colour, and nothing else. Give it no second job. |
| `color.overlay` | The scrim behind a modal or drawer. Already semi-transparent — do not add opacity on top. |

> `surface` and `muted` are roles, not brightness steps. In the dark theme a raised surface is lighter than the page; in the light theme it is the same white and the separation comes from `border` and `shadow`. Choosing by role is what keeps that working in both directions.

## Tones

### Pick the meaning, then the step

A tone is one meaning in all the forms a component needs it. Choosing is two decisions: which tone says what you mean, then which step matches the role the colour plays — background, text on that background, or outline.

Because every tone has the same nine steps, anything that varies across tones can be written once and indexed: `vars.tone[tone].subtle`.

| Token | Use it for |
| --- | --- |
| `tone.accent` | Brand and primary action. The one call to action in a view, links, selected state. Not a success colour. |
| `tone.neutral` | A tone-shaped grey. For secondary buttons and badges, and as the default when a component takes a tone but the content carries no meaning. |
| `tone.danger` | Destructive actions and errors: delete, validation failures, failed jobs. |
| `tone.success` | Something completed or is passing. Confirmations, healthy status. |
| `tone.warning` | Needs attention but nothing is broken: quota nearly reached, deprecated setting. |
| `tone.info` | Neutral information that is not a state: tips, hints, in-progress notices. |

### The nine steps

The steps are pairs. Foreground steps belong to a specific background step, and only those combinations are contrast-tested — `onSubtle` on a solid fill, or `text` on `solid`, are outside the guarantee.

| Token | Use it for |
| --- | --- |
| `solid` | The filled background: primary button, filled badge, progress bar. A background, never a text colour. |
| `solidHover / solidActive` | Pointer feedback on that fill. Hover brightens in dark, darkens in light; active is always the pressed step. |
| `onSolid` | Text and icons sitting on any of the three solid steps. |
| `subtle` | The soft fill: alert background, quiet badge, selected row. Sits on the page without shouting. |
| `subtleHover` | Pointer feedback on a subtle fill. |
| `onSubtle` | Text and icons on a subtle fill. |
| `text` | The tone as text directly on `background`, `surface` or `muted`: inline validation messages, tinted links, status labels with no fill behind them. |
| `border` | The outline of a subtle fill, or a divider that should carry the tone. |

> `text` exists separately from `solid` because they cannot be the same value. `tone.warning.solid` is an amber at roughly 2:1 on white — fine as a fill, unreadable as a sentence. Reaching for `solid` as a text colour is the single most common way to fail contrast with this set.

### In use

Each tone in the three shapes it is actually used in, and its full ramp.

## Spacing

### One scale for gaps and padding

The key is the multiplier: `space[4]` is 4 × 4px = `1rem`. In `rem`, so spacing grows with the reader’s browser font size and stays in proportion with the text it surrounds.

Pick a step by how closely two things belong together. Distance is the main signal a layout has for grouping — inconsistent gaps read as accidental relationships.

| Token | Use it for |
| --- | --- |
| `space[1] – space[2]` | Inside a single control: icon-to-label gap, badge padding, the space between a checkbox and its text. |
| `space[3] – space[4]` | Padding of buttons and inputs; the gap between two elements that form one unit, like a label and its field. |
| `space[5] – space[6]` | Card and panel padding; the gap between fields in a form. |
| `space[8] – space[12]` | Between distinct blocks inside a view: a heading and the section it introduces, one card from the next. |
| `space[16] – space[24]` | Page-level rhythm: the space around a layout, or between major sections of a long page. |

> The scale is insertable — a step between `6` and `8` would be `7`. That is a reason to add a token rather than to write `1.75rem` inline.

## Radius

### Corners

Radii stay in `px` while spacing is in `rem`, deliberately: a corner is a fixed optical detail. Scaling it with the reader’s font size makes large containers look inflated rather than more readable.

| Token | Use it for |
| --- | --- |
| `radius.xs` | Small square-ish things: checkboxes, tags, inline code, a progress bar. |
| `radius.sm` | Buttons, inputs, selects — the everyday control radius. |
| `radius.md` | Cards, dropdown menus, popovers, toasts. |
| `radius.lg` | Large containers: dialogs, drawers, page panels. |
| `radius.xl` | Deliberately soft, oversized surfaces. Marketing and empty states more than application UI. |
| `radius.full` | Pills, avatars, circular icon buttons, status dots. |

> When one rounded box sits inside another, drop the inner one a step. Matching radii on nested corners leaves a visibly uneven margin at the curve.

## Typography

### Family

A self-contained stack, so the package renders correctly with nothing installed. Naming a webfont here would tie the tokens to one app’s font loading and silently fall back everywhere else.

| Token | Use it for |
| --- | --- |
| `font.family.sans` | Everything. |
| `font.family.mono` | Content where character alignment carries meaning: code, IDs, hashes, numeric columns in a table. |

### Size

Seven steps. Two adjacent steps should not appear in the same block of UI — if the difference is not obvious, it reads as a mistake rather than a hierarchy.

| Token | Use it for |
| --- | --- |
| `font.size.xs` | Captions, badge text, table metadata, footnotes. |
| `font.size.sm` | Secondary text, form labels, help text, and dense UI such as tables and sidebars. |
| `font.size.md` | Body text. The default — most of the UI is this. |
| `font.size.lg` | Card titles and lead paragraphs. |
| `font.size.xl` | Section headings inside a page. |
| `font.size["2xl"]` | Page titles. |
| `font.size["3xl"]` | Hero and marketing headlines. Rare in application UI. |

### Weight

Weight carries hierarchy at the same size. In UI, prefer `medium` where print would use bold — at small sizes on a screen, `bold` reads as shouting.

| Token | Use it for |
| --- | --- |
| `font.weight.regular` | Body text and anything long-form. |
| `font.weight.medium` | Button labels, form labels, table headers, the emphasised half of a key/value pair. |
| `font.weight.semibold` | Headings, card titles, the active item in a nav. |
| `font.weight.bold` | Page titles and display type. Sparingly. |

### Line height and letter spacing

These two move together with size: the larger the text, the tighter both should be. Body copy needs air between lines to be readable; a 2.5rem headline with the same settings falls apart into separate lines.

| Token | Use it for |
| --- | --- |
| `font.lineHeight.none` | A box that must match the glyph exactly: an icon button, a numeric badge. |
| `font.lineHeight.tight` | Display and heading sizes — xl and above. |
| `font.lineHeight.snug` | Headings at UI sizes, and multi-line labels. |
| `font.lineHeight.normal` | Body text. The default. |
| `font.lineHeight.relaxed` | Long-form prose, documentation, help panels. |
| `font.letterSpacing.tight` | Large text (2xl and up), which looks loosely set at default tracking. |
| `font.letterSpacing.normal` | Everything else. |
| `font.letterSpacing.wide` | Uppercase micro-labels — the one case where letterforms need separating. |

## Elevation

### Shadows

A shadow is a claim that something floats above the page — not decoration. The step should match how far above: a card is barely lifted, a dialog sits well clear of everything. Use the same step for everything at the same layer.

| Token | Use it for |
| --- | --- |
| `shadow.xs` | A resting card or table row — just enough to separate it. |
| `shadow.sm` | An interactive card, or the hover state of an xs one. |
| `shadow.md` | Anchored floating layers: dropdowns, popovers, tooltips. |
| `shadow.lg` | Dialogs and drawers — things that come with a scrim. |
| `shadow.xl` | Full-screen panels and command palettes. If everything is xl, nothing reads as elevated. |

> This is the one geometric scale that is themed. In the dark theme a black shadow on a near-black page does almost nothing, so elevation is carried by `color.surface` being lighter than `color.background` — the shadows are deepened but play a supporting role. Always pair a shadow with a surface token; a shadow alone will not read in dark mode.

### Layering

`zIndex` is the same idea in stacking order. Never write a raw z-index: the value only means something relative to the others, so a literal is a guess about code you cannot see. The steps are 100 apart to leave room for local stacking inside a layer.

| Token | Use it for |
| --- | --- |
| `zIndex.base` | In-flow content. The default; rarely written out. |
| `zIndex.dropdown` | Menus and selects anchored to a trigger. |
| `zIndex.sticky` | Sticky headers, toolbars, table header rows. |
| `zIndex.overlay` | The scrim behind a modal — pairs with `color.overlay`. |
| `zIndex.modal` | Dialogs and drawers, above their own scrim. |
| `zIndex.popover` | Popovers and tooltips that have to work while a modal is open. |
| `zIndex.toast` | Notifications. Above everything, by definition. |

## Icons and focus

### Icon size

Discrete steps rather than a size derived from `font-size`: stroke-based icons keep a constant stroke width, so they do not scale linearly with text — an icon set to `2em` looks heavier, not just bigger.

| Token | Use it for |
| --- | --- |
| `iconSize.sm` | Inline with `font.size.sm` text: table cells, dense lists, input affordances. |
| `iconSize.md` | The default. Buttons, nav items, anything beside body text. |
| `iconSize.lg` | Section headers and standalone icon buttons. |
| `iconSize.xl` | Empty states and feature callouts, where the icon is the subject. |

> `md` is 1.25rem while body text is 1rem. That is intentional: an icon at exactly the text size looks small next to it.

### Focus ring

The geometry of the ring; its colour is `color.ring`. Separate tokens because every focusable component needs them, and they are only noticed once they are inconsistent.

| Token | Use it for |
| --- | --- |
| `focusRing.width` | The `outline-width` of the ring, on every focusable element. |
| `focusRing.offset` | The `outline-offset`, so the ring clears the element’s own border instead of sitting on it. |
| `color.ring` | The ring colour — one value for the whole UI, including on tone-coloured controls. |

> Use `outline` rather than a `box-shadow` ring: an outline follows `border-radius`, survives `overflow: hidden`, and stays visible in forced-colours mode. And never remove the ring without putting an equivalent in its place — it is the only affordance a keyboard user has.
