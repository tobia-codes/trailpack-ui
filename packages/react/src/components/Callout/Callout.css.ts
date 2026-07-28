import { vars } from '@trailpack-ui/theme';
import { style, styleVariants } from '@vanilla-extract/css';

export const base = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  padding: vars.space[4],
  border: '1px solid transparent',
  borderRadius: vars.radius.md,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.normal,
});

export const tone = styleVariants(vars.tone, (value) => ({
  background: value.subtle,
  color: value.onSubtle,
  borderColor: value.border,
}));

export const title = style({
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.snug,
});
