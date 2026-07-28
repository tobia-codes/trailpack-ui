import { shared } from './shared';

/**
 * Light theme, and the shape the contract and `darkTokens` are typed from.
 *
 * Every tone has the same nine steps, so a component can index `vars.tone[x]`
 * and a tone added later cannot arrive half-defined:
 *
 * - `solid` / `onSolid` — filled button or badge, and the text on it
 * - `subtle` / `onSubtle` — soft alert or badge fill, and the text on it
 * - `text` — the tone as text on a page surface. `warning.solid` is ~2:1 on
 *   white, which is why this step exists separately.
 * - `border` — outline of a subtle fill, or a tinted divider
 *
 * The contrast pairings are asserted in `../themes.test.ts`.
 */
export const lightTokens = {
  ...shared,

  color: {
    background: '#ffffff',
    foreground: '#18181b',
    /** Cards and panels. Separated from the page by border and shadow. */
    surface: '#ffffff',
    /** Recessed fills: table stripes, code blocks, inputs. */
    muted: '#f4f4f5',
    // Zinc-600, not zinc-500. Zinc-500 clears AA on white but only reaches
    // 4.40:1 on `muted` — and secondary text inside a muted fill is the common
    // case, not the rare one.
    mutedForeground: '#52525b',
    border: '#e4e4e7',
    borderStrong: '#d4d4d8',
    ring: '#7c3aed',
    // Scrims stay black in both themes: a light scrim over a dark page removes
    // the separation it exists to create.
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  tone: {
    accent: {
      solid: '#7c3aed',
      solidHover: '#6d28d9',
      solidActive: '#5b21b6',
      onSolid: '#ffffff',
      subtle: '#f5f3ff',
      subtleHover: '#ede9fe',
      onSubtle: '#5b21b6',
      text: '#6d28d9',
      border: '#c4b5fd',
    },
    neutral: {
      solid: '#52525b',
      solidHover: '#3f3f46',
      solidActive: '#27272a',
      onSolid: '#ffffff',
      subtle: '#f4f4f5',
      subtleHover: '#e4e4e7',
      onSubtle: '#3f3f46',
      text: '#52525b',
      border: '#d4d4d8',
    },
    danger: {
      solid: '#dc2626',
      solidHover: '#b91c1c',
      solidActive: '#991b1b',
      onSolid: '#ffffff',
      subtle: '#fef2f2',
      subtleHover: '#fee2e2',
      onSubtle: '#991b1b',
      text: '#b91c1c',
      border: '#fca5a5',
    },
    success: {
      solid: '#15803d',
      solidHover: '#166534',
      solidActive: '#14532d',
      onSolid: '#ffffff',
      subtle: '#f0fdf4',
      subtleHover: '#dcfce7',
      onSubtle: '#14532d',
      // Green-800, not the `solid` green-700: that only reaches 4.56:1 on
      // `muted`, which leaves no headroom at all.
      text: '#166534',
      border: '#86efac',
    },
    warning: {
      // The one tone that carries dark text on its fill — no white passes AA on
      // amber. The hover and active steps are pulled off the Tailwind ramp
      // (amber-600/700) because those go too dark for `onSolid` to keep up.
      solid: '#f59e0b',
      solidHover: '#e08e08',
      solidActive: '#c47c06',
      onSolid: '#451a03',
      subtle: '#fffbeb',
      subtleHover: '#fef3c7',
      onSubtle: '#78350f',
      text: '#92400e',
      border: '#fcd34d',
    },
    info: {
      solid: '#2563eb',
      solidHover: '#1d4ed8',
      solidActive: '#1e40af',
      onSolid: '#ffffff',
      subtle: '#eff6ff',
      subtleHover: '#dbeafe',
      onSubtle: '#1e40af',
      text: '#1d4ed8',
      border: '#93c5fd',
    },
  },

  shadow: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 2px rgba(0, 0, 0, 0.08)',
    md: '0 4px 12px rgba(0, 0, 0, 0.12)',
    lg: '0 10px 24px rgba(0, 0, 0, 0.15)',
    xl: '0 20px 40px rgba(0, 0, 0, 0.18)',
  },
};

export type ThemeTokens = typeof lightTokens;
export type ToneName = keyof ThemeTokens['tone'];
