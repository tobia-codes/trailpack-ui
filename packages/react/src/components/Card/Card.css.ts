import { vars } from '@trailpack-ui/theme';
import { style, styleVariants } from '@vanilla-extract/css';

export const base = style({
  background: vars.color.surface,
  color: vars.color.foreground,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.normal,
});

export const padding = styleVariants(vars.space, (value) => ({ padding: value }));

export const elevation = styleVariants({
  none: { boxShadow: 'none' },
  sm: { boxShadow: vars.shadow.sm },
  md: { boxShadow: vars.shadow.md },
  lg: { boxShadow: vars.shadow.lg },
});
