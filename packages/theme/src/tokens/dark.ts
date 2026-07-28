import { shared } from './shared';
import type { ThemeTokens } from './light';

/** Dark theme. Typed against the light one, so neither can gain a token alone. */
export const darkTokens: ThemeTokens = {
  ...shared,

  color: {
    background: '#09090b',
    foreground: '#fafafa',
    // Raised surfaces read as raised here by being lighter, not by casting a
    // shadow — a black shadow is close to invisible on a near-black page.
    surface: '#18181b',
    muted: '#27272a',
    mutedForeground: '#a1a1aa',
    border: '#3f3f46',
    borderStrong: '#52525b',
    // A step lighter than the light theme's ring, which would nearly vanish
    // against the page.
    ring: '#8b5cf6',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },

  tone: {
    // Solids keep their light-theme value so a filled button reads the same in
    // both themes. Hover brightens (pointer feedback), active darkens (press).
    accent: {
      solid: '#7c3aed',
      solidHover: '#8b5cf6',
      solidActive: '#6d28d9',
      onSolid: '#ffffff',
      subtle: '#241a44',
      subtleHover: '#2f2259',
      onSubtle: '#c4b5fd',
      text: '#c4b5fd',
      border: '#4c1d95',
    },
    neutral: {
      solid: '#52525b',
      solidHover: '#71717a',
      solidActive: '#3f3f46',
      onSolid: '#ffffff',
      subtle: '#27272a',
      subtleHover: '#3f3f46',
      onSubtle: '#e4e4e7',
      text: '#a1a1aa',
      border: '#3f3f46',
    },
    danger: {
      solid: '#dc2626',
      solidHover: '#ef4444',
      solidActive: '#b91c1c',
      onSolid: '#ffffff',
      subtle: '#3c1618',
      subtleHover: '#4d1c1f',
      onSubtle: '#fca5a5',
      text: '#fca5a5',
      border: '#7f1d1d',
    },
    success: {
      solid: '#15803d',
      solidHover: '#16a34a',
      solidActive: '#166534',
      onSolid: '#ffffff',
      subtle: '#10301c',
      subtleHover: '#16442a',
      onSubtle: '#86efac',
      text: '#86efac',
      border: '#14532d',
    },
    warning: {
      solid: '#f59e0b',
      solidHover: '#fbbf24',
      solidActive: '#e08e08',
      onSolid: '#451a03',
      subtle: '#3a2606',
      subtleHover: '#4d3208',
      onSubtle: '#fcd34d',
      text: '#fcd34d',
      border: '#78350f',
    },
    info: {
      solid: '#2563eb',
      solidHover: '#3b82f6',
      solidActive: '#1d4ed8',
      onSolid: '#ffffff',
      subtle: '#14243f',
      subtleHover: '#1b3157',
      onSubtle: '#93c5fd',
      text: '#93c5fd',
      border: '#1e3a8a',
    },
  },

  // Deeper than the light theme's: `rgba(0, 0, 0, 0.05)` is invisible here, so
  // elevation needs a much stronger shadow to read at all.
  shadow: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.4)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.5)',
    md: '0 4px 12px rgba(0, 0, 0, 0.6)',
    lg: '0 10px 24px rgba(0, 0, 0, 0.7)',
    xl: '0 20px 40px rgba(0, 0, 0, 0.8)',
  },
};
