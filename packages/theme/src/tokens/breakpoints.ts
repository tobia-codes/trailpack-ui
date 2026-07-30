/**
 * The viewport widths the layout is allowed to change at.
 *
 * Tokens, but the only ones that never enter the contract — so they belong here
 * and not in [`shared.ts`](shared.ts): a media query cannot read a CSS variable,
 * and `@media (min-width: var(--x))` never matches. A breakpoint has to be
 * inlined into the query at build time, which is why these are plain strings
 * rather than references on `vars`.
 */

// In `rem`, and in a media query `rem` resolves against the browser's default
// font size rather than the page's: a reader who has raised it keeps the
// narrower layout for longer, so the layout changes in proportion to the text
// it holds. At the default 16px these are 640, 768, 1024 and 1280px.
export const breakpoints = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
} as const;

/** The breakpoint names, in ascending order of width. */
export type BreakpointName = keyof typeof breakpoints;

/**
 * Each breakpoint as the condition to write it with. `min-width` only, which is
 * what makes the set mobile-first: the styles outside any query are the
 * small-screen ones and a breakpoint only ever adds to them. There is no `xs`
 * for the same reason — the smallest layout is the default and needs no name.
 *
 * Annotated rather than derived, so a breakpoint with no condition here fails
 * the build instead of being missing at the point of use.
 */
export const media: Record<BreakpointName, string> = {
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
};
