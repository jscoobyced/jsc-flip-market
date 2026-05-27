# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Real-estate property flipping marketplace connecting property owners with flippers. Full-stack application with React/Vite frontend and Express/PostgreSQL backend.

## Commands

### Root scripts (run from `src/`)

- `yarn install:all` - Install all dependencies in both frontend and backend
- `yarn dev` - Run both frontend and backend together
- `yarn dev:backend` - Run backend only
- `yarn dev:frontend` - Run frontend only
- `yarn lint` - Run ESLint on both apps
- `yarn typecheck` - Run TypeScript type checking on both apps
- `yarn test` - Run all tests
- `yarn build` - Build both apps
- `yarn db:migrate` - Run backend database migrations
- `yarn db:seed` - Seed backend with initial data

### Backend tests

Run from `src/backend/`:
- `yarn test` - Run all backend tests
- `yarn test -- tests/auth.test.ts` - Run specific test file
- `yarn test -t "test name"` - Run single test by name

### Frontend tests

Run from `src/frontend/`:
- `yarn test` - Run all frontend tests
- `yarn test -- src/__tests__/property-form.test.tsx` - Run specific test file
- `yarn test -t "test name"` - Run single test by name

## Architecture

### Backend (`src/backend/`)

Entry point: `src/server.ts` exports `createApp()` which returns Express app

**Layer structure (data flow goes routes → middleware → repositories):**

- **routes** (`src/backend/src/routes/`): HTTP route handlers
  - `auth.ts` - Authentication endpoints (register, login, refresh)
  - `properties.ts` - Property CRUD operations
  - `enquiries.ts` - Enquiry management
  - `users.ts` - User profile endpoints
  - `images.ts` - Property image serving (`/api/properties/images/:filename`)

- **middleware** (`src/backend/src/middleware/`): Request processing
  - `auth.ts` - JWT verification (`requireAuth`, `requireRole`)
  - `errorHandler.ts` - Centralized error handling with `AppError`
  - `rateLimit.ts` - Request rate limiting
  - `upload.ts` - File upload handling for property images

- **repositories** (`src/backend/src/repositories/`): Data access layer
  - `userRepository.ts` - User CRUD and profile management
  - `propertyRepository.ts` - Property operations with image handling
  - `enquiryRepository.ts` - Enquiry data operations

- **services** (`src/backend/src/services/`): Business logic
  - Email service (mode: disabled/json/smtp)
  - Image upload processing

- **db** (`src/backend/src/db/`): Database utilities
  - `index.ts` - PG pool management, `query()` helper
  - `migrate.ts` - Database migrations

- **config** (`src/backend/src/config/`): Environment configuration
  - `env.ts` - Zod-validated environment variables

- **utils** (`src/backend/src/utils/`): Shared utilities
  - `jwt.ts` - Token signing/verification
  - `errors.ts` - `AppError` class with statusCode, code, details

- **types** (`src/backend/src/types/`): TypeScript type definitions

**Key patterns:**
- Empty string values are normalized to `null` before Zod validation in property routes
- All errors use `AppError` class with consistent response shape
- File uploads stored in `storage/uploads` directory, served at `/api/properties/images/:filename`
- Uses `pg-mem` for in-memory database in tests

### Frontend (`src/frontend/`)

Entry point: `src/main.tsx` configures app with `window.__APP_CONFIG__`

**Structure:**

- **app** (`src/frontend/src/app/`): App-level components
  - `router.tsx` - React Router configuration
  - `AppProviders.tsx` - Context providers (`AuthProvider`)
  - `ProtectedRoute.tsx` - Authentication guard for dashboard and listing routes

- **components** (`src/frontend/src/components/`): Reusable UI
  - `common/` - Shared UI components
  - `feedback/` - Feedback components (ErrorBoundary, Loading, etc.)
  - `layout/` - Layout components (AppShell)
  - `property/` - Property-specific components

- **context** (`src/frontend/src/context/`): React contexts
  - `AuthContext.tsx` - Authentication state and actions
  - `I18nContext.tsx` - Internationalization state

- **services** (`src/frontend/src/services/`): API client layer
  - `apiAdapters.ts` - Backend response normalization, transforms backend → frontend shapes
  - `apiClient.ts` - Core fetch client
  - `authService.ts` - Authentication API calls
  - `propertyService.ts` - Property API calls
  - `enquiryService.ts` - Enquiry API calls
  - `userService.ts` - User API calls
  - `mockBackend.ts` - Mock data for offline/local testing

