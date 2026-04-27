import { describe, it, expect, beforeEach, vi } from 'vitest';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

import {
  getUsers,
  saveUsers,
  getSession,
  saveSession,
  clearSession,
  getHabits,
  saveHabits,
} from '../../src/lib/storage';

describe('storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('getUsers returns empty array when nothing is stored', () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    expect(getUsers()).toEqual([]);
  });

  it('saveUsers writes users to localStorage', () => {
    const users = [{ id: '1', email: 'a@b.com', password: 'pass', createdAt: '' }];
    saveUsers(users);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'habit-tracker-users',
      JSON.stringify(users)
    );
  });

  it('getUsers returns stored users', () => {
    const users = [{ id: '1', email: 'a@b.com', password: 'pass', createdAt: '' }];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(users));
    expect(getUsers()).toEqual(users);
  });

  it('getSession returns null when nothing is stored', () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    expect(getSession()).toBeNull();
  });

  it('saveSession writes session to localStorage', () => {
    const session = { userId: '1', email: 'a@b.com' };
    saveSession(session);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'habit-tracker-session',
      JSON.stringify(session)
    );
  });

  it('getSession returns stored session', () => {
    const session = { userId: '1', email: 'a@b.com' };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(session));
    expect(getSession()).toEqual(session);
  });

  it('clearSession sets session to null in localStorage', () => {
    clearSession();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'habit-tracker-session',
      'null'
    );
  });

  it('getHabits returns empty array when nothing is stored', () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    expect(getHabits()).toEqual([]);
  });

  it('saveHabits writes habits to localStorage', () => {
    const habits = [
      {
        id: 'h1', userId: 'u1', name: 'Exercise', description: '',
        frequency: 'daily' as const, createdAt: '', completions: [],
      },
    ];
    saveHabits(habits);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'habit-tracker-habits',
      JSON.stringify(habits)
    );
  });

  it('getHabits returns stored habits', () => {
    const habits = [
      {
        id: 'h1', userId: 'u1', name: 'Exercise', description: '',
        frequency: 'daily' as const, createdAt: '', completions: [],
      },
    ];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(habits));
    expect(getHabits()).toEqual(habits);
  });
});