
## Express Helper

[![codecov](https://codecov.io/gh/Loksly/expresshelper/branch/master/graph/badge.svg)](https://codecov.io/gh/Loksly/expresshelper)
[![Known Vulnerabilities](https://snyk.io/test/github/loksly/expresshelper/badge.svg)](https://snyk.io/test/github/loksly/expresshelper)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/loksly/expresshelper/issues)
[![npm version](https://badge.fury.io/js/%40loksly%2Fexpresshelper.svg)](https://www.npmjs.com/package/@loksly/expresshelper)

Express Helper is a middleware plugin for [Express](https://expressjs.com/) that reduces boilerplate when writing route handlers. It provides a consistent, well-tested set of response helpers for common HTTP scenarios such as 404 Not Found, 400 Bad Request, 401 Unauthenticated, 403 Forbidden, and more.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [API](#api)
- [TypeScript Usage](#typescript-usage)
- [Best Practices](#best-practices)
- [Coverage](#coverage)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

```bash
npm install @loksly/expresshelper
```

---

## Quick Start

```typescript
import express from "express";
import { expresshelper } from "@loksly/expresshelper";

const app = express();

app.use(expresshelper());

app.get("/api/pizzas/:id", (req, res) => {
    if (req.params.id) {
        res.locals.expresshelper!.promiseWrapper(pizzas.findOne(req.params.id));
    } else {
        res.locals.expresshelper!.missingParameter("id");
    }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
```

---

## Usage

### Register the middleware

```typescript
import { expresshelper } from "@loksly/expresshelper";

// With default options
app.use(expresshelper());

// With custom options
app.use(expresshelper({
    logger: console,         // any object with a .trace() method
    enableJSONP: false,      // default: false
    shouldSend404onEmpty: true  // default: true — sends 404 when promise resolves to falsy
}));
```

### Route handlers

Once the middleware is registered, `res.locals.expresshelper` is available in every route handler:

```typescript
// Promise-based
app.get("/pizzas/:id", (req, res) => {
    res.locals.expresshelper!.promiseWrapper(pizzas.findOne(req.params.id));
});

// Callback-based (error-first)
app.get("/pizzas", (_req, res) => {
    pizzas.find(res.locals.expresshelper!.cb());
});

// Error handling
app.put("/pizzas/:id", (req, res) => {
    if (!req.params.id) {
        res.locals.expresshelper!.missingParameter("id");
        return;
    }
    res.locals.expresshelper!.promiseWrapper(pizzas.updateOne(req.params.id, req.body));
});
```

### Expected HTTP responses

| Call | HTTP Status | Body |
|------|-------------|------|
| `promiseWrapper(resolve([...]))` | 200 OK | `[...]` |
| `promiseWrapper(resolve(null))` | 404 Not Found | `{ error: "An error has occurred", details: "Not found" }` |
| `promiseWrapper(reject("err"))` | 500 Internal Server Error | `{ error: "An error has occurred", details: "err" }` |
| `notFound()` | 404 Not Found | `{ error: "An error has occurred", details: "Not found" }` |
| `missingParameter("id")` | 400 Bad Request | `{ error: "Missing parameter", details: "id" }` |
| `unauthenticated("Login required")` | 401 Unauthorized | `{ error: "Unauthenticated", details: "Login required" }` |
| `forbidden("Admin only")` | 403 Forbidden | `{ error: "Unauthorized", details: "Admin only" }` |
| `notImplemented()` | 501 Not Implemented | `{ error: "Not implemented" }` |

---

## API

All methods are available on `res.locals.expresshelper` after applying the middleware.

### `promiseWrapper(promise, shouldSend404onEmpty?)`

Wraps a promise: on resolve, calls `ok()`; on reject, calls `error()`.

```typescript
res.locals.expresshelper!.promiseWrapper(db.findOne(id));
```

### `ok(shouldSend404onEmpty?)`

Returns a callback that sends the resolved value, or a 404 if the value is falsy (when `shouldSend404onEmpty` is true).

```typescript
res.locals.expresshelper!.ok()(data);
```

### `okWithDefaultValue(defaultValue, statusCode?)`

Returns a callback that always responds with the given `defaultValue` and optional `statusCode`.

```typescript
res.locals.expresshelper!.okWithDefaultValue({ status: "created" }, 201)();
```

### `cb()`

Returns an error-first callback `(err, value) => void`. On error, sends 500; on success, sends the value.

```typescript
db.find(res.locals.expresshelper!.cb());
```

### `cbWithDefaultValue(defaultValue)`

Returns an error-first callback. On error, sends 500; on success, sends `defaultValue` instead of the callback value.

```typescript
db.find(res.locals.expresshelper!.cbWithDefaultValue([]));
```

### `error(errCode?, defaultMessage?)`

Returns a handler `(err) => void` that sends an error response.

```typescript
res.locals.expresshelper!.error(422, "Validation failed")(validationError);
res.locals.expresshelper!.error("Custom message")(err);
```

### `callbackError(err)`

Sends a 500 error response directly.

```typescript
res.locals.expresshelper!.callbackError(new Error("Something went wrong"));
```

### `send(content, statusCode?)`

Low-level helper to send JSON (or JSONP) with an optional status code.

```typescript
res.locals.expresshelper!.send({ ok: true }, 200);
```

### `notFound()`

Sends a 404 response.

```typescript
res.locals.expresshelper!.notFound();
```

### `unauthenticated(details)`

Sends a 401 response.

```typescript
res.locals.expresshelper!.unauthenticated("Login required");
```

### `unauthorized(details)` / `forbidden(details)`

Sends a 403 response.

```typescript
res.locals.expresshelper!.forbidden("Insufficient permissions");
```

### `missingParameter(parameterName)`

Sends a 400 response indicating a missing parameter.

```typescript
res.locals.expresshelper!.missingParameter("userId");
```

### `notImplemented()`

Sends a 501 response.

```typescript
res.locals.expresshelper!.notImplemented();
```

---

## TypeScript Usage

The library ships with full TypeScript support. The `Express.Locals` interface is automatically augmented so that `res.locals.expresshelper` is typed as `ExpressHelper | undefined`.

```typescript
import { ExpressHelperOptions, HTTP_CODES } from "@loksly/expresshelper";

// Full typed options
const options: ExpressHelperOptions = {
    logger: console,
    enableJSONP: false,
    shouldSend404onEmpty: true
};
app.use(expresshelper(options));

// In a route handler
app.get("/example", (_req, res) => {
    // res.locals.expresshelper is ExpressHelper | undefined
    // Use non-null assertion (!) when middleware is guaranteed to be applied
    res.locals.expresshelper!.notFound();
});

// Access HTTP status codes via the exported enum
app.get("/teapot", (_req, res) => {
    res.locals.expresshelper!.send({ message: "I'm a teapot" }, HTTP_CODES.ImATeapotError);
});
```

---

## Best Practices

1. **Always apply middleware before routes**: Register `app.use(expresshelper())` before any route definitions.

2. **Use `shouldSend404onEmpty: true` (default)**: This ensures that when a database query returns `null` or `undefined`, a proper 404 is returned instead of an empty 200.

3. **Provide a logger for tracing errors**: Pass a logger to get trace-level logs for every error sent through the helper:
   ```typescript
   app.use(expresshelper({ logger: console }));
   ```

4. **Use `promiseWrapper` for async routes**: It automatically handles both resolve and reject cases.

5. **Prefer `missingParameter` over generic 400s**: It provides a consistent error format for clients.

6. **Use `forbidden` for authorization failures, `unauthenticated` for auth failures**: Keep the distinction clear for clients.

---

## Coverage

This library maintains 100% test coverage across all source files.

To run the coverage report locally:

```bash
npm run coverage
```

This generates:
- A text summary in the terminal
- An HTML report in `coverage/lcov-report/index.html`
- An LCOV file at `coverage/lcov.info` (for CI integration)

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `npm test`
5. Verify coverage: `npm run coverage`
6. Commit your changes and open a pull request

For bug reports or feature requests, please [open an issue](https://github.com/loksly/expresshelper/issues).

---

## License

[MIT](./LICENSE)

---

For examples of usage see the [tests](./src/spec/e2e/usage.spec.ts).
