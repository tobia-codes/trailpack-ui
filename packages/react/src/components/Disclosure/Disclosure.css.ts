import { vars } from '@trailpack-ui/theme';
import { style } from '@vanilla-extract/css';

export const root = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  background: vars.color.surface,
  color: vars.color.foreground,
  fontFamily: vars.font.family.sans,
  overflow: 'hidden',
});

export const trigger = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[3],
  width: '100%',
  padding: `${vars.space[3]} ${vars.space[4]}`,
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  fontFamily: 'inherit',
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.medium,
  textAlign: 'left',
  cursor: 'pointer',
  ':hover': { background: vars.color.muted },
  ':focus-visible': {
    outline: `${vars.focusRing.width} solid ${vars.color.ring}`,
    // The ring sits inside: an offset ring on a full-width trigger would be
    // clipped by the rounded container.
    outlineOffset: `calc(-1 * ${vars.focusRing.offset})`,
  },
});

export const marker = style({
  flexShrink: 0,
  width: vars.iconSize.sm,
  height: vars.iconSize.sm,
  color: vars.color.mutedForeground,
  transition: 'transform 120ms ease',
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});

export const markerOpen = style({ transform: 'rotate(90deg)' });

export const panel = style({
  padding: `0 ${vars.space[4]} ${vars.space[4]}`,
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.normal,
  color: vars.color.mutedForeground,
});
