import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { renderTokens, tokensPath } from './generate-tokens.ts';

test('the committed reference matches src/guidance.ts', () => {
  const committed = readFileSync(tokensPath, 'utf8');

  expect(committed, 'Guidance changed without regenerating — run `pnpm generate:tokens`').toBe(
    renderTokens(),
  );
});
