# پەیوەند — MySocial Bio

A premium bio-link platform (like Linktree/Beacons) built in **Behdini Kurdish (بەهدینی)**. Users create a single shareable profile page with all their links, analytics, and customization.

## Stack

- **Frontend** (`artifacts/peywend`): React 19 + Vite + TailwindCSS v4 + Wouter routing + TanStack Query
- **API Server** (`artifacts/api-server`): Express 5 + Drizzle ORM + PostgreSQL
- **Shared Libraries** (`lib/`):
  - `lib/db` — Drizzle schema and migrations
  - `lib/api-zod` — Zod schemas for API contracts
  - `lib/api-spec` — OpenAPI spec + Orval codegen
  - `lib/api-client-react` — Generated React Query hooks

## Running the project

The **Project** run button starts both services in parallel:

| Service | Workflow name | Command | Port | Preview |
|---------|--------------|---------|------|---------|
| Frontend | `artifacts/peywend: web` | `pnpm --filter @workspace/peywend run dev` | 23002 | `/` |
| API Server | `artifacts/api-server: API Server` | `pnpm --filter @workspace/api-server run dev` | 8080 | `/api` |

## First-time setup

```bash
# 1. Install dependencies
pnpm install

# 2. Push database schema (uses Replit's built-in PostgreSQL via DATABASE_URL)
pnpm --filter @workspace/db exec drizzle-kit push
```

The database is Replit's built-in PostgreSQL — `DATABASE_URL` is provided automatically as an environment variable; no additional configuration is needed.

## Database schema

Schema lives in `lib/db/src/schema/`:
- `users.ts` — user accounts
- `pages.ts` — bio pages (one per user)
- `blocks.ts` — content blocks on a page
- `links.ts` — individual links
- `clicks.ts` — click analytics events

To update the schema after changes: `pnpm --filter @workspace/db exec drizzle-kit push`

## Key routes (Kurdish slugs)

| Path | Page |
|------|------|
| `/` | Landing page |
| `/چوونەژوورەوە` | Login |
| `/تومارکردن` | Register step 1 |
| `/تومارکردن/زانیاری` | Register step 2 |
| `/داشبۆرد` | Dashboard home |
| `/داشبۆرد/لینکی-بیو` | Link-in-bio editor |
| `/داشبۆرد/شیکاری` | Analytics |
| `/داشبۆرد/ڕێکخستن` | Settings |
| `/:username` | Public profile page |

## Requirements

See `REQUIREMENTS.md` for the full feature roadmap (analytics, admin panel, premium plans, AI features, themes, etc.).

## User preferences

- Language: Behdini Kurdish (بەهدینی) for all UI text
