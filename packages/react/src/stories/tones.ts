import type { ToneName } from '../index';

/**
 * The theme exports `ToneName` as a type but no runtime list, so the stories
 * keep their own. `satisfies` is what makes a tone added later fail here
 * rather than quietly go undocumented.
 */
export const tones = [
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'danger',
] satisfies ToneName[];
