/**
 * Renders `src/guidance.ts` into `TOKENS.md`, the reference a person reads.
 * Written by `index.ts`, run with `pnpm generate:tokens`.
 *
 * Same source and same rendering as the agent skill; only the framing differs —
 * the skill opens with rules addressed to a writer of code, this opens with
 * where the reference fits among the others.
 */
import { guidance } from '../../src/guidance.ts';
import { renderChapters } from '../lib/renderGuidance.ts';

export const tokensPath = new URL('../../generated/TOKENS.md', import.meta.url);

const preamble = `# Token reference

Every token in \`@trailpack-ui/theme\`, and the rule for when to reach for it.
For installing the package, importing the stylesheet and switching themes, see
the [README](../README.md).

Three things render this guidance, and none of them owns it: this file, the
Storybook reference (\`pnpm dev\`, which shows every token at its real value in
both themes), and the agent skill at
[\`skills/theme/\`](../../../skills/README.md).`;

export const renderTokens = () => {
  const generated =
    '<!-- Generated from packages/theme/src/guidance.ts by `pnpm generate:tokens`. Do not edit. -->';

  const body = renderChapters(guidance);

  return `${[generated, preamble, body].join('\n\n')}\n`;
};
