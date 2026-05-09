# Copilot instructions for this repository

## Start here

- Read [README.md](../README.md) for full setup and environment details.
- Repository scripts are in `src/package.json`; run root commands from `src/`.
- App folders are `src/frontend/` (React + Vite + TypeScript) and `src/backend/` (Express + TypeScript + PostgreSQL).

## Commands

Run from `src/` unless noted otherwise:

- Install all dependencies: `yarn install:all`
- Start both apps: `yarn dev`
- Run lint/typecheck/test/build: `yarn lint`, `yarn typecheck`, `yarn test`, `yarn build`
- Run backend migrations/seed: `yarn db:migrate`, `yarn db:seed`
- Run one backend test file: `yarn --cwd backend test -- tests/auth.test.ts`
- Run one frontend test file: `yarn --cwd frontend test -- src/__tests__/property-form.test.tsx`
- Run a single Jest test by name: append `-t "test name"`

## Architecture boundaries

- Frontend bootstraps config in `src/frontend/src/main.tsx`, then uses `AppProviders` and `AppRouter`.
- Keep frontend API access in service modules under `src/frontend/src/services/`; do not call `fetch` directly from components/pages.
- Keep backend/frontend shape translation in `src/frontend/src/services/apiAdapters.ts`.
- Backend flow is routes -> validators/middleware -> repositories:
	- routes: `src/backend/src/routes/`
	- validators: `src/backend/src/validators/`
	- middleware: `src/backend/src/middleware/`
	- repositories: `src/backend/src/repositories/`

## Project-specific rules

- Preserve frontend fallback behavior: `shouldUseMockFallback()` and `withFallback()` are intentional.
- Property create/update is multipart: new files under `images`; removed image ids in `deleteImageIds` JSON.
- Backend normalizes empty strings to `null` in property routes before Zod validation.
- Use `AppError` + central error handling in `src/backend/src/middleware/errorHandler.ts`; keep response shape consistent.
- Backend tests use `pg-mem` via `src/backend/tests/helpers/testApp.ts`; do not switch tests to a live database.
- Keep auth changes aligned across frontend storage (`src/frontend/src/utils/storage.ts`), `AuthContext`, and auth service.
- Frontend user-facing text should go through i18n (`src/frontend/src/context/I18nContext.tsx`, dictionaries in `src/frontend/src/i18n/dictionaries/`).
- Frontend imports should prefer the `@/` alias.

## Useful references

- Root setup: [README.md](../README.md)
- Frontend app docs: [src/frontend/README.md](../src/frontend/README.md)
