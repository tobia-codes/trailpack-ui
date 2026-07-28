import { createGlobalTheme, createTheme } from '@vanilla-extract/css';
import { darkTokens, lightTokens } from './tokens';

/**
 * Contract and light theme in one call: the variables are declared on `:root`
 * and `vars` references them, so importing the stylesheet is enough. The names
 * are vanilla-extract's hashes — tokens are read through `vars`, not by name.
 */
export const vars = createGlobalTheme(':root', lightTokens);

/** Class name that swaps in the dark token values for its subtree. */
export const darkTheme = createTheme(vars, darkTokens);
