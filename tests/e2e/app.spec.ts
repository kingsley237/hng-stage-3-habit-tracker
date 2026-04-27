import { test, expect } from '@playwright/test';

test.describe('Habit Tracker App', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });
  });

  test('splash screen redirects to login when no session exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="splash-screen"]')).toBeVisible();
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('signup page renders and accepts input', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('[data-testid="auth-signup-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="auth-signup-password"]')).toBeVisible();
    await page.fill('[data-testid="auth-signup-email"]', 'test@example.com');
    await page.fill('[data-testid="auth-signup-password"]', 'password123');
    await expect(page.locator('[data-testid="auth-signup-email"]')).toHaveValue('test@example.com');
  });

  test('user can sign up and is redirected to dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('[data-testid="auth-signup-email"]', 'newuser@example.com');
    await page.fill('[data-testid="auth-signup-password"]', 'password123');
    await page.click('[data-testid="auth-signup-submit"]');
    await page.waitForURL('/dashboard', { timeout: 5000 });
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible();
  });

  test('user can log in after signup', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('[data-testid="auth-signup-email"]', 'logintest@example.com');
    await page.fill('[data-testid="auth-signup-password"]', 'pass123');
    await page.click('[data-testid="auth-signup-submit"]');
    await page.waitForURL('/dashboard');

    await page.click('[data-testid="auth-logout-button"]');
    await page.waitForURL('/login');

    await page.fill('[data-testid="auth-login-email"]', 'logintest@example.com');
    await page.fill('[data-testid="auth-login-password"]', 'pass123');
    await page.click('[data-testid="auth-login-submit"]');
    await page.waitForURL('/dashboard');
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible();
  });

  test('login shows error for wrong credentials', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="auth-login-email"]', 'nobody@example.com');
  await page.fill('[data-testid="auth-login-password"]', 'wrongpass');
  await page.click('[data-testid="auth-login-submit"]');
  await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 5000 });
});

  test('dashboard shows empty state when no habits exist', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('[data-testid="auth-signup-email"]', 'empty@example.com');
    await page.fill('[data-testid="auth-signup-password"]', 'pass123');
    await page.click('[data-testid="auth-signup-submit"]');
    await page.waitForURL('/dashboard');
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
  });

  test('user can create a new habit', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('[data-testid="auth-signup-email"]', 'habit@example.com');
    await page.fill('[data-testid="auth-signup-password"]', 'pass123');
    await page.click('[data-testid="auth-signup-submit"]');
    await page.waitForURL('/dashboard');

    await page.click('[data-testid="create-habit-button"]');
    await expect(page.locator('[data-testid="habit-form"]')).toBeVisible();

    await page.fill('[data-testid="habit-name-input"]', 'Drink Water');
    await page.click('[data-testid="habit-save-button"]');

    await expect(page.locator('[data-testid="habit-card-drink-water"]')).toBeVisible();
  });

  test('habit form shows error for empty name', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('[data-testid="auth-signup-email"]', 'validate@example.com');
  await page.fill('[data-testid="auth-signup-password"]', 'pass123');
  await page.click('[data-testid="auth-signup-submit"]');
  await page.waitForURL('/dashboard');

  await page.click('[data-testid="create-habit-button"]');
  await expect(page.locator('[data-testid="habit-form"]')).toBeVisible();
  await page.click('[data-testid="habit-save-button"]');
  await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 5000 });
});

  test('user can toggle habit completion', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('[data-testid="auth-signup-email"]', 'toggle@example.com');
    await page.fill('[data-testid="auth-signup-password"]', 'pass123');
    await page.click('[data-testid="auth-signup-submit"]');
    await page.waitForURL('/dashboard');

    await page.click('[data-testid="create-habit-button"]');
    await page.fill('[data-testid="habit-name-input"]', 'Exercise');
    await page.click('[data-testid="habit-save-button"]');

    await page.click('[data-testid="habit-complete-exercise"]');
    await expect(page.locator('[data-testid="habit-card-exercise"]')).toHaveClass(/violet/);
  });

  test('user can delete a habit', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('[data-testid="auth-signup-email"]', 'delete@example.com');
    await page.fill('[data-testid="auth-signup-password"]', 'pass123');
    await page.click('[data-testid="auth-signup-submit"]');
    await page.waitForURL('/dashboard');

    await page.click('[data-testid="create-habit-button"]');
    await page.fill('[data-testid="habit-name-input"]', 'Read Books');
    await page.click('[data-testid="habit-save-button"]');

    await page.click('[data-testid="habit-delete-read-books"]');
    await page.click('[data-testid="confirm-delete-button"]');
    await expect(page.locator('[data-testid="habit-card-read-books"]')).not.toBeVisible();
  });

  test('logout clears session and redirects to login', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('[data-testid="auth-signup-email"]', 'logout@example.com');
    await page.fill('[data-testid="auth-signup-password"]', 'pass123');
    await page.click('[data-testid="auth-signup-submit"]');
    await page.waitForURL('/dashboard');

    await page.click('[data-testid="auth-logout-button"]');
    await page.waitForURL('/login');
    expect(page.url()).toContain('/login');
  });
});