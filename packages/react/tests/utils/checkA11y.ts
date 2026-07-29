import { expect } from 'vitest';
import { axe } from 'vitest-axe';

/**
 * Asserts that a rendered container has no axe violations.
 *
 * Takes the container a test already rendered rather than an element to render
 * itself, so the assertion runs against the same tree the other tests in the
 * file query — and so the props under test are written once.
 *
 * Under a simulated DOM this checks markup only: axe's contrast and geometry
 * rules need real layout, and come back `incomplete` (`target-size` even comes
 * back as a pass). Contrast is covered by the token tests in
 * `@trailpack-ui/theme`; anything geometric needs a browser.
 */
export const checkA11y = async (container: HTMLElement) => {
  expect(await axe(container)).toHaveNoViolations();
};
