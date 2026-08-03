import { createGlobalTheme, createGlobalThemeContract, createTheme } from '@vanilla-extract/css';
import { darkTokens, lightTokens } from './tokens';

/**
 * The token contract. The variable names are ours rather than
 * vanilla-extract's hashes — `--trailpack-color-surface` is what a consumer
 * overrides from a stylesheet they own, so the names are public API and have to
 * survive a refactor of this file. Declaring the contract emits no CSS; the
 * values arrive below.
 */
export const vars = createGlobalThemeContract(
  lightTokens,
  (_value, path) => `trailpack-${path.join('-')}`,
);

createGlobalTheme(':root', vars, lightTokens);

/** Class name that swaps in the dark token values for its subtree. */
export const darkTheme = createTheme(vars, darkTokens);
