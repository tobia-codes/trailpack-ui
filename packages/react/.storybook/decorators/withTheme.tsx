import '@trailpack-ui/theme/theme.css';
import '@fontsource-variable/nunito-sans';
import { darkTheme, vars } from '@trailpack-ui/theme';
import type { Decorator } from '@storybook/react-vite';

/**
 * The theme arrives as a built stylesheet from the package next door, exactly
 * as it does in a consuming app — so `packages/theme` has to be built before
 * this Storybook starts.
 */
export const withTheme: Decorator = (Story, context) => {
  const dark = context.globals.theme === 'dark';

  return (
    <div
      className={dark ? darkTheme : undefined}
      style={{
        background: vars.color.background,
        color: vars.color.foreground,
        // Loading a webfont is the consuming app's job, and this Storybook is
        // the app here — `font.family.sans` stays a system stack in the theme
        // so the package renders with nothing installed. Hence prepending
        // rather than replacing: the token remains the fallback.
        fontFamily: `"Nunito Sans Variable", ${vars.font.family.sans}`,
        fontSize: vars.font.size.md,
        lineHeight: vars.font.lineHeight.normal,
        // Fills the canvas, so the theme's background is the frame rather than
        // a box sitting on Storybook's white. Not in Docs: there every story is
        // a block on one page, and a viewport height each leaves the page
        // mostly empty.
        minHeight: context.viewMode === 'docs' ? undefined : '100vh',
        padding: vars.space[8],
      }}
    >
      <Story />
    </div>
  );
};
