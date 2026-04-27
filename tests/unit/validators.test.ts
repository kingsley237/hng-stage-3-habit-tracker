import { describe, it, expect } from 'vitest';
import { validateHabitName } from '../../src/lib/validators';

describe('validateHabitName', () => {
  it('returns valid true for a normal habit name', () => {
    const result = validateHabitName('Drink Water');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('returns valid false for an empty string', () => {
    const result = validateHabitName('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns valid false for a whitespace-only string', () => {
    const result = validateHabitName('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns valid false for name exceeding 60 characters', () => {
    const longName = 'a'.repeat(61);
    const result = validateHabitName(longName);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns valid true for name exactly 60 characters', () => {
    const name = 'a'.repeat(60);
    const result = validateHabitName(name);
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('trims whitespace from the value', () => {
    const result = validateHabitName('  Exercise  ');
    expect(result.valid).toBe(true);
    expect(result.value).toBe('Exercise');
  });

  it('returns the trimmed value on success', () => {
    const result = validateHabitName('  Morning Run  ');
    expect(result.value).toBe('Morning Run');
  });
});