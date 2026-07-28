import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import {
  metadataPath,
  pointerPath,
  renderMetadata,
  renderPointer,
  renderSkill,
  skillPath,
} from './generateSkill.ts';

test.for([
  ['the committed skill', skillPath, renderSkill],
  ['its metadata', metadataPath, renderMetadata],
  ['the pointer Claude Code loads', pointerPath, renderPointer],
] as const)('%s matches src/guidance.ts', ([, path, render]) => {
  const committed = readFileSync(path, 'utf8');

  expect(committed, 'Guidance changed without regenerating — run `pnpm generate:skill`').toBe(
    render(),
  );
});
