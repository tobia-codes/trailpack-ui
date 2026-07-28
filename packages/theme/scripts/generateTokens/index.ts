/**
 * Entry point for `pnpm generate:tokens`. The rendering lives next door and
 * returns a string; writing it is the only thing that happens here, which is
 * what lets the test render the reference without touching the file system.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { renderTokens, tokensPath } from './generateTokens.ts';

mkdirSync(new URL('.', tokensPath), { recursive: true });
writeFileSync(tokensPath, renderTokens());
console.log(`Wrote ${tokensPath.pathname}`);
