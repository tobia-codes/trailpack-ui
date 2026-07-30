import type { ToneName } from '@trailpack-ui/theme';
import { vars } from '@trailpack-ui/theme';
import { style, styleVariants } from '@vanilla-extract/css';
import type { ButtonSize, ButtonVariant } from './Button';

export const base = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space[2],
  border: '1px solid transparent',
  borderRadius: vars.radius.md,
  fontFamily: vars.font.family.sans,
  fontWeight: vars.font.weight.medium,
  lineHeight: vars.font.lineHeight.none,
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'background-color 120ms ease, border-color 120ms ease',
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
  ':focus-visible': {
    outline: `${vars.focusRing.width} solid ${vars.color.ring}`,
    outlineOffset: vars.focusRing.offset,
  },
  ':disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
});

// Annotated against the component's own types rather than inferred: a variant
// or size in the API with no style here fails the build, instead of rendering
// without a class. The import is type-only and the cycle it closes is erased.
export const size: Record<ButtonSize, string> = styleVariants({
  sm: {
    minHeight: '2rem',
    padding: `${vars.space[1]} ${vars.space[3]}`,
    fontSize: vars.font.size.sm,
  },
  md: {
    minHeight: '2.5rem',
    padding: `${vars.space[2]} ${vars.space[4]}`,
    fontSize: vars.font.size.md,
  },
  lg: {
    minHeight: '3rem',
    padding: `${vars.space[3]} ${vars.space[6]}`,
    fontSize: vars.font.size.lg,
  },
});

// `:not(:disabled)` on every interactive state: a disabled button still
// receives hover, and without it the fill would move under the cursor while
// nothing can be clicked.
const solid = styleVariants(vars.tone, (tone) => ({
  background: tone.solid,
  color: tone.onSolid,
  selectors: {
    '&:hover:not(:disabled)': { background: tone.solidHover },
    '&:active:not(:disabled)': { background: tone.solidActive },
  },
}));

const subtle = styleVariants(vars.tone, (tone) => ({
  background: tone.subtle,
  color: tone.onSubtle,
  borderColor: tone.border,
  selectors: {
    '&:hover:not(:disabled)': { background: tone.subtleHover },
  },
}));

const ghost = styleVariants(vars.tone, (tone) => ({
  background: 'transparent',
  color: tone.text,
  selectors: {
    '&:hover:not(:disabled)': { background: tone.subtle },
    '&:active:not(:disabled)': { background: tone.subtleHover },
  },
}));

export const variant: Record<ButtonVariant, Record<ToneName, string>> = { solid, subtle, ghost };

export const fullWidth = style({ width: '100%' });
