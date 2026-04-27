import { describe, it, expect } from 'vitest';
import { getHabitSlug } from '../../src/lib/slug';

describe('getHabitSlug', () => {
  it('converts habit name to lowercase slug', () => {
    expect(getHabitSlug('Drink Water')).toBe('drink-water');
  });

  it('replaces spaces with hyphens', () => {
    expect(getHabitSlug('morning run')).toBe('morning-run');
  });

  it('removes special characters', () => {
    expect(getHabitSlug('Read 30 mins!')).toBe('read-30-mins');
  });

  it('trims leading and trailing whitespace', () => {
    expect(getHabitSlug('  exercise  ')).toBe('exercise');
  });

  it('handles multiple spaces between words', () => {
  expect(getHabitSlug('drink  more   water')).toBe('drink-more-water');
});

  it('returns empty string for empty input', () => {
    expect(getHabitSlug('')).toBe('');
  });
});