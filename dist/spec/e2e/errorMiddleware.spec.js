"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var request = require("supertest");
var __1 = require("../../");
function makeApp(throwFn, opts) {
    var app = express();
    app.get("/", throwFn);
    app.use(__1.errorMiddleware(opts));
    return app;
}
describe("errorMiddleware", function () {
    describe("HttpError helper constructors", function () {
        it("badRequest creates HttpError with status 400", function () {
            var err = __1.badRequest("oops", { field: "x" });
            expect(err instanceof __1.HttpError).toBe(true);
            expect(err.status).toBe(400);
            expect(err.code).toBe("BAD_REQUEST");
            expect(err.message).toBe("oops");
        });
        it("notFound creates HttpError with status 404", function () {
            var err = __1.notFound();
            expect(err.status).toBe(404);
            expect(err.code).toBe("NOT_FOUND");
        });
        it("forbidden creates HttpError with status 403", function () {
            var err = __1.forbidden();
            expect(err.status).toBe(403);
        });
        it("unauthorized creates HttpError with status 401", function () {
            var err = __1.unauthorized();
            expect(err.status).toBe(401);
        });
        it("conflict creates HttpError with status 409", function () {
            var err = __1.conflict();
            expect(err.status).toBe(409);
        });
        it("unprocessableEntity creates HttpError with status 422", function () {
            var err = __1.unprocessableEntity();
            expect(err.status).toBe(422);
        });
    });
    describe("json format (default)", function () {
        it("should respond with 500 for unknown errors", function (done) {
            var app = makeApp(function (_req, _res, next) { return next(new Error("boom")); });
            request(app).get("/").expect(function (res) {
                expect(res.status).toBe(500);
                expect(res.body.error).toBe("boom");
                expect(res.body.code).toBe("INTERNAL_SERVER_ERROR");
                expect(res.body.stack).toBeUndefined();
                done();
            }).end(function () { });
        });
        it("should respond with the HttpError status and code", function (done) {
            var app = makeApp(function (_req, _res, next) { return next(__1.badRequest("invalid input", "x is required")); });
            request(app).get("/").expect(function (res) {
                expect(res.status).toBe(400);
                expect(res.body.error).toBe("invalid input");
                expect(res.body.code).toBe("BAD_REQUEST");
                expect(res.body.details).toBe("x is required");
                done();
            }).end(function () { });
        });
        it("should not leak stack trace by default", function (done) {
            var app = makeApp(function (_req, _res, next) { return next(new Error("secret")); });
            request(app).get("/").expect(function (res) {
                expect(res.body.stack).toBeUndefined();
                done();
            }).end(function () { });
        });
        it("should include stack trace when includeStack is true", function (done) {
            var app = makeApp(function (_req, _res, next) { return next(new Error("visible")); }, { includeStack: true });
            request(app).get("/").expect(function (res) {
                expect(typeof res.body.stack).toBe("string");
                done();
            }).end(function () { });
        });
    });
    describe("problem+json format", function () {
        it("should use application/problem+json content-type", function (done) {
            var app = makeApp(function (_req, _res, next) { return next(__1.notFound("item missing")); }, { format: "problem+json" });
            request(app).get("/").expect(function (res) {
                expect(res.status).toBe(404);
                expect(res.header["content-type"]).toContain("application/problem+json");
                expect(res.body.title).toBe("item missing");
                expect(res.body.status).toBe(404);
                expect(res.body.type).toBe("https://httpstatuses.com/404");
                done();
            }).end(function () { });
        });
        it("should not leak stack trace in problem+json by default", function (done) {
            var app = makeApp(function (_req, _res, next) { return next(new Error("hidden")); }, { format: "problem+json" });
            request(app).get("/").expect(function (res) {
                expect(res.body.trace).toBeUndefined();
                done();
            }).end(function () { });
        });
        it("should include trace in problem+json when includeStack is true", function (done) {
            var app = makeApp(function (_req, _res, next) { return next(new Error("traced")); }, { format: "problem+json", includeStack: true });
            request(app).get("/").expect(function (res) {
                expect(typeof res.body.trace).toBe("string");
                done();
            }).end(function () { });
        });
    });
});
//# sourceMappingURL=errorMiddleware.spec.js.map