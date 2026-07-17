---
name: Express route order — blocks/reorder
description: Critical routing order rule for /blocks routes in the API server
---

## Rule
`router.put("/blocks/reorder", ...)` MUST be defined **before** `router.put("/blocks/:id", ...)`.

**Why:** Express matches routes in declaration order. If `/:id` comes first, the literal string `"reorder"` is captured as the `:id` param, and the reorder endpoint is never reached — it receives a NaN id and returns 400.

**How to apply:** Any time a new literal route and a param route share the same method + prefix, put the literal first. This applies to any resource (e.g. `/links/reorder` before `/links/:id`).

File: `artifacts/api-server/src/routes/blocks.ts`
