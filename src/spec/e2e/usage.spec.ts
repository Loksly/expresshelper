import express = require('express');
import request = require("supertest");

import { Application, Request } from "express";
import { expresshelper, HTTP_CODES, ResponseHelper } from "../../";

function expectStatus(router: Application, code: number, done: Function, content?: any) {
    request(router).get("/").expect((res) => {
        expect(res.status).toBe(code);
        if (content) {
            expect(res.body).toEqual(content);
        }
        done();
    }).end(() => {});
}

describe("Should work as expected", () => {

    beforeEach(function (this: { router: Application }) {
        this.router = express();
        this.router.use(expresshelper({
            enableJSONP: false,
            shouldSend404onEmpty: true
        }));
    });

    it("should return not found when asking for /", function (this: { router: Application }, done) {
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            res.locals.expresshelper.notFound();
        });
        expectStatus(this.router, HTTP_CODES.NotFoundError, done, { "error": "An error has occurred", "details": "Not found" });
    });

    it("should return not implemented when asking for /", function (this: { router: Application }, done) {
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            res.locals.expresshelper.notImplemented();
        });
        expectStatus(this.router, HTTP_CODES.NotImplementedError, done, { "error": "Not implemented" });
    });

    it("should return unauthenticated error when asking for /", function (this: { router: Application }, done) {
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            res.locals.expresshelper.unauthenticated("should be logged to use this functionality");
        });
        expectStatus(this.router, HTTP_CODES.UnauthorizedError, done, { "error": "Unauthenticated", "details": "should be logged to use this functionality" });
    });

    it("should return forbidden error when asking for /", function (this: { router: Application }, done) {
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            res.locals.expresshelper.forbidden("should be logged to use this functionality");
        });
        expectStatus(this.router, HTTP_CODES.ForbiddenError, done, { "error": "Unauthorized", "details": "should be logged to use this functionality" });
    });

    it("should return unauthorized error when asking for /", function (this: { router: Application }, done) {
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            res.locals.expresshelper.unauthorized("should be logged to use this functionality");
        });
        expectStatus(this.router, HTTP_CODES.ForbiddenError, done, { "error": "Unauthorized", "details": "should be logged to use this functionality" });
    });

    it("should return missing parameter when asking for /", function (this: { router: Application }, done) {
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            res.locals.expresshelper.missingParameter("id");
        });
        expectStatus(this.router, HTTP_CODES.BadRequestError, done, { "error": "Missing parameter", "details": "id" });
    });

    it("should work for promises when asking for /", function (this: { router: Application }, done) {
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            const promise = Promise.resolve([]);

            res.locals.expresshelper.promiseWrapper(promise);
        });
        expectStatus(this.router, HTTP_CODES.Ok, done, []);
    });

    it("should work for promises when asking for /", function (this: { router: Application }, done) {
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            const promise = Promise.reject("error test");

            res.locals.expresshelper.promiseWrapper(promise);
        });
        expectStatus(this.router, HTTP_CODES.InternalServerError, done, { "error": "An error has occurred", "details": "error test" });
    });

    it("should work for functions with values when asking for /", function (this: { router: Application }, done) {
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            const fn = (fn: Function) => { fn({id: 1, name: "named"}); }; /* pretend a function */
            setTimeout(() => { fn(res.locals.expresshelper.ok()); }, 0);
        });
        expectStatus(this.router, HTTP_CODES.Ok, done, { "id": 1, "name": "named" });
    });

    it("should work for functions without values, returning a not found error when asking for /", function (this: { router: Application }, done) {
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            const fn = (fn: Function) => { fn(); }; /* pretend a callback function with no error but with empty value */
            setTimeout(() => { fn(res.locals.expresshelper.ok()); }, 0);
        });
        expectStatus(this.router, HTTP_CODES.NotFoundError, done);
    });

    it("should work for ok functions with values when asking for /", function (this: { router: Application }, done) {
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            const fn = (fn: Function) => { fn({id: 1, name: "named"}); }; /* pretend a function */
            setTimeout(() => { fn(res.locals.expresshelper.okWithDefaultValue({"attr": "value"}, HTTP_CODES.Ok)); }, 0);
        });
        expectStatus(this.router, HTTP_CODES.Ok, done, { "attr": "value" });
    });

    it("should work for ok functions with no values when asking for /", function (this: { router: Application }, done) {
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            const fn = (fn: Function) => { fn({id: 1, name: "named"}); }; /* pretend a function */
            setTimeout(() => { fn(res.locals.expresshelper.okWithDefaultValue("", HTTP_CODES.CreatedResource)); }, 0);
        });
        expectStatus(this.router, HTTP_CODES.CreatedResource, done, "");
    });

    it("should work for callback functions with values when asking for /", function (this: { router: Application }, done) {
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            const cb = (fn: Function) => { fn(null, {id: 1, name: "named"}); }; /* pretend a callback function with (err, value) signature */
            setTimeout(() => { cb(res.locals.expresshelper.cb()); }, 0);
        });
        expectStatus(this.router, HTTP_CODES.Ok, done, { "id": 1, "name": "named" });
    });

    it("should work for callback functions with values when asking for /", function (this: { router: Application }, done) {
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            const cb = (fn: Function) => { fn({err: "my error"}); }; /* pretend an errored callback function with (err, value) signature */
            setTimeout(() => { cb(res.locals.expresshelper.cb()); }, 0);
        });
        expectStatus(this.router, HTTP_CODES.InternalError, done, { "err": "my error" });
    });

    it("should work for callback functions with values, returning default value when specified when asking for /", function (this: { router: Application }, done) {
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            const cb = (fn: Function) => { fn(null, "another value"); }; /* pretend an errored callback function with (err, value) signature */
            setTimeout(() => { cb(res.locals.expresshelper.cbWithDefaultValue("defaultValue")); }, 0);
        });
        expectStatus(this.router, HTTP_CODES.Ok, done, "defaultValue");
    });

    it("should work for callback functions with error values, although a default value was specified when asking for /", function (this: { router: Application }, done) {
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            const cb = (fn: Function) => { fn("error", "another value"); }; /* pretend an errored callback function with (err, value) signature */
            setTimeout(() => { cb(res.locals.expresshelper.cbWithDefaultValue("defaultValue")); }, 0);
        });
        expectStatus(this.router, HTTP_CODES.InternalError, done, "error");
    });

    it("should work for callback error functions when asking for /", function (this: { router: Application }, done) {
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            const cb = () => ({ "err": "my error"}); /* pretend an errored callback function with (err, value) signature */
            res.locals.expresshelper.callbackError(cb());
        });
        expectStatus(this.router, HTTP_CODES.InternalError, done, {"error": "An error has occurred", "details": { "err": "my error"}});
    });

    it("should work for error functions when asking for /", function (this: { router: Application }, done) {
        const err = { "err": "my error"};
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            res.locals.expresshelper.error(HTTP_CODES.ImATeapotError, "My error")(err);
        });
        expectStatus(this.router, HTTP_CODES.ImATeapotError, done, {"error": "My error", "details": err});
    });

    it("should work for error functions when asking for /", function (this: { router: Application }, done) {
        const err = { "err": "my error"};
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            res.locals.expresshelper.error("My error")(err);
        });
        expectStatus(this.router, HTTP_CODES.InternalError, done, {"error": "My error", "details": err});
    });
});
