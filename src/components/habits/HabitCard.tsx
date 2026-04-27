'use client';

import React, { useState } from 'react';
import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';
import { toggleHabitCompletion } from '@/lib/habits';

interface Props {
  habit: Habit;
  today: string;
  onUpdate: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export default function HabitCard({ habit, today, onUpdate, onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const isCompleted = habit.completions.includes(today);

  function handleToggle() {
    const updated = toggleHabitCompletion(habit, today);
    onUpdate(updated);
  }

  function handleDelete() {
    onDelete(habit.id);
  }

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className={`rounded-2xl border p-5 transition-colors ${
        isCompleted
          ? 'bg-violet-50 border-violet-200'
          : 'bg-white border-gray-100 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-base truncate ${isCompleted ? 'text-violet-700' : 'text-gray-900'}`}>
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-sm text-gray-500 mt-0.5 truncate">{habit.description}</p>
          )}
          <div className="flex items-center gap-3 mt-3">
            <span
              data-testid={`habit-streak-${slug}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-amber-600"
              aria-label={`Current streak: ${streak} day${streak !== 1 ? 's' : ''}`}
            >
              🔥 {streak} day{streak !== 1 ? 's' : ''}
            </span>
            <span className="text-xs text-gray-400 capitalize">{habit.frequency}</span>
          </div>
        </div>

        <button
          data-testid={`habit-complete-${slug}`}
          type="button"
          onClick={handleToggle}
          aria-label={isCompleted ? `Unmark ${habit.name} as complete` : `Mark ${habit.name} as complete`}
          aria-pressed={isCompleted}
          className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center
            transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
            ${isCompleted
              ? 'bg-violet-600 border-violet-600 text-white'
              : 'bg-white border-gray-300 text-transparent hover:border-violet-400'
            }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          data-testid={`habit-edit-${slug}`}
          type="button"
          onClick={() => onEdit(habit)}
          className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100
            rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
        >
          Edit
        </button>

        {!confirmDelete ? (
          <button
            data-testid={`habit-delete-${slug}`}
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="flex-1 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100
              rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
          >
            Delete
          </button>
        ) : (
          <div className="flex-1 flex gap-1">
            <button
              data-testid="confirm-delete-button"
              type="button"
              onClick={handleDelete}
              className="flex-1 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700
                rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200
                rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </article>
  );
}