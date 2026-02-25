import express = require('express');
import request = require("supertest");

import { Application, Request, Response, NextFunction } from "express";
import { errorMiddleware, HttpError, badRequest, notFound, forbidden, unauthorized, conflict, unprocessableEntity } from "../../";

function makeApp(throwFn: (req: Request, res: Response, next: NextFunction) => void, opts?: Parameters<typeof errorMiddleware>[0]): Application {
    const app = express();
    app.get("/", throwFn);
    app.use(errorMiddleware(opts));
    return app;
}

describe("errorMiddleware", () => {

    describe("HttpError helper constructors", () => {
        it("badRequest creates HttpError with status 400", function () {
            const err = badRequest("oops", { field: "x" });
            expect(err instanceof HttpError).toBe(true);
            expect(err.status).toBe(400);
            expect(err.code).toBe("BAD_REQUEST");
            expect(err.message).toBe("oops");
        });

        it("notFound creates HttpError with status 404", function () {
            const err = notFound();
            expect(err.status).toBe(404);
            expect(err.code).toBe("NOT_FOUND");
        });

        it("forbidden creates HttpError with status 403", function () {
            const err = forbidden();
            expect(err.status).toBe(403);
        });

        it("unauthorized creates HttpError with status 401", function () {
            const err = unauthorized();
            expect(err.status).toBe(401);
        });

        it("conflict creates HttpError with status 409", function () {
            const err = conflict();
            expect(err.status).toBe(409);
        });

        it("unprocessableEntity creates HttpError with status 422", function () {
            const err = unprocessableEntity();
            expect(err.status).toBe(422);
        });
    });

    describe("json format (default)", () => {

        it("should respond with 500 for unknown errors", function (done) {
            const app = makeApp((_req, _res, next) => next(new Error("boom")));
            request(app).get("/").expect((res) => {
                expect(res.status).toBe(500);
                expect(res.body.error).toBe("boom");
                expect(res.body.code).toBe("INTERNAL_SERVER_ERROR");
                expect(res.body.stack).toBeUndefined();
                done();
            }).end(() => {});
        });

        it("should respond with the HttpError status and code", function (done) {
            const app = makeApp((_req, _res, next) => next(badRequest("invalid input", "x is required")));
            request(app).get("/").expect((res) => {
                expect(res.status).toBe(400);
                expect(res.body.error).toBe("invalid input");
                expect(res.body.code).toBe("BAD_REQUEST");
                expect(res.body.details).toBe("x is required");
                done();
            }).end(() => {});
        });

        it("should not leak stack trace by default", function (done) {
            const app = makeApp((_req, _res, next) => next(new Error("secret")));
            request(app).get("/").expect((res) => {
                expect(res.body.stack).toBeUndefined();
                done();
            }).end(() => {});
        });

        it("should include stack trace when includeStack is true", function (done) {
            const app = makeApp((_req, _res, next) => next(new Error("visible")), { includeStack: true });
            request(app).get("/").expect((res) => {
                expect(typeof res.body.stack).toBe("string");
                done();
            }).end(() => {});
        });
    });

    describe("problem+json format", () => {

        it("should use application/problem+json content-type", function (done) {
            const app = makeApp((_req, _res, next) => next(notFound("item missing")), { format: "problem+json" });
            request(app).get("/").expect((res) => {
                expect(res.status).toBe(404);
                expect(res.header["content-type"]).toContain("application/problem+json");
                expect(res.body.title).toBe("item missing");
                expect(res.body.status).toBe(404);
                expect(res.body.type).toBe("https://httpstatuses.com/404");
                done();
            }).end(() => {});
        });

        it("should not leak stack trace in problem+json by default", function (done) {
            const app = makeApp((_req, _res, next) => next(new Error("hidden")), { format: "problem+json" });
            request(app).get("/").expect((res) => {
                expect(res.body.trace).toBeUndefined();
                done();
            }).end(() => {});
        });

        it("should include trace in problem+json when includeStack is true", function (done) {
            const app = makeApp((_req, _res, next) => next(new Error("traced")), { format: "problem+json", includeStack: true });
            request(app).get("/").expect((res) => {
                expect(typeof res.body.trace).toBe("string");
                done();
            }).end(() => {});
        });
    });
});
