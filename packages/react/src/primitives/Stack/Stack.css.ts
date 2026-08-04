import { vars } from '@trailpack-ui/theme';
import { style, styleVariants } from '@vanilla-extract/css';
import type { StackAlign, StackDirection, StackJustify } from './Stack';

export const base = style({
  display: 'flex',
  // `min-width: auto` on a flex item is a refusal to shrink below the content's
  // min-content size, and it applies on the main axis only. So a Stack inside a
  // `direction="row"` Stack pushes the whole row past its container as soon as
  // it holds something unbreakable — a long URL, a table.
  minWidth: 0,
});

// Annotated against the component's own types rather than inferred: a value in
// the API with no style here fails the build, instead of rendering without a
// class. The import is type-only and the cycle it closes is erased.
export const direction: Record<StackDirection, string> = styleVariants({
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
});

// Built from the theme's scale rather than a list of its own, as tone variants
// are: a step added there arrives here as a gap, and one removed fails here
// rather than leaving a prop value with no style behind it.
export const gap: Record<keyof typeof vars.space, string> = styleVariants(vars.space, (value) => ({
  gap: value,
}));

export const align: Record<StackAlign, string> = styleVariants({
  start: { alignItems: 'flex-start' },
  center: { alignItems: 'center' },
  end: { alignItems: 'flex-end' },
  stretch: { alignItems: 'stretch' },
  baseline: { alignItems: 'baseline' },
});

export const justify: Record<StackJustify, string> = styleVariants({
  start: { justifyContent: 'flex-start' },
  center: { justifyContent: 'center' },
  end: { justifyContent: 'flex-end' },
  between: { justifyContent: 'space-between' },
});

export const wrap = style({ flexWrap: 'wrap' });
