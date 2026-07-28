import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const DIRECTIVE = "'use client'";

// Stories and their custom docs sit beside the component but never reach
// `src/index.ts`, so they ship nothing and need no directive either way.
const sourceFiles = globSync('src/**/*.{ts,tsx}').filter(
  (file) =>
    !file.endsWith('.test.ts') &&
    !file.endsWith('.css.ts') &&
    !file.endsWith('.stories.tsx') &&
    !file.includes('/storybook/'),
);

const reactImport = /import\s*\{([^}]*)\}\s*from\s*'react'/;

/**
 * A module needs the directive when it calls into React's runtime itself —
 * state, effects, refs, context. Type-only imports do not count, which is why
 * the `type` qualifier is stripped before looking for a hook.
 */
const usesReactRuntime = (source: string) => {
  const imported = reactImport.exec(source)?.[1];
  if (imported === undefined) return false;

  return imported
    .split(',')
    .map((specifier) => specifier.trim())
    .filter((specifier) => !specifier.startsWith('type '))
    .some((specifier) => /^use[A-Z]/.test(specifier));
};

const distEquivalent = (sourceFile: string) =>
  sourceFile.replace(/^src\//, 'dist/').replace(/\.tsx?$/, '.js');

describe("'use client' boundaries", () => {
  it.each(sourceFiles)('%s declares the directive if and only if it needs one', (file) => {
    const source = readFileSync(file, 'utf8');

    expect(source.startsWith(`${DIRECTIVE};`)).toBe(usesReactRuntime(source));
  });

  it('carries every directive through to the build output', () => {
    const clientSources = sourceFiles.filter((file) =>
      readFileSync(file, 'utf8').startsWith(`${DIRECTIVE};`),
    );

    // A guard on the guard: were the filters ever to match nothing, every
    // assertion below would vacuously pass.
    expect(clientSources.length).toBeGreaterThan(0);

    for (const file of clientSources) {
      expect(readFileSync(distEquivalent(file), 'utf8').startsWith('"use client";')).toBe(true);
    }
  });

  it('leaves the entry point free of a directive, so the barrel is not a boundary', () => {
    expect(readFileSync('dist/index.js', 'utf8')).not.toContain('use client');
  });
});
