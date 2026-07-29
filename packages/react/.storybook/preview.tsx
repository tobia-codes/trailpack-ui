import '@trailpack-ui/theme/theme.css';
import '@fontsource-variable/nunito-sans';
import { darkTheme, vars } from '@trailpack-ui/theme';
import type { Decorator, Preview } from '@storybook/react-vite';

/**
 * The theme arrives as a built stylesheet from the package next door, exactly
 * as it does in a consuming app — so `packages/theme` has to be built before
 * this Storybook starts.
 */
const withTheme: Decorator = (Story, context) => {
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
        minHeight: '100vh',
        padding: vars.space[8],
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],

  initialGlobals: { theme: 'light' },

  globalTypes: {
    theme: {
      description: 'Light or dark theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    layout: 'fullscreen',
    options: { storySort: { order: ['Overview', 'Components'] } },
    // The theme toolbar owns the background; Storybook's own background
    // control would paint over it and desynchronise the two.
    backgrounds: { disable: true },
  },
};

export default preview;
