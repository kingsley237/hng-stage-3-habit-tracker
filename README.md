# HNG Stage 3 : Habit Tracker PWA

A Progressive Web App for tracking daily habits with streaks, built with Next.js App Router, TypeScript, and Tailwind CSS. Implements the full Technical Requirements Document specification.

## Live Demo

https://hng-stage-3-habit-tracker.vercel.app

## GitHub Repository

https://github.com/kingsley237/hng-stage-3-habit-tracker

---

## How to Run the App

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Build for production

```bash
npm run build
npm run start
```

---

## How to Run the Tests

### Unit and Integration Tests (Vitest)

```bash
npm run test
```

### Unit and Integration Tests with Coverage Report

```bash
npm run test:coverage
```

Coverage report is generated in `/coverage`. Line coverage is 93.18%, above the required 80% threshold.

### End-to-End Tests (Playwright)

Make sure the dev server is running first, or Playwright will start it automatically:

```bash
npm run test:e2e
```

To run with the Playwright UI:

```bash
npm run test:e2e:ui
```

### Run All Tests

```bash
npm run test && npm run test:e2e
```

---

## Test File Locations and What Each Verifies

### Unit Tests : `tests/unit/`

| File | Describe block | What it verifies |
|---|---|---|
| `slug.test.ts` | `getHabitSlug` | Converts habit names to URL-safe slugs: lowercasing, space-to-hyphen, special character removal, trimming, empty string handling |
| `validators.test.ts` | `validateHabitName` | Name validation: empty string rejection, whitespace-only rejection, 60-character maximum, trimming, returns correct `valid`, `value`, and `error` shape |
| `streaks.test.ts` | `calculateCurrentStreak` | Streak calculation: empty completions, today not completed, single day, consecutive days, gap resets streak, deduplication, future dates |
| `habits.test.ts` | `toggleHabitCompletion` | Toggle logic: adds date when not present, removes date when present, no mutation of original, preserves other dates, deduplication |
| `storage.test.ts` | `storage` | localStorage read/write for all three keys: users, session, habits : get returns empty defaults, save writes correct key, clear sets null |

### Integration Tests : `tests/integration/`

| File | Describe block | What it verifies |
|---|---|---|
| `auth-flow.test.tsx` | `auth-flow` | Login and signup form rendering, invalid credential error display, duplicate email error, `saveUsers` and `saveSession` called on success, `saveSession` called with correct email on login |
| `habit-form.test.tsx` | `habit-form` | Form renders all inputs and save button, cancel calls `onCancel`, empty name shows validation error, valid submission calls `onSave` with correct data, pre-fills fields when editing existing habit, 60-character name limit enforced |

### End-to-End Tests : `tests/e2e/`

| File | Describe block | What it verifies |
|---|---|---|
| `app.spec.ts` | `Habit Tracker App` | Full user flows in a real browser: splash redirect, signup form input, signup to dashboard redirect, login after signup, wrong credential error, empty state display, habit creation, empty name validation, completion toggle, habit deletion, logout redirect |

---

## How the Implementation Maps to the Technical Requirements Document

### Required Routes

| TRD Requirement | Implementation |
|---|---|
| `/` : splash screen | `src/app/page.tsx` : shows `SplashScreen`, redirects to `/dashboard` if session exists, otherwise to `/login` after 1 second |
| `/login` : login page | `src/app/login/page.tsx` + `src/components/auth/LoginForm.tsx` |
| `/signup` : signup page | `src/app/signup/page.tsx` + `src/components/auth/SignupForm.tsx` |
| `/dashboard` : main app | `src/app/dashboard/page.tsx` : protected, redirects to `/login` if no session |

### Required Folder and File Structure

| TRD Requirement | Implementation |
|---|---|
| `src/app/` : routes | `src/app/page.tsx`, `login/page.tsx`, `signup/page.tsx`, `dashboard/page.tsx` |
| `src/components/shared/` | `SplashScreen.tsx` |
| `src/components/auth/` | `LoginForm.tsx`, `SignupForm.tsx` |
| `src/lib/` : utilities | `slug.ts`, `validators.ts`, `streaks.ts`, `habits.ts`, `storage.ts` |
| `src/types/` | `auth.ts`, `habit.ts` |
| `tests/unit/` | `slug.test.ts`, `validators.test.ts`, `streaks.test.ts`, `habits.test.ts`, `storage.test.ts` |
| `tests/integration/` | `auth-flow.test.tsx`, `habit-form.test.tsx` |
| `tests/e2e/` | `app.spec.ts` |

