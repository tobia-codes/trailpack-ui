import { describe, expect, it } from 'vitest';
import { cx } from './cx';

describe('cx', () => {
  it('joins class names with a single space', () => {
    expect(cx('button', 'primary')).toBe('button primary');
  });

  it('drops falsy values', () => {
    expect(cx('button', false, null, undefined, 'primary')).toBe('button primary');
  });

  it('drops empty strings rather than leaving a double space', () => {
    expect(cx('button', '', 'primary')).toBe('button primary');
  });

  it('returns an empty string when nothing is left', () => {
    expect(cx()).toBe('');
    expect(cx(false, null, undefined)).toBe('');
  });
});
