/**
 * Entry point for `pnpm generate:skill`. The rendering lives next door and
 * returns a string; writing it is the only thing that happens here, which is
 * what lets the test render the skill without touching the file system.
 */
import { writeFileSync } from 'node:fs';
import { renderSkill, skillPath } from './generate-skill.ts';

writeFileSync(skillPath, renderSkill());
console.log(`Wrote ${skillPath.pathname}`);
