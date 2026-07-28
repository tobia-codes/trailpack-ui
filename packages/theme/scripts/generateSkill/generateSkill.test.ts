import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import {
  catalogMetadataPath,
  catalogSkillPath,
  renderMetadata,
  renderSkill,
  skillPath,
} from './generateSkill.ts';

test.for([
  ['the committed skill', skillPath, renderSkill],
  ['the catalogue copy of the skill', catalogSkillPath, renderSkill],
  ['the catalogue metadata', catalogMetadataPath, renderMetadata],
] as const)('%s matches src/guidance.ts', ([, path, render]) => {
  const committed = readFileSync(path, 'utf8');

  expect(committed, 'Guidance changed without regenerating — run `pnpm generate:skill`').toBe(
    render(),
  );
});
