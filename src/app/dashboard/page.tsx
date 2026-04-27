'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from '@/types/auth';
import { Habit } from '@/types/habit';
import { getSession, clearSession, getHabits, saveHabits } from '@/lib/storage';
import HabitForm from '@/components/habits/HabitForm';
import HabitList from '@/components/habits/HabitList';

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [today] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.push('/login');
      return;
    }
    setSession(s);
    const allHabits = getHabits();
    setHabits(allHabits.filter(h => h.userId === s.userId));
  }, [router]);

  function handleSaveHabit(habit: Habit) {
    const allHabits = getHabits();
    let updated: Habit[];

    if (editingHabit) {
      updated = allHabits.map(h => (h.id === habit.id ? habit : h));
    } else {
      updated = [...allHabits, habit];
    }

    saveHabits(updated);
    setHabits(updated.filter(h => h.userId === session!.userId));
    setShowForm(false);
    setEditingHabit(null);
  }

  function handleUpdateHabit(habit: Habit) {
    const allHabits = getHabits();
    const updated = allHabits.map(h => (h.id === habit.id ? habit : h));
    saveHabits(updated);
    setHabits(updated.filter(h => h.userId === session!.userId));
  }

  function handleDeleteHabit(habitId: string) {
    const allHabits = getHabits();
    const updated = allHabits.filter(h => h.id !== habitId);
    saveHabits(updated);
    setHabits(updated.filter(h => h.userId === session!.userId));
  }

  function handleEdit(habit: Habit) {
    setEditingHabit(habit);
    setShowForm(true);
  }

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingHabit(null);
  }

  if (!session) return null;

  return (
    <div data-testid="dashboard-page" className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">✅</span>
            <span className="font-bold text-gray-900 text-lg">Habit Tracker</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">{session.email}</span>
            <button
              data-testid="auth-logout-button"
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors
                focus:outline-none focus:ring-2 focus:ring-red-400 rounded-md px-2 py-1"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Habits</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {today} &middot; {habits.length} habit{habits.length !== 1 ? 's' : ''}
            </p>
          </div>
          {!showForm && (
            <button
              data-testid="create-habit-button"
              type="button"
              onClick={() => { setEditingHabit(null); setShowForm(true); }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-violet-600 hover:bg-violet-700
                text-white font-semibold rounded-xl text-sm transition-colors
                focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              New habit
            </button>
          )}
        </div>

        {showForm && (
          <HabitForm
            userId={session.userId}
            existing={editingHabit ?? undefined}
            onSave={handleSaveHabit}
            onCancel={handleCancelForm}
          />
        )}

        <HabitList
          habits={habits}
          today={today}
          onUpdate={handleUpdateHabit}
          onEdit={handleEdit}
          onDelete={handleDeleteHabit}
        />
      </main>
    </div>
  );
}