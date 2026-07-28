import { vars } from '@trailpack-ui/theme';
import { style, styleVariants } from '@vanilla-extract/css';

export const base = style({
  display: 'flex',
  minWidth: 0,
});

export const direction = styleVariants({
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
});

export const gap = styleVariants(vars.space, (value) => ({ gap: value }));

export const align = styleVariants({
  start: { alignItems: 'flex-start' },
  center: { alignItems: 'center' },
  end: { alignItems: 'flex-end' },
  stretch: { alignItems: 'stretch' },
  baseline: { alignItems: 'baseline' },
});

export const justify = styleVariants({
  start: { justifyContent: 'flex-start' },
  center: { justifyContent: 'center' },
  end: { justifyContent: 'flex-end' },
  between: { justifyContent: 'space-between' },
});

export const wrap = style({ flexWrap: 'wrap' });
