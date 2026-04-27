'use client';

import React, { useState, FormEvent } from 'react';
import { Habit } from '@/types/habit';
import { validateHabitName } from '@/lib/validators';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  userId: string;
  existing?: Habit;
  onSave: (habit: Habit) => void;
  onCancel: () => void;
}

export default function HabitForm({ userId, existing, onSave, onCancel }: Props) {
  const [name, setName] = useState(existing?.name ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [nameError, setNameError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const result = validateHabitName(name);
    if (!result.valid) {
      setNameError(result.error ?? '');
      return;
    }

    setNameError('');

    const habit: Habit = existing
      ? {
          ...existing,
          name: result.value,
          description: description.trim(),
        }
      : {
          id: uuidv4(),
          userId,
          name: result.value,
          description: description.trim(),
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: [],
        };

    onSave(habit);
  }

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4"
    >
      <h2 className="text-base font-semibold text-gray-900">
        {existing ? 'Edit habit' : 'New habit'}
      </h2>

      <div>
        <label
          htmlFor="habit-name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Name <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          type="text"
          value={name}
          onChange={e => { setName(e.target.value); setNameError(''); }}
          className={`w-full px-4 py-3 rounded-lg border text-gray-900 text-sm
            focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
            transition-colors ${nameError ? 'border-red-400' : 'border-gray-200'}`}
          placeholder="e.g. Drink Water"
          aria-describedby={nameError ? 'name-error' : undefined}
          aria-invalid={!!nameError}
        />
        {nameError && (
          <p id="name-error" role="alert" className="mt-1 text-xs text-red-600">
            {nameError}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="habit-description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="habit-description"
          data-testid="habit-description-input"
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm
            focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
            transition-colors"
          placeholder="e.g. 8 glasses per day"
        />
      </div>

      <div>
        <label
          htmlFor="habit-frequency"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          defaultValue="daily"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm
            focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
            transition-colors bg-white"
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          data-testid="habit-save-button"
          type="submit"
          className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold
            rounded-lg text-sm transition-colors focus:outline-none focus:ring-2
            focus:ring-violet-500 focus:ring-offset-2"
        >
          {existing ? 'Save changes' : 'Create habit'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold
            rounded-lg text-sm transition-colors focus:outline-none focus:ring-2
            focus:ring-gray-400 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}