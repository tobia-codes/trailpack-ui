/**
 * Markdown rendering for `src/guidance.ts`, shared by the generators that emit
 * it: `generate-tokens.ts` for readers and `generate-skill.ts` for agents.
 *
 * The two outputs cannot drift because they render the same source; rendering
 * through the same functions is what also keeps them the same shape.
 */
import type { GuidanceChapter, GuidanceSection } from '../../src/guidance.ts';

/** Cell text is untrusted for table syntax; a bare pipe would split the row. */
const cell = (text: string) => {
  return text.replaceAll('|', '\\|');
};

const renderSection = (section: GuidanceSection) => {
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
};

const renderChapter = (chapter: GuidanceChapter) => {
  return [
    `## ${chapter.title}`,
    ...Object.values(chapter.sections).map((section) => renderSection(section)),
  ].join('\n\n');
};

export const renderChapters = (chapters: Record<string, GuidanceChapter>) => {
  return Object.values(chapters)
    .map((chapter) => renderChapter(chapter))
    .join('\n\n');
};
