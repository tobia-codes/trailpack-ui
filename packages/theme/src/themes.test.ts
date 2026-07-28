import { describe, expect, it } from 'vitest';
import { darkTokens, lightTokens, type ThemeTokens, type ToneName } from './tokens';

/**
 * WCAG 2.1 relative luminance and contrast ratio. Inlined here rather than
 * shipped in `src`: the token values are literals, so nothing in the package
 * needs to do colour maths at runtime — only this test does, to check them.
 */
function luminance(hex: string): number {
  const channel = (offset: number) => {
    const c = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

function contrast(a: string, b: string): number {
  const [la, lb] = [luminance(a), luminance(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const TONES: ToneName[] = ['accent', 'neutral', 'danger', 'success', 'warning', 'info'];

/** WCAG 2.1 AA for body text. */
const AA = 4.5;
/** WCAG 2.1 AA for large text and UI components. */
const AA_LARGE = 3;
/**
 * Not a WCAG figure. A tinted border decorates a fill that is already readable,
 * so 1.4.11 does not apply to it; this floor only catches a border that has
 * blended into its background entirely.
 */
const VISIBLE = 1.2;

type Pair = { label: string; fg: string; bg: string; min: number };

/** Every pairing the token set promises, with the ratio it has to clear. */
function pairs(tokens: ThemeTokens): Pair[] {
  const { color, tone } = tokens;

  // Tone text has to survive the surface closest to it in luminance — `muted`
  // in both themes. Checking the worst case covers the others.
  const worstSurface = [color.background, color.surface, color.muted].reduce((a, b) =>
    contrast(color.foreground, a) < contrast(color.foreground, b) ? a : b,
  );

  const list: Pair[] = [
    { label: 'foreground on background', fg: color.foreground, bg: color.background, min: AA },
    { label: 'foreground on surface', fg: color.foreground, bg: color.surface, min: AA },
    { label: 'foreground on muted', fg: color.foreground, bg: color.muted, min: AA },
    {
      label: 'mutedForeground on background',
      fg: color.mutedForeground,
      bg: color.background,
      min: AA,
    },
    { label: 'mutedForeground on surface', fg: color.mutedForeground, bg: color.surface, min: AA },
    { label: 'mutedForeground on muted', fg: color.mutedForeground, bg: color.muted, min: AA },
    { label: 'ring on background', fg: color.ring, bg: color.background, min: AA_LARGE },
    { label: 'border on background', fg: color.border, bg: color.background, min: VISIBLE },
    {
      label: 'borderStrong on background',
      fg: color.borderStrong,
      bg: color.background,
      min: VISIBLE,
    },
  ];

  for (const name of TONES) {
    const t = tone[name];
    list.push(
      { label: `${name}: onSolid on solid`, fg: t.onSolid, bg: t.solid, min: AA },
      // Hover and active are transient; the resting state carries the AA
      // requirement, these only have to stay legible while pointed at.
      { label: `${name}: onSolid on solidHover`, fg: t.onSolid, bg: t.solidHover, min: AA_LARGE },
      { label: `${name}: onSolid on solidActive`, fg: t.onSolid, bg: t.solidActive, min: AA_LARGE },
      { label: `${name}: onSubtle on subtle`, fg: t.onSubtle, bg: t.subtle, min: AA },
      { label: `${name}: onSubtle on subtleHover`, fg: t.onSubtle, bg: t.subtleHover, min: AA },
      { label: `${name}: text on worst surface`, fg: t.text, bg: worstSurface, min: AA },
      { label: `${name}: border on background`, fg: t.border, bg: color.background, min: VISIBLE },
      { label: `${name}: border on subtle`, fg: t.border, bg: t.subtle, min: VISIBLE },
    );
  }

  return list;
}

const themes = { light: lightTokens, dark: darkTokens };

describe.each(Object.entries(themes))('%s theme', (_name, tokens) => {
  it('clears every contrast pairing it promises', () => {
    const failing = pairs(tokens)
      .map((pair) => ({ ...pair, ratio: contrast(pair.fg, pair.bg) }))
      .filter((pair) => pair.ratio < pair.min)
      .map((pair) => `${pair.label}: ${pair.ratio.toFixed(2)} < ${pair.min}`);

    expect(failing).toEqual([]);
  });

  it('defines all nine steps of all six tones', () => {
    expect(Object.keys(tokens.tone).toSorted()).toEqual(TONES.toSorted());

    for (const name of TONES) {
      const invalid = Object.entries(tokens.tone[name])
        .filter(([, value]) => !/^#[0-9a-f]{6}$/i.test(value))
        .map(([step, value]) => `${name}.${step} = ${value}`);

      expect(invalid).toEqual([]);
      expect(Object.keys(tokens.tone[name])).toHaveLength(9);
    }
  });

  it('keeps solid, hover and active distinct', () => {
    for (const name of TONES) {
      const { solid, solidHover, solidActive } = tokens.tone[name];
      expect(new Set([solid, solidHover, solidActive]).size).toBe(3);
    }
  });
});

describe('regressions', () => {
  /**
   * Zinc-500 on zinc-100 is 4.40:1 — the pairing the first draft of the palette
   * had. It is the easiest one to reintroduce, because it passes on the page
   * background and fails only inside a muted fill.
   */
  it('keeps secondary text readable inside a muted fill, not just on the page', () => {
    for (const tokens of Object.values(themes)) {
      expect(contrast(tokens.color.mutedForeground, tokens.color.muted)).toBeGreaterThanOrEqual(AA);
    }
  });

  /**
   * Amber is why `tone.*.text` exists as a step of its own: the fill colour is
   * roughly 2:1 on white, so a flat `warning` / `warningForeground` pair leaves
   * nothing usable for an inline validation message.
   */
  it('gives warning a text step that works where its solid does not', () => {
    const { tone, color } = lightTokens;
    expect(contrast(tone.warning.solid, color.background)).toBeLessThan(AA);
    expect(contrast(tone.warning.text, color.background)).toBeGreaterThanOrEqual(AA);
  });
});
