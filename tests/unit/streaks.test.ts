import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '../../src/lib/streaks';

describe('calculateCurrentStreak', () => {
  it('returns 0 for empty completions', () => {
    expect(calculateCurrentStreak([], '2024-01-10')).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    expect(calculateCurrentStreak(['2024-01-09'], '2024-01-10')).toBe(0);
  });

  it('returns 1 when only today is completed', () => {
    expect(calculateCurrentStreak(['2024-01-10'], '2024-01-10')).toBe(1);
  });

  it('returns 2 for two consecutive days including today', () => {
    expect(calculateCurrentStreak(['2024-01-09', '2024-01-10'], '2024-01-10')).toBe(2);
  });

  it('returns correct streak for multiple consecutive days', () => {
    const completions = ['2024-01-08', '2024-01-09', '2024-01-10'];
    expect(calculateCurrentStreak(completions, '2024-01-10')).toBe(3);
  });

  it('resets streak when a day is missed', () => {
    const completions = ['2024-01-07', '2024-01-09', '2024-01-10'];
    expect(calculateCurrentStreak(completions, '2024-01-10')).toBe(2);
  });

  it('ignores duplicate completion entries', () => {
    const completions = ['2024-01-10', '2024-01-10', '2024-01-09'];
    expect(calculateCurrentStreak(completions, '2024-01-10')).toBe(2);
  });

  it('returns 0 for future completions when today is not completed', () => {
    expect(calculateCurrentStreak(['2024-01-11'], '2024-01-10')).toBe(0);
  });
});
