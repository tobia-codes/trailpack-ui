/**
 * The tones the contract carries, as a list — for anything that has to iterate
 * them: a `<select>` of tones, a Storybook control, a swatch table.
 *
 * This list is the source, not a copy of one: `ToneName` is derived from it and
 * `lightTokens` is checked against it, so a tone cannot arrive in one place and
 * be missing from the other. Written out rather than read off the tokens at
 * runtime, which would pull every token value into the bundle of a consumer
 * that only wanted the names.
 */
export const toneNames = ['accent', 'neutral', 'danger', 'success', 'warning', 'info'] as const;

export type ToneName = (typeof toneNames)[number];

/**
 * The steps every tone defines, so a component can index `vars.tone[x]` and a
 * tone added later cannot arrive half-defined:
 *
 * - `solid` / `onSolid` — filled button or badge, and the text on it
 * - `subtle` / `onSubtle` — soft alert or badge fill, and the text on it
 * - `text` — the tone as text on a page surface. `warning.solid` is ~2:1 on
 *   white, which is why this step exists separately.
 * - `border` — outline of a subtle fill, or a tinted divider
 *
 * The contrast pairings are asserted in `../themes.test.ts`.
 */
export type ToneScale = {
  solid: string;
  solidHover: string;
  solidActive: string;
  onSolid: string;
  subtle: string;
  subtleHover: string;
  onSubtle: string;
  text: string;
  border: string;
};
