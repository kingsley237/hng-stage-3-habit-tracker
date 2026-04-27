# HNG Stage 3; Habit Tracker PWA

A Progressive Web App for tracking daily habits with streaks, built with Next.js, TypeScript, and Tailwind CSS.

## Live Demo

https://hng-stage-3-habit-tracker.vercel.app

## Setup

npm install
npm run dev

Open http://localhost:3000

## Running Tests

npm run test                # unit + integration (Vitest)
npm run test:coverage       # with coverage report
npm run test:e2e            # end-to-end (Playwright)

## Architecture

- `src/app/` : Next.js App Router pages: `/` splash, `/login`, `/signup`, `/dashboard`
- `src/components/shared/` : SplashScreen
- `src/components/auth/` : LoginForm, SignupForm
- `src/components/habits/` : HabitForm, HabitCard, HabitList
- `src/lib/` : slug, validators, streaks, habits, storage utilities
- `src/types/` : auth and habit TypeScript types
- `tests/unit/` : Vitest unit tests for all lib functions
- `tests/integration/` : React Testing Library tests for form components
- `tests/e2e/` : Playwright end-to-end tests
- `public/manifest.json` : PWA manifest
- `public/sw.js` : Service worker with cache-first strategy

## Persistence

Three localStorage keys:
- `habit-tracker-users` : registered user accounts
- `habit-tracker-session` : current logged-in session
- `habit-tracker-habits` : all habit data

## Test Coverage

- Lines: 93.18% (threshold: 80%)
- All 62 tests pass across unit, integration, and e2e suites

## Accessibility

- Semantic HTML throughout
- All form inputs have associated labels
- Error messages use role="alert" for screen reader announcements
- Keyboard navigable, visible focus rings on all interactive elements
- PWA installable with manifest and service worker