
## Express Helper

[![codecov](https://codecov.io/gh/Loksly/expresshelper/branch/master/graph/badge.svg)](https://codecov.io/gh/Loksly/expresshelper)
[![Known Vulnerabilities](https://snyk.io/test/github/loksly/expresshelper/badge.svg)](https://snyk.io/test/github/loksly/expresshelper)
[![HitCount](https://hits.dwyl.com/loksly/expresshelper.svg)](https://hits.dwyl.com/loksly/expresshelper)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/loksly/expresshelper/issues)
[![https://nodei.co/npm/@loksly/expresshelper.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/@loksly/expresshelper.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/@loksly/expresshelper)


Express helper is a plugin that saves logic when writing applications using [express](https://expressjs.com/).

## Table of Contents

- [Installation](#installation)
- [Quick Start — Minimal Preset](#quick-start--minimal-preset)
- [Composable Utilities](#composable-utilities)
  - [asyncHandler](#asynchandler)
  - [requestIdMiddleware](#requestidmiddleware)
  - [HttpError & helpers](#httperror--helpers)
  - [errorMiddleware](#errormiddleware)
  - [expresshelper (core)](#expresshelper-core)
- [TypeScript](#typescript)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)

---

## Installation

```
npm i @loksly/expresshelper
```

---

## Quick Start — Minimal Preset

`presetMinimal` is the recommended zero-config starting point. It wires up only the essentials — a request-ID middleware and the core `expresshelper` helper — without installing a global error handler or enforcing a response envelope.

```typescript
import express from "express";
import { presetMinimal, errorMiddleware, asyncHandler, notFound } from "@loksly/expresshelper";

const app = express();
app.use(express.json());

// Install the minimal preset (requestId + expresshelper helper)
app.use(presetMinimal());

// Your routes — use asyncHandler for async functions
app.get("/api/pizzas/:id", asyncHandler(async (req, res) => {
    const pizza = await db.findOne(req.params.id);
    if (!pizza) throw notFound("Pizza not found");
    res.json(pizza);
}));

// Explicitly install an error handler (not included in the preset)
app.use(errorMiddleware());

app.listen(3000);
```

### presetMinimal options

```typescript
app.use(presetMinimal({
    requestId: false,                        // disable request-ID middleware
    requestId: { header: "x-correlation-id" }, // use a custom header
    expresshelper: { shouldSend404onEmpty: false }, // pass options to expresshelper
}));
```

---

## Composable Utilities

All utilities are exported individually so you can compose exactly what you need.

### asyncHandler

Wraps an `async` route handler and forwards any rejected promise (or thrown error) to Express's `next(err)`, so your error middleware can handle it.

```typescript
import { asyncHandler } from "@loksly/expresshelper";

app.get("/users/:id", asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
}));
```

### requestIdMiddleware

Reads a request-ID from a configurable header (`x-request-id` by default). If no ID is present it generates a UUID v4, stores it on `res.locals.requestId`, and echoes it back in the response header.

```typescript
import { requestIdMiddleware } from "@loksly/expresshelper";

// Default header: x-request-id
app.use(requestIdMiddleware());

// Custom header
app.use(requestIdMiddleware({ header: "x-correlation-id" }));
```

### HttpError & helpers

A typed error class plus convenience constructors for the most common HTTP error codes.

```typescript
import { HttpError, badRequest, unauthorized, forbidden, notFound, conflict, unprocessableEntity } from "@loksly/expresshelper";

// Use helper constructors
throw notFound("Resource not found");
throw badRequest("Invalid input", { field: "email" });

// Or construct directly
throw new HttpError(429, "RATE_LIMITED", "Too many requests");
```

| Constructor | Status | Code |
|---|---|---|
| `badRequest(msg?, details?)` | 400 | `BAD_REQUEST` |
| `unauthorized(msg?, details?)` | 401 | `UNAUTHORIZED` |
| `forbidden(msg?, details?)` | 403 | `FORBIDDEN` |
| `notFound(msg?, details?)` | 404 | `NOT_FOUND` |
| `conflict(msg?, details?)` | 409 | `CONFLICT` |
| `unprocessableEntity(msg?, details?)` | 422 | `UNPROCESSABLE_ENTITY` |

### errorMiddleware

Converts thrown errors into JSON responses. Safe by default — stack traces are **never** leaked unless you explicitly opt in.

```typescript
import { errorMiddleware } from "@loksly/expresshelper";

// Default: JSON format, no stack traces
app.use(errorMiddleware());

// Include stack traces (development only)
app.use(errorMiddleware({ includeStack: process.env.NODE_ENV !== "production" }));

// RFC 7807 Problem+JSON format
app.use(errorMiddleware({ format: "problem+json" }));
```

**JSON format** response (default):
```json
{ "error": "Resource not found", "code": "NOT_FOUND", "details": "..." }
```

**Problem+JSON format** response (`application/problem+json`):
```json
{ "type": "https://httpstatuses.com/404", "title": "Resource not found", "status": 404, "code": "NOT_FOUND" }
```

### expresshelper (core)

The original helper for wrapping callbacks, promises and sending responses. Attach it via `expresshelper()` middleware or via `presetMinimal`.

```typescript
import { expresshelper, ResponseHelper } from "@loksly/expresshelper";

app.use(expresshelper());

app.get("/api/pizzas/:id", (req, res: ResponseHelper) => {
    res.locals.expresshelper.promiseWrapper(pizzas.findOne(req.params.id));
});
```

---

## TypeScript

The package ships with full TypeScript declarations. `Express.Locals` is augmented with:

```typescript
namespace Express {
    interface Locals {
        expresshelper?: ExpressHelper;
        requestId?: string;
    }
}
```

---

## Best Practices

- **Composability first** — import only what you need. Every utility is a named export.
- **Explicit error handler** — `presetMinimal` deliberately does not install an error handler. Register `errorMiddleware()` yourself, after your routes.
- **Never leak stack traces in production** — `errorMiddleware` hides stacks by default. Pass `{ includeStack: true }` only in development.
- **Use `asyncHandler`** — async routes that throw or return rejected promises must be wrapped so Express can catch them.

---

## API Reference

### Core

| Export | Description |
|---|---|
| `expresshelper(options?)` | Returns middleware that attaches `ExpressHelper` to `res.locals.expresshelper` |
| `ResponseHelper` | Extended `Response` type with typed `res.locals.expresshelper` |
| `HTTP_CODES` | Enum of HTTP status codes |

### Preset

| Export | Description |
|---|---|
| `presetMinimal(options?)` | Returns `RequestHandler[]` with requestId + expresshelper; no error handler |

### Composable utilities

| Export | Description |
|---|---|
| `asyncHandler(fn)` | Wraps async handler and forwards errors to `next` |
| `requestIdMiddleware(options?)` | Reads/generates a request ID and stores it on `res.locals.requestId` |
| `HttpError` | Typed error class with `status`, `code`, `message`, `details` |
| `badRequest(msg?, details?)` | Creates a 400 `HttpError` |
| `unauthorized(msg?, details?)` | Creates a 401 `HttpError` |
| `forbidden(msg?, details?)` | Creates a 403 `HttpError` |
| `notFound(msg?, details?)` | Creates a 404 `HttpError` |
| `conflict(msg?, details?)` | Creates a 409 `HttpError` |
| `unprocessableEntity(msg?, details?)` | Creates a 422 `HttpError` |
| `errorMiddleware(options?)` | Error handler middleware; supports `json` and `problem+json` formats |

### ExpressHelper instance methods

| Method | Description |
|---|---|
| `promiseWrapper(promise, send404onEmpty?)` | Handles promise resolution/rejection |
| `cb()` | Returns a Node-style `(err, value)` callback |
| `cbWithDefaultValue(defaultValue)` | Returns a callback that sends a default on success |
| `ok(send404onEmpty?)` | Returns handler that sends data or 404 on empty |
| `okWithDefaultValue(defaultValue, statusCode?)` | Returns handler that always sends `defaultValue` |
| `send(content, statusCode?)` | Sends a JSON response |
| `error(errCode?, defaultMessage?)` | Returns error handler callback |
| `callbackError(err)` | Sends 500 with error details |
| `notFound()` | Sends 404 |
| `unauthenticated(details)` | Sends 401 |
| `forbidden(details)` | Sends 403 |
| `unauthorized(details)` | Alias for `forbidden` |
| `missingParameter(name)` | Sends 400 with parameter name |
| `notImplemented()` | Sends 501 |

For examples see the [e2e tests](./src/spec/e2e/).

