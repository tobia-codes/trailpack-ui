import { createGlobalTheme, createGlobalThemeContract, createTheme } from '@vanilla-extract/css';
import { themeLayer } from './layers.css';
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

// Both sets go in the layer, so an app's unlayered override of a variable wins
// on the cascade rather than on which stylesheet the bundler happened to put
// last. The two stay in the same layer as each other: the dark class beating
// `:root` is source order within it, exactly as before.
createGlobalTheme(':root', vars, { '@layer': themeLayer, ...lightTokens });

/** Class name that swaps in the dark token values for its subtree. */
export const darkTheme = createTheme(vars, { '@layer': themeLayer, ...darkTokens });
