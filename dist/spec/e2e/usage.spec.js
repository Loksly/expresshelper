"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const request = require("supertest");
const __1 = require("../../");
function expectStatus(router, code, done, content) {
    request(router).get("/").expect((res) => {
        expect(res.status).toBe(code);
        if (content) {
            expect(res.body).toEqual(content);
        }
        done();
    }).end(() => { });
}
describe("Should work as expected", () => {
    beforeEach(function () {
        this.router = express();
        this.router.use((0, __1.expresshelper)({
            enableJSONP: false,
            shouldSend404onEmpty: true
        }));
    });
    it("should return not found when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            res.locals.expresshelper.notFound();
        });
        expectStatus(this.router, __1.HTTP_CODES.NotFoundError, done, { "error": "An error has occurred", "details": "Not found" });
    });
    it("should return not implemented when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            res.locals.expresshelper.notImplemented();
        });
        expectStatus(this.router, __1.HTTP_CODES.NotImplementedError, done, { "error": "Not implemented" });
    });
    it("should return unauthenticated error when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            res.locals.expresshelper.unauthenticated("should be logged to use this functionality");
        });
        expectStatus(this.router, __1.HTTP_CODES.UnauthorizedError, done, { "error": "Unauthenticated", "details": "should be logged to use this functionality" });
    });
    it("should return forbidden error when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            res.locals.expresshelper.forbidden("should be logged to use this functionality");
        });
        expectStatus(this.router, __1.HTTP_CODES.ForbiddenError, done, { "error": "Unauthorized", "details": "should be logged to use this functionality" });
    });
    it("should return unauthorized error when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            res.locals.expresshelper.unauthorized("should be logged to use this functionality");
        });
        expectStatus(this.router, __1.HTTP_CODES.ForbiddenError, done, { "error": "Unauthorized", "details": "should be logged to use this functionality" });
    });
    it("should return missing parameter when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            res.locals.expresshelper.missingParameter("id");
        });
        expectStatus(this.router, __1.HTTP_CODES.BadRequestError, done, { "error": "Missing parameter", "details": "id" });
    });
    it("should work for promises resolving with data when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            const promise = Promise.resolve([]);
            res.locals.expresshelper.promiseWrapper(promise);
        });
        expectStatus(this.router, __1.HTTP_CODES.Ok, done, []);
    });
    it("should work for promises rejecting with error when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            const promise = Promise.reject("error test");
            res.locals.expresshelper.promiseWrapper(promise);
        });
        expectStatus(this.router, __1.HTTP_CODES.InternalServerError, done, { "error": "An error has occurred", "details": "error test" });
    });
    it("should work for functions with values when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            const fn = (fn) => { fn({ id: 1, name: "named" }); };
            setTimeout(() => { fn(res.locals.expresshelper.ok()); }, 0);
        });
        expectStatus(this.router, __1.HTTP_CODES.Ok, done, { "id": 1, "name": "named" });
    });
    it("should work for functions without values, returning a not found error when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            const fn = (fn) => { fn(); };
            setTimeout(() => { fn(res.locals.expresshelper.ok()); }, 0);
        });
        expectStatus(this.router, __1.HTTP_CODES.NotFoundError, done);
    });
    it("should work for ok functions with values when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            const fn = (fn) => { fn({ id: 1, name: "named" }); };
            setTimeout(() => { fn(res.locals.expresshelper.okWithDefaultValue({ "attr": "value" }, __1.HTTP_CODES.Ok)); }, 0);
        });
        expectStatus(this.router, __1.HTTP_CODES.Ok, done, { "attr": "value" });
    });
    it("should work for ok functions with no values when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            const fn = (fn) => { fn({ id: 1, name: "named" }); };
            setTimeout(() => { fn(res.locals.expresshelper.okWithDefaultValue("", __1.HTTP_CODES.CreatedResource)); }, 0);
        });
        expectStatus(this.router, __1.HTTP_CODES.CreatedResource, done, "");
    });
    it("should work for callback functions with success values when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            const cb = (fn) => { fn(null, { id: 1, name: "named" }); };
            setTimeout(() => { cb(res.locals.expresshelper.cb()); }, 0);
        });
        expectStatus(this.router, __1.HTTP_CODES.Ok, done, { "id": 1, "name": "named" });
    });
    it("should work for callback functions with error values when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            const cb = (fn) => { fn({ err: "my error" }); };
            setTimeout(() => { cb(res.locals.expresshelper.cb()); }, 0);
        });
        expectStatus(this.router, __1.HTTP_CODES.InternalError, done, { "err": "my error" });
    });
    it("should work for callback functions with values, returning default value when specified when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            const cb = (fn) => { fn(null, "another value"); };
            setTimeout(() => { cb(res.locals.expresshelper.cbWithDefaultValue("defaultValue")); }, 0);
        });
        expectStatus(this.router, __1.HTTP_CODES.Ok, done, "defaultValue");
    });
    it("should work for callback functions with error values, although a default value was specified when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            const cb = (fn) => { fn("error", "another value"); };
            setTimeout(() => { cb(res.locals.expresshelper.cbWithDefaultValue("defaultValue")); }, 0);
        });
        expectStatus(this.router, __1.HTTP_CODES.InternalError, done, "error");
    });
    it("should work for callback error functions when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            const cb = () => ({ "err": "my error" });
            res.locals.expresshelper.callbackError(cb());
        });
        expectStatus(this.router, __1.HTTP_CODES.InternalError, done, { "error": "An error has occurred", "details": { "err": "my error" } });
    });
    it("should work for error functions with numeric code when asking for /", function (done) {
        const err = { "err": "my error" };
        this.router.get("/", (_req, res) => {
            res.locals.expresshelper.error(__1.HTTP_CODES.ImATeapotError, "My error")(err);
        });
        expectStatus(this.router, __1.HTTP_CODES.ImATeapotError, done, { "error": "My error", "details": err });
    });
    it("should work for error functions with string message when asking for /", function (done) {
        const err = { "err": "my error" };
        this.router.get("/", (_req, res) => {
            res.locals.expresshelper.error("My error")(err);
        });
        expectStatus(this.router, __1.HTTP_CODES.InternalError, done, { "error": "My error", "details": err });
    });
});
//# sourceMappingURL=usage.spec.js.map