'use client';

import React from 'react';
import { Habit } from '@/types/habit';
import HabitCard from './HabitCard';

interface Props {
  habits: Habit[];
  today: string;
  onUpdate: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export default function HabitList({ habits, today, onUpdate, onEdit, onDelete }: Props) {
  if (habits.length === 0) {
    return (
      <div
        data-testid="empty-state"
        className="flex flex-col items-center justify-center py-20 text-center px-4"
      >
        <div className="text-5xl mb-4" aria-hidden="true">🌱</div>
        <h2 className="text-lg font-semibold text-gray-900">No habits yet</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-xs">
          Start building better habits by clicking the button above.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3" aria-label="Your habits">
      {habits.map(habit => (
        <li key={habit.id}>
          <HabitCard
            habit={habit}
            today={today}
            onUpdate={onUpdate}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}