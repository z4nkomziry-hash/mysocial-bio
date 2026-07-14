# پەیوەند — Kurdish Link-in-Bio Platform

A free Beacons.ai-style link-in-bio platform built entirely in Behdini Kurdish (Arabic script, RTL). Kurdish creators can claim a username, build a beautiful public profile, add links and social accounts, and track analytics.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, served at /api)
- `pnpm --filter @workspace/peywend run dev` — run the frontend (port 23002, served at /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4 (artifact: `artifacts/peywend`)
- API: Express 5 (artifact: `artifacts/api-server`, base path: `/api`)
- DB: PostgreSQL + Drizzle ORM (lib: `lib/db`)
- Auth: JWT (bcryptjs + jsonwebtoken), token stored in `localStorage` key `peywend_token`
- Validation: Zod (zod v3), drizzle-zod
- API codegen: Orval (from `lib/api-spec/openapi.yaml`)
- Font: Cairo (Google Fonts, Arabic script)
- Icons: lucide-react + react-icons/si

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for API contracts
- `lib/db/src/schema/` — Drizzle table definitions (users, pages, blocks, links, clicks)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/api-server/src/lib/auth.ts` — JWT sign/verify + bcrypt helpers
- `artifacts/api-server/src/middlewares/requireAuth.ts` — JWT middleware
- `artifacts/peywend/src/` — React frontend (Kurdish RTL UI)
- `lib/api-client-react/src/generated/` — generated hooks (do not edit)

## Architecture decisions

- All UI text is Behdini Kurdish in Arabic (Sorani) script; `dir="rtl"` set globally
- JWT auth (stateless) — token in localStorage, sent as `Authorization: Bearer` header
- Orval codegen from OpenAPI spec — no hand-written API types
- Public profile route: `/:username` — fetches profile without auth
- Click tracking: POST `/api/analytics/click` — increments `links.click_count`

## Product

- Landing page with Kurdish hero section and feature breakdown
- Username claim + multi-step account registration
- Dashboard with stats, Link-in-Bio editor, Analytics (recharts), Settings
- Link-in-Bio editor: drag-to-reorder blocks (header, links, follower_count, contact_form)
- Public profile at `/{username}` — shows links, social icons, avatar, theme
- Analytics: clicks per day chart + top links

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Use `zod/v4` import path in schema files (workspace uses zod@3 with v4 compatibility layer)
- OpenAPI body schemas must use entity-shaped names (e.g. `LinkInput`, not `CreateLinkBody`) to avoid TS2308 collisions
- `format: email` in OpenAPI spec causes Orval to emit `zod.email()` which is Zod v4 API — do not use it
- Cairo font import must be the VERY FIRST line in `index.css` before all other `@import` statements

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `lib/api-spec/openapi.yaml` for the complete API contract
