---
name: API error handling pattern
description: How all Express route errors must be handled in the Peywend API server
---

## Pattern
Every async route handler must:
1. Wrap its body in `try { ... } catch (err) { next(err); }`
2. Never let a DB error propagate as an unhandled rejection

## Global handler
`artifacts/api-server/src/app.ts` registers a 4-arg error handler **after** all routes:
```ts
app.use((err: Error, req, res, _next) => {
  logger.error({ err }, "Unhandled error");
  res.status(500).json({ error: "خەتایەکی ناخۆش ڕوویدا" });
});
```
Without this, Express returns an HTML error page which breaks the React client.

**Why:** The original codebase had zero try-catch in any route handler. DB errors silently crashed requests with HTML responses.

## requireAuth middleware
Also wraps the DB lookup in try/catch and calls `next(err)` on failure.
File: `artifacts/api-server/src/middlewares/requireAuth.ts`
