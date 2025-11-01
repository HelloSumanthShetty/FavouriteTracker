# FavouriteTracker — Favorite Movies & TV Shows Web Application

A full-stack web application to manage a list of favourite movies and TV shows. Users can add, view (in an infinite-scroll table), edit, and delete entries. Each entry captures detailed information: Title, Type (Movie / TV Show), Director, Budget, Location, Duration or Year/Time.

Live deployment
- Deployed on Render: https://favourite-tracker-l9wbe3f92-hellosumanthshettys-projects.vercel.app/

Table of contents
- About
- Tech stack
- Repo layout (expected)
- Local setup (quick)
  - Prerequisites
  - Backend setup
  - Frontend setup
  - Running both locally
- Database: schema & migrations
- API (endpoints)
- Frontend: features & infinite scroll
- Seed data & demo credentials
- Environment variables (.env.example)
- Tests
- Deployment notes (Render)
- Troubleshooting & common edge cases
- Contributing
- License

About
FavouriteTracker lets users create and manage favorite Movies & TV Shows with a clean UI and a robust REST API. This project prioritizes correctness (validation, migrations), UX (infinite scroll, edit/delete modals), and deployability.

Tech stack
- Frontend
  - React (Vite + TypeScript)
  - TailwindCSS for styling
  - A UI library (e.g., Aceternity UI / Shadcn UI) for components/modals
  - React Hooks & functional components
- Backend
  - Node.js + Express
  - MySQL (production)
  - ORM: Prisma 
  - Validation: Zod 

Repo layout (recommended/expected)
- /frontend/           — React + Vite + TypeScript source
- /backend/            — Express app, controllers, routes, ORM models
- /backend/prisma/     — (if using Prisma) schema.prisma & migrations
- README.md

Local setup (quick)

Prerequisites
- Node.js (LTS 18+ recommended)
- npm or yarn
- MySQL 8+ 

Backend setup (example with Prisma)
1. Enter backend
   - cd backend
2. Install dependencies
   - npm install
3. Create .env (based on .env.example)
   - cp .env.example .env
   - Set DATABASE_URL, PORT, JWT_SECRET (if auth enabled)
4. Run migrations & seed (Prisma example)
   - npx prisma migrate deploy     # apply migrations (production)
   - npx prisma migrate dev --name init   # for local dev (generates migrations)
   - npm run seed                  # (optional) seed >50 entries for testing infinite scroll
5. Start backend
   - npm run dev
   - Default API base: http://localhost:4000 (or PORT in .env)

Frontend setup
1. Enter frontend
   - cd frontend
2. Install dependencies
   - npm install
3. Create .env (if used)
   - cp .env.example .env
   - Set VITE_API_URL=http://localhost:4000/api
4. Start dev server
   - npm run dev
   - Visit http://localhost:5173 (Vite default) or printed URL

Running both locally
- Option A: Start backend (npm run dev) then frontend (npm run dev).
- Option B: Use a dev script or tool (concurrently, turbo, or a top-level package.json) to start both with a single command.

Database: schema & migrations (example model)
The app expects a single core table for entries. Example schema (Prisma-like):

model Entry {
 - id         Int      @id @default(autoincrement())
 - title      String
 - type       EntryType
 - director   String
 - budget     String
 - location   String
 - duration   String
 - yearOrTime String
 - createdAt  DateTime @default(now())
 - updatedAt  DateTime @updatedAt
}

enum EntryType {
 - MOVIE
 - TV_SHOW
}

model User {
 - id        String   @id @default(uuid())
 - name      String
 - email     String   @unique
 - password  String
 - createdAt DateTime @default(now())
}

Migrations
-  Use `npx prisma migrate dev` locally

API (REST) — expected endpoints
Base path: /api/

Frontend: features & infinite scroll
- Main screen: table or list of favourites with columns:
  Title | Type | Director | Budget | Location | Duration | Year | Actions (Edit/Delete)
- Infinite scroll implementation options:
  - Cursor-based: GET /api/favourites?limit=20&cursor=<lastCursor>
  - DataFetching : Axios
  - UI libraries: react-infinite-scroll-component or a simple custom hook using IntersectionObserver for performance.
- Add & Edit:
  - Modal or page form with fields for Title, Type (select), Director, Budget, Location, Duration, YearorDate.
  - Client-side validation mirrors server validation.
- Delete:
  - Confirmation dialog (modal or browser confirm) before sending DELETE.
  - On success, remove item from UI and optionally show undo toast (optimistic UI).
  
Environment variables (.env.example)
Backend (.env.example)
PORT=4000
DATABASE_URL=mysql://user:password@localhost:3306/favouritetracker
JWT_SECRET=your_jwt_secret_here



## Seeding the database
This project uses Prisma's seeding mechanism with @faker-js/faker to populate sample data.

- JavaScript/dist seed (example):
  prisma/seed.js

- TypeScript seed (example):
  prisma/seed.ts

Add one of the following to package.json so Prisma can run the seed script:
- For JS/dist:
  "prisma": { "seed": "node prisma/seed.js" }
- For TS (using ts-node):
  "prisma": { "seed": "ts-node --transpile-only prisma/seed.ts" }

Run the seed:
  npx prisma db seed

Frontend (.env.example)
VITE_API_URL=http://localhost:4000/api

Deployment notes (Render)
- Backend and Frontend:
  - Build & start commands: npm run build && npm start OR npm run start:prod
  - Set environment variables in Render dashboard (DATABASE_URL, JWT_SECRET, NODE_ENV, etc.)
  - Use Render Managed Database or external MySQL and provide connection string.
  - Fully deployed
