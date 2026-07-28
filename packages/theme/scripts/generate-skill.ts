/**
 * Renders `src/guidance.ts` into the agent skill at
 * `.claude/skills/tokens/SKILL.md`.
 *
 * Run with `pnpm generate:skill`. `generate-skill.test.ts` fails if the
 * committed file no longer matches, so the guidance and the skill cannot drift.
 */
import { writeFileSync } from 'node:fs';
import type { GuidanceChapter, GuidanceSection } from '../src/guidance.ts';
import { guidance } from '../src/guidance.ts';

export const skillPath = new URL('../.claude/skills/tokens/SKILL.md', import.meta.url);

const frontmatter = `---
name: tokens
description: >-
  Use when writing or reviewing UI code in a project that depends on
  @trailpack-ui/theme — picking colours, spacing, radii, type, shadows, icon
  sizes, focus rings or stacking order. Says which token to reach for and why,
  so components stay correct in both the light and the dark theme.
---`;

const preamble = `# Trailpack design tokens

Every value a component needs comes from \`@trailpack-ui/theme\`. Import the
stylesheet once at the app root, then read values through \`vars\`:

\`\`\`ts
import '@trailpack-ui/theme/theme.css';
import { vars } from '@trailpack-ui/theme';
\`\`\`

\`vars\` holds plain \`var(--…)\` strings, so it works in inline styles, in
\`.css.ts\` files, and anywhere a CSS value is read from JavaScript —
vanilla-extract is only needed if the app writes its own \`.css.ts\`.

It does **not** work in a hand-written \`.css\` or \`.scss\` file: those cannot
import \`vars\`, and the variable names are build-time hashes with nothing stable
to type. Reach the tokens from JavaScript, or alias them once into names the app
owns.

Dark mode is a class: put \`darkTheme\` (exported from the same package) on
\`<html>\` for the whole app, or on any subtree to invert just that part.

## The rules that decide most questions

1. **Never write a raw hex, \`px\`, or \`z-index\` in a component.** If no token
   fits, that is a gap in the token set — raise it, do not work around it.
2. **Pick by role, not by appearance.** Ask what the element *is* — a recessed
   fill, a secondary label, a divider — not which colour looks right.
3. **Stay inside the tested pairs.** \`onSolid\` goes on \`solid\`, \`onSubtle\` on
   \`subtle\`, \`text\` on a page surface. Other combinations are not
   contrast-checked and are how AA failures get in.
4. **\`tone.*.solid\` is a background, never a text colour.** Use \`tone.*.text\`
   for tinted text.
5. **Never type a \`var(--…)\` by hand.** The variable names are build-time
   hashes; only the paths on \`vars\` are stable. If a file cannot import
   \`vars\`, it cannot use these tokens — that is a signal to move the styling,
   not to copy a hash.`;

/** Cell text is untrusted for table syntax; a bare pipe would split the row. */
function cell(text: string) {
  return text.replaceAll('|', '\\|');
}

function renderSection(section: GuidanceSection) {
  const parts = [`### ${section.title}`, ...section.lead];

  if (section.rows) {
    parts.push(
      [
        '| Token | Use it for |',
        '| --- | --- |',
        ...section.rows.map((row) => `| \`${cell(row.token)}\` | ${cell(row.when)} |`),
      ].join('\n'),
    );
  }

  for (const note of section.notes ?? []) {
    parts.push(`> ${note}`);
  }

  return parts.join('\n\n');
}

function renderChapter(chapter: GuidanceChapter) {
  return [
    `## ${chapter.title}`,
    ...Object.values(chapter.sections).map((section) => renderSection(section)),
  ].join('\n\n');
}

export function renderSkill() {
  // `overview` is the Storybook landing page. Here the preamble above already
  // covers it, and an agent that re-reads the same rules twice has just spent
  // context to learn nothing.
  const { overview: _landingPage, ...chapters } = guidance;

  const body = Object.values(chapters as Record<string, GuidanceChapter>)
    .map((chapter) => renderChapter(chapter))
    .join('\n\n');

  const generated =
    '<!-- Generated from packages/theme/src/guidance.ts by `pnpm generate:skill`. Do not edit. -->';

  return `${[frontmatter, generated, preamble, body].join('\n\n')}\n`;
}

if (import.meta.filename === process.argv[1]) {
  writeFileSync(skillPath, renderSkill());
  console.log(`Wrote ${skillPath.pathname}`);
}
