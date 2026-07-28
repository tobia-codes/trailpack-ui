import { vars } from '@trailpack-ui/theme';
import { style, styleVariants } from '@vanilla-extract/css';

export const base = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
  padding: `${vars.space[1]} ${vars.space[2]}`,
  border: '1px solid transparent',
  borderRadius: vars.radius.full,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.medium,
  lineHeight: vars.font.lineHeight.none,
  whiteSpace: 'nowrap',
});

const solid = styleVariants(vars.tone, (tone) => ({
  background: tone.solid,
  color: tone.onSolid,
}));

const subtle = styleVariants(vars.tone, (tone) => ({
  background: tone.subtle,
  color: tone.onSubtle,
  borderColor: tone.border,
}));

export const variant = { solid, subtle };
