/**
 * Everything that does not change between light and dark.
 *
 * Kept separate because vanilla-extract requires every theme to fill the whole
 * contract — inlined into both themes, these would be duplicated and would
 * eventually diverge.
 */
export const shared = {
  // Value-based numeric scale: key × 4px, expressed in `rem` (÷16), so
  // `space[4]` is `1rem`. `rem` lets spacing grow with the user's browser
  // font-size setting, staying in proportion with text. The scale is
  // insertable — need a step between `6` and `8`? Add `7`.
  space: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },

  // Radii stay in `px` while spacing is in `rem`, deliberately: a corner is a
  // fixed optical detail, and scaling it with the user's font size makes large
  // containers look inflated rather than more readable.
  radius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  // Discrete steps rather than a size derived from `font-size`: stroke-based
  // icons (lucide) keep a constant `strokeWidth`, so they do not scale linearly
  // with text. `md` (1.25rem) is the default, a touch larger than body text
  // (`font.size.md`, 1rem) for optical balance.
  iconSize: {
    sm: '1rem',
    md: '1.25rem',
    lg: '1.5rem',
    xl: '2rem',
  },

  // The ring colour is themed (`color.ring`); this is its geometry. Separate
  // tokens because every focusable component needs them and they are only
  // noticed once they are inconsistent.
  focusRing: {
    width: '2px',
    offset: '2px',
  },

  font: {
    // A self-contained stack, so the package renders correctly with nothing
    // installed. Naming a webfont here would tie this to one app's font-loading
    // setup and silently fall back for every other consumer.
    family: {
      sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
    },
    size: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '2rem',
      '3xl': '2.5rem',
    },
    weight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      none: '1',
      tight: '1.2',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.02em',
    },
  },

  zIndex: {
    base: '0',
    dropdown: '1000',
    sticky: '1100',
    overlay: '1200',
    modal: '1300',
    popover: '1400',
    toast: '1500',
  },
};
