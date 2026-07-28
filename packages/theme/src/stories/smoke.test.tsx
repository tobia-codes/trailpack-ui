/**
 * The stories are documentation, but a story that throws is documentation
 * nobody can read — and `storybook build` succeeds anyway, because it only
 * bundles them. Rendering each one to a string catches that in CI without
 * needing a browser.
 */
import type { ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';
import { ThemeProvider } from './parts';
import * as storyModule from './tokens.stories';

/**
 * The stories take no args, so their `render` is a plain component — which is
 * how it has to be invoked here, since calling it directly would run the hooks
 * outside a render pass. The default export is the meta and has no `render`,
 * so this filter also drops it.
 */
type StoryBody = { render: () => ReactNode };

const isStory = (value: unknown): value is StoryBody => {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Partial<StoryBody>).render === 'function'
  );
};

const stories = Object.entries(storyModule as Record<string, unknown>).filter(
  (entry): entry is [string, StoryBody] => isStory(entry[1]),
);

test('every story is picked up', () => {
  expect(stories.length).toBeGreaterThan(0);
});

test.each(stories)('%s renders in both themes', (_name, story) => {
  const Body = story.render;

  for (const theme of ['light', 'dark'] as const) {
    const html = renderToString(
      <ThemeProvider theme={theme}>
        <Body />
      </ThemeProvider>,
    );
    expect(html.length).toBeGreaterThan(100);
  }
});