### Required Exported Utilities

| TRD Requirement | File | Export |
|---|---|---|
| Habit slug generator | `src/lib/slug.ts` | `getHabitSlug(name: string): string` |
| Habit name validator | `src/lib/validators.ts` | `validateHabitName(name: string): { valid, value, error }` |
| Streak calculator | `src/lib/streaks.ts` | `calculateCurrentStreak(completions, today?): number` |
| Habit toggle | `src/lib/habits.ts` | `toggleHabitCompletion(habit, date): Habit` |
| localStorage helpers | `src/lib/storage.ts` | `getUsers`, `saveUsers`, `getSession`, `saveSession`, `clearSession`, `getHabits`, `saveHabits` |

### Required Local Persistence

| TRD Requirement | Implementation |
|---|---|
| Users stored in localStorage | Key: `habit-tracker-users` : array of User objects |
| Session stored in localStorage | Key: `habit-tracker-session` : Session object or null |
| Habits stored in localStorage | Key: `habit-tracker-habits` : array of Habit objects |

### Required UI Selectors and Test IDs

| data-testid | Component | Purpose |
|---|---|---|
| `splash-screen` | SplashScreen | Splash page root |
| `auth-login-email` | LoginForm | Email input |
| `auth-login-password` | LoginForm | Password input |
| `auth-login-submit` | LoginForm | Submit button |
| `auth-signup-email` | SignupForm | Email input |
| `auth-signup-password` | SignupForm | Password input |
| `auth-signup-submit` | SignupForm | Submit button |
| `auth-logout-button` | Dashboard | Logout button |
| `dashboard-page` | Dashboard | Page root |
| `create-habit-button` | Dashboard | Open habit form |
| `habit-form` | HabitForm | Form root |
| `habit-name-input` | HabitForm | Name input |
| `habit-description-input` | HabitForm | Description input |
| `habit-frequency-select` | HabitForm | Frequency dropdown |
| `habit-save-button` | HabitForm | Save button |
| `habit-card-{slug}` | HabitCard | Card root, slug from habit name |
| `habit-complete-{slug}` | HabitCard | Completion toggle button |
| `habit-edit-{slug}` | HabitCard | Edit button |
| `habit-delete-{slug}` | HabitCard | Delete button |
| `habit-streak-{slug}` | HabitCard | Streak display |
| `confirm-delete-button` | HabitCard | Confirm deletion |
| `empty-state` | HabitList | Empty state message |

### Required PWA Files

| TRD Requirement | Implementation |
|---|---|
| `public/manifest.json` | Name, short name, start URL, display standalone, theme color `#7c3aed`, icons 192 and 512 |
| `public/sw.js` | Cache-first service worker, installs static assets, activates with old cache cleanup, fetch intercept |
| `public/icons/icon-192.png` | 192×192 PNG icon |
| `public/icons/icon-512.png` | 512×512 PNG icon |
| SW registration | Registered in `src/app/layout.tsx` via inline script on `load` event |

### Required Test Tools

| TRD Requirement | Implementation |
|---|---|
| Vitest | Unit and integration tests |
| @testing-library/react | Component rendering and interaction |
| @playwright/test | End-to-end browser tests |
| @vitest/coverage-v8 | Coverage reporting |

---

## Assumptions and Trade-offs

**Authentication** : No external auth service is used. Passwords are stored in plaintext in localStorage as the TRD specifies local-only auth with no backend. This is acceptable for a local prototype but would never be done in production.

**No backend** : All data persists in localStorage only. Data is scoped to the browser and cleared if the user clears site data. The TRD explicitly requires localStorage as the persistence mechanism.

**Frequency field** : The TRD specifies daily frequency only. The frequency select is included in the form UI for forward compatibility but only offers the `daily` option.

**Slug-based test IDs** : HabitCard test IDs use the habit name slug (e.g. `habit-card-drink-water`). This matches the TRD contract for dynamic element targeting in tests.

**Next.js route announcer** : Next.js injects a `<div role="alert">` for accessibility route announcements. E2e tests use `.first()` when querying `[role="alert"]` to avoid strict-mode violations from this element.

**Coverage scope** : Coverage is measured on `src/lib/**` only as specified in the TRD. Component files are covered by integration and e2e tests but are excluded from the coverage threshold calculation.

---

## Test Results Summary

```
Unit + Integration (Vitest)
  Tests:       51 passed
  Test files:  7 passed
  Coverage:    93.18% lines (threshold: 80%)

End-to-End (Playwright)
  Tests:       11 passed
  Browser:     Chromium
```