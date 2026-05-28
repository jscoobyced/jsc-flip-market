# Real-Estate Flipping Marketplace

Full-stack marketplace for property owners and real-estate flippers, with a React/Vite frontend and an Express/PostgreSQL backend.

## Apps

- `frontend/` - React 18, TypeScript, Vite, Tailwind CSS
- `backend/` - Express, TypeScript, PostgreSQL, JWT auth, uploads, enquiries

## Quick start

1. Install dependencies:
   ```bash
   yarn install:all
   ```
2. Configure environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
3. Update `backend/.env` with a working PostgreSQL `DATABASE_URL` and JWT/email settings as needed.
4. Prepare the database:
   ```bash
   yarn db:migrate
   yarn db:seed
   ```
5. Start both apps:
   ```bash
   yarn dev
   ```

The frontend runs on `http://localhost:5173` and proxies `/api` and `/api/properties/images` to the backend on `http://localhost:4000`.

## Root scripts

- `yarn dev` - run frontend and backend together
- `yarn lint` - run both linters
- `yarn typecheck` - run both type-checks
- `yarn test` - run both test suites
- `yarn build` - build both apps
- `yarn db:migrate` - run backend migrations
- `yarn db:seed` - seed backend data

## Notes

- Uploaded property images are served from the backend under `/api/properties/images/:filename`.
