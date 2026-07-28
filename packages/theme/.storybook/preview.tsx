import type { Decorator, Preview } from '@storybook/react-vite';
import { darkTheme, vars } from '../src/themes.css';
import { ThemeProvider } from '../src/stories/parts';

/**
 * Importing the theme module is what pulls the stylesheet in: the
 * vanilla-extract plugin turns `themes.css.ts` into real CSS, and
 * `createGlobalTheme(':root', …)` puts the light theme on the document.
 * `darkTheme` is a class name, so switching themes is a class swap.
 */
const withTheme: Decorator = (Story, context) => {
  const dark = context.globals.theme === 'dark';

  return (
    <div
      className={dark ? darkTheme : undefined}
      style={{
        background: vars.color.background,
        color: vars.color.foreground,
        fontFamily: vars.font.family.sans,
        fontSize: vars.font.size.md,
        lineHeight: vars.font.lineHeight.normal,
        // The decorator paints the page, so it has to cover it — otherwise the
        // dark theme ends where the content ends.
        minHeight: '100vh',
        padding: vars.space[8],
      }}
    >
      {/* The class swap is what themes the page; this tells the story which
          raw token values to print next to each swatch. */}
      <ThemeProvider theme={dark ? 'dark' : 'light'}>
        <Story />
      </ThemeProvider>
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
    // The theme toolbar owns the background; Storybook's own background
    // control would paint over it and desynchronise the two.
    backgrounds: { disable: true },
    controls: { disable: true },
  },
};

export default preview;
