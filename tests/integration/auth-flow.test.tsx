import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('../../src/lib/storage', () => ({
  getUsers: vi.fn(() => []),
  saveUsers: vi.fn(),
  saveSession: vi.fn(),
  getSession: vi.fn(() => null),
  clearSession: vi.fn(),
}));

import { getUsers, saveUsers, saveSession } from '../../src/lib/storage';
import LoginForm from '../../src/components/auth/LoginForm';
import SignupForm from '../../src/components/auth/SignupForm';

describe('auth-flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with email and password inputs', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('auth-login-email')).toBeInTheDocument();
    expect(screen.getByTestId('auth-login-password')).toBeInTheDocument();
    expect(screen.getByTestId('auth-login-submit')).toBeInTheDocument();
  });

  it('shows error when login credentials are invalid', async () => {
    vi.mocked(getUsers).mockReturnValue([]);
    render(<LoginForm />);
    await userEvent.type(screen.getByTestId('auth-login-email'), 'wrong@example.com');
    await userEvent.type(screen.getByTestId('auth-login-password'), 'wrongpass');
    await userEvent.click(screen.getByTestId('auth-login-submit'));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('renders signup form with email and password inputs', () => {
    render(<SignupForm />);
    expect(screen.getByTestId('auth-signup-email')).toBeInTheDocument();
    expect(screen.getByTestId('auth-signup-password')).toBeInTheDocument();
    expect(screen.getByTestId('auth-signup-submit')).toBeInTheDocument();
  });

  it('calls saveUsers and saveSession on successful signup', async () => {
    vi.mocked(getUsers).mockReturnValue([]);
    render(<SignupForm />);
    await userEvent.type(screen.getByTestId('auth-signup-email'), 'new@example.com');
    await userEvent.type(screen.getByTestId('auth-signup-password'), 'password123');
    await userEvent.click(screen.getByTestId('auth-signup-submit'));
    await waitFor(() => {
      expect(saveUsers).toHaveBeenCalled();
      expect(saveSession).toHaveBeenCalled();
    });
  });

  it('shows error when signing up with existing email', async () => {
    vi.mocked(getUsers).mockReturnValue([
      { id: '1', email: 'existing@example.com', password: 'pass', createdAt: '' },
    ]);
    render(<SignupForm />);
    await userEvent.type(screen.getByTestId('auth-signup-email'), 'existing@example.com');
    await userEvent.type(screen.getByTestId('auth-signup-password'), 'password123');
    await userEvent.click(screen.getByTestId('auth-signup-submit'));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('calls saveSession on successful login', async () => {
    vi.mocked(getUsers).mockReturnValue([
      { id: '1', email: 'user@example.com', password: 'pass123', createdAt: '' },
    ]);
    render(<LoginForm />);
    await userEvent.type(screen.getByTestId('auth-login-email'), 'user@example.com');
    await userEvent.type(screen.getByTestId('auth-login-password'), 'pass123');
    await userEvent.click(screen.getByTestId('auth-login-submit'));
    await waitFor(() => {
      expect(saveSession).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'user@example.com' })
      );
    });
  });
});