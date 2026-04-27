import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '../../src/lib/habits';
import { Habit } from '../../src/types/habit';

const baseHabit: Habit = {
  id: 'habit-1',
  userId: 'user-1',
  name: 'Drink Water',
  description: '8 glasses',
  frequency: 'daily',
  createdAt: '2024-01-01T00:00:00.000Z',
  completions: [],
};

describe('toggleHabitCompletion', () => {
  it('adds a date when habit is not completed on that date', () => {
    const result = toggleHabitCompletion(baseHabit, '2024-01-10');
    expect(result.completions).toContain('2024-01-10');
  });

  it('removes a date when habit is already completed on that date', () => {
    const habit = { ...baseHabit, completions: ['2024-01-10'] };
    const result = toggleHabitCompletion(habit, '2024-01-10');
    expect(result.completions).not.toContain('2024-01-10');
  });

  it('does not mutate the original habit', () => {
    const habit = { ...baseHabit, completions: ['2024-01-09'] };
    toggleHabitCompletion(habit, '2024-01-10');
    expect(habit.completions).toHaveLength(1);
    expect(habit.completions).not.toContain('2024-01-10');
  });

  it('preserves existing completions when adding a new date', () => {
    const habit = { ...baseHabit, completions: ['2024-01-09'] };
    const result = toggleHabitCompletion(habit, '2024-01-10');
    expect(result.completions).toContain('2024-01-09');
    expect(result.completions).toContain('2024-01-10');
  });

  it('removes only the toggled date leaving others intact', () => {
    const habit = { ...baseHabit, completions: ['2024-01-09', '2024-01-10'] };
    const result = toggleHabitCompletion(habit, '2024-01-10');
    expect(result.completions).toContain('2024-01-09');
    expect(result.completions).not.toContain('2024-01-10');
  });

  it('deduplicates completions', () => {
    const habit = { ...baseHabit, completions: ['2024-01-09', '2024-01-09'] };
    const result = toggleHabitCompletion(habit, '2024-01-10');
    const count = result.completions.filter(d => d === '2024-01-09').length;
    expect(count).toBe(1);
  });
});