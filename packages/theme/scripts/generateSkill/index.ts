/**
 * Entry point for `pnpm generate:skill`. The rendering lives next door and
 * returns strings; writing them is the only thing that happens here, which is
 * what lets the test render every output without touching the file system.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import {
  catalogMetadataPath,
  catalogSkillPath,
  renderMetadata,
  renderSkill,
  skillPath,
} from './generateSkill.ts';

const outputs = [
  [skillPath, renderSkill()],
  [catalogSkillPath, renderSkill()],
  [catalogMetadataPath, renderMetadata()],
] as const;

for (const [path, contents] of outputs) {
  mkdirSync(new URL('.', path), { recursive: true });
  writeFileSync(path, contents);
  console.log(`Wrote ${path.pathname}`);
}