- **hooks** (`src/frontend/src/hooks/`): Custom React hooks
  - `useAsyncData.ts` - Generic async data loading hook

- **pages** (`src/frontend/src/pages/`): Page components
  - Public: Home, Login, Register, Profile pages (flipper/owner)
  - Protected: Dashboard, Property create/edit, Listings

- **i18n** (`src/frontend/src/i18n/`): Internationalization
  - `dictionaries/en.ts` - English translations

- **utils** (`src/frontend/src/utils/`): Utilities
  - `storage.ts` - localStorage helpers for auth tokens and user data

- **types** (`src/frontend/src/types/`): Type definitions
  - `models.ts` - Frontend domain types (`User`, `Property`, `Enquiry`, etc.)
  - `api.ts` - API response types (`AuthResponse`, `PaginatedResult`)

**Key patterns:**
- API access should go through service modules, not directly from components
- Backend and frontend types are transformed via `apiAdapters.ts`
- Property create/update uses multipart FormData with `deleteImageIds` for image removal
- Frontend defaults to live API mode (`useMockData: false`); mock data disabled by default
- Services make direct API calls without fallback wrappers; errors propagate to UI

## Data Models

### Users
Two types: `OWNER` and `FLIPPER`
- Common: `id`, `email`, `name`, `phone`, `profilePicture`, `bio`, `createdAt`, `updatedAt`
- OWNER profile: `companyName`, `taxId`
- FLIPPER profile: `specializations[]`, `portfolioProjects`, `rating`, `reviewsCount`

### Properties
- `id`, `ownerId`, `title`, `description`, `location` (address, city, state, zip, lat/long)
- `propertyType`: single-family | multi-family | commercial | land
- `squareFootage`, `yearBuilt`, `condition`: poor | fair | needs-work | good
- `askingPrice`, `status`: active | sold | archived
- `images`: array of image URLs
- `imageRefs`: array of `{id, url}` for backend references
- `featured?: boolean`

### Enquiries
- Links flippers to properties
- `propertyId`, `flipperId`, `message`, `contactName`, `contactEmail`, `contactPhone`
- `status`: pending | contacted | accepted | rejected
- `emailDeliveryStatus`, `emailDeliveryDetails`

## Database Schema

Tables: `users`, `flipper_profiles`, `owner_profiles`, `properties`, `property_images`, `enquiries`

See `src/backend/src/db/migrate.ts` for full schema.

Key indexes:
- `idx_users_type` - users by user_type
- `idx_properties_owner` - properties by owner_id
- `idx_properties_status` - properties by status
- `idx_properties_location` - properties by city, state
- `idx_enquiries_property` - enquiries by property_id
- `idx_enquiries_flipper` - enquiries by flipper_id

## Docker

Development compose (`etc/docker/docker-compose.yml`):
- Volume mounts `src/backend` and `src/frontend` into containers
- Separate `node_modules` volumes for each service
- `AUTO_MIGRATE=true` by default
- Backend port: 4000, Frontend port: 5173

Production compose (`etc/docker/docker-compose.prod.yml`):
- Multi-stage builds with official images
- Uses `etc/docker/.env.prod`

## Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret (min 16 chars)
- `JWT_ACCESS_TTL` - Access token expiry (default: 15m)
- `JWT_REFRESH_TTL` - Refresh token expiry (default: 7d)
- `UPLOAD_PATH` - Path for uploaded files (default: ./storage/uploads)
- `CORS_ORIGIN` - Allowed origins (default: *)
- `EMAIL_MODE` - disabled | json | smtp
- `AUTO_MIGRATE` - Auto-run migrations on startup (default: true)

### Frontend
- `VITE_API_BASE_URL` - Backend API URL (default: /api)
- `VITE_USE_MOCKS` - Enable mock data (default: false, but ignored - mock data now disabled)

## Frontend Import Patterns

- Use `@/` alias for imports (configured in tsconfig)
- Prefer `@/services/*` for API calls over direct fetch
- Use `@/hooks/useAsyncData` for async data loading
- Use `@/context/AuthContext` via `useAuthContext` hook
- Internationalization via `@/i18n/dictionaries/en.ts`

## Testing

Backend tests use `pg-mem` for in-memory database - do not switch to live database.

Frontend tests use Jest with Testing Library.

## Security

- JWT-based authentication with access and refresh tokens
- Role-based access control (OWNER/FLIPPER)
- Helmet.js for security headers
- CORS configuration
- Rate limiting
