import { createContext, type ReactNode, use } from 'react';
import { darkTokens, lightTokens } from '../../tokens';

// Provider and hook share this file because they share the context. Split
// across two modules, each would close over its own instance and `useTokens`
// would read `light` forever, with nothing failing.
const ThemeContext = createContext<'light' | 'dark'>('light');

export const ThemeProvider = ({
  theme,
  children,
}: {
  theme: 'light' | 'dark';
  children: ReactNode;
}) => {
  return <ThemeContext value={theme}>{children}</ThemeContext>;
};

/**
 * The raw token values for whichever theme the toolbar has selected. `vars`
 * gives the `var(--…)` reference that renders the swatch; this gives the value
 * printed underneath it.
 */
export const useTokens = () => {
  return use(ThemeContext) === 'dark' ? darkTokens : lightTokens;
};
