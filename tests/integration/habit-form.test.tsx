import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HabitForm from '../../src/components/habits/HabitForm';
import { Habit } from '../../src/types/habit';

const mockOnSave = vi.fn();
const mockOnCancel = vi.fn();

const existingHabit: Habit = {
  id: 'habit-1',
  userId: 'user-1',
  name: 'Drink Water',
  description: '8 glasses per day',
  frequency: 'daily',
  createdAt: '2024-01-01T00:00:00.000Z',
  completions: [],
};

describe('habit-form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders habit name input', () => {
    render(<HabitForm userId="user-1" onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByTestId('habit-name-input')).toBeInTheDocument();
  });

  it('renders habit description input', () => {
    render(<HabitForm userId="user-1" onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByTestId('habit-description-input')).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<HabitForm userId="user-1" onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByTestId('habit-save-button')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    render(<HabitForm userId="user-1" onSave={mockOnSave} onCancel={mockOnCancel} />);
    await userEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalledOnce();
  });

  it('shows validation error when submitting empty name', async () => {
    render(<HabitForm userId="user-1" onSave={mockOnSave} onCancel={mockOnCancel} />);
    await userEvent.click(screen.getByTestId('habit-save-button'));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('calls onSave with habit data when form is valid', async () => {
    render(<HabitForm userId="user-1" onSave={mockOnSave} onCancel={mockOnCancel} />);
    await userEvent.type(screen.getByTestId('habit-name-input'), 'Exercise');
    await userEvent.click(screen.getByTestId('habit-save-button'));
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Exercise', userId: 'user-1' })
      );
    });
  });

  it('pre-fills form when editing an existing habit', () => {
    render(
      <HabitForm
        userId="user-1"
        existing={existingHabit}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByTestId('habit-name-input')).toHaveValue('Drink Water');
    expect(screen.getByTestId('habit-description-input')).toHaveValue('8 glasses per day');
  });

  it('shows validation error for name exceeding 60 characters', async () => {
    render(<HabitForm userId="user-1" onSave={mockOnSave} onCancel={mockOnCancel} />);
    await userEvent.type(screen.getByTestId('habit-name-input'), 'a'.repeat(61));
    await userEvent.click(screen.getByTestId('habit-save-button'));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(mockOnSave).not.toHaveBeenCalled();
  });
});