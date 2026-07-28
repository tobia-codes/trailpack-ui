import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { renderSkill, skillPath } from './generate-skill.ts';

test('the committed skill matches src/guidance.ts', () => {
  const committed = readFileSync(skillPath, 'utf8');

  expect(committed, 'Guidance changed without regenerating — run `pnpm generate:skill`').toBe(
    renderSkill(),
  );
});
