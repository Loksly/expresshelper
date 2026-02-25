"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var request = require("supertest");
var __1 = require("../../");
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
describe("presetMinimal", function () {
    it("should attach expresshelper to res.locals", function (done) {
        var app = express();
        app.use(__1.presetMinimal());
        app.get("/", function (_req, res) {
            res.json({ hasHelper: typeof res.locals.expresshelper !== "undefined" });
        });
        request(app).get("/").expect(function (res) {
            expect(res.status).toBe(200);
            expect(res.body.hasHelper).toBe(true);
            done();
        }).end(function () { });
    });
    it("should attach requestId to res.locals by default", function (done) {
        var app = express();
        app.use(__1.presetMinimal());
        app.get("/", function (_req, res) {
            res.json({ requestId: res.locals.requestId });
        });
        request(app).get("/").expect(function (res) {
            expect(res.status).toBe(200);
            expect(UUID_RE.test(res.body.requestId)).toBe(true);
            done();
        }).end(function () { });
    });
    it("should skip requestId middleware when requestId option is false", function (done) {
        var app = express();
        app.use(__1.presetMinimal({ requestId: false }));
        app.get("/", function (_req, res) {
            res.json({
                hasHelper: typeof res.locals.expresshelper !== "undefined",
                hasRequestId: typeof res.locals.requestId !== "undefined",
            });
        });
        request(app).get("/").expect(function (res) {
            expect(res.status).toBe(200);
            expect(res.body.hasHelper).toBe(true);
            expect(res.body.hasRequestId).toBe(false);
            done();
        }).end(function () { });
    });
    it("should not install a global error handler", function (done) {
        var app = express();
        app.use(__1.presetMinimal());
        app.get("/", function (_req, _res, next) {
            next(new Error("unhandled"));
        });
        app.use(function (_err, _req, res, _next) {
            res.status(500).json({ handledByApp: true });
        });
        request(app).get("/").expect(function (res) {
            expect(res.status).toBe(500);
            expect(res.body.handledByApp).toBe(true);
            done();
        }).end(function () { });
    });
    it("should accept custom expresshelper options", function (done) {
        var app = express();
        app.use(__1.presetMinimal({ expresshelper: { shouldSend404onEmpty: false } }));
        app.get("/", function (_req, res) {
            res.locals.expresshelper.ok()("");
        });
        request(app).get("/").expect(function (res) {
            expect(res.status).toBe(200);
            done();
        }).end(function () { });
    });
    it("should return an array of RequestHandlers", function () {
        var handlers = __1.presetMinimal();
        expect(Array.isArray(handlers)).toBe(true);
        expect(handlers.length).toBe(2);
    });
    it("should return array with one handler when requestId is disabled", function () {
        var handlers = __1.presetMinimal({ requestId: false });
        expect(Array.isArray(handlers)).toBe(true);
        expect(handlers.length).toBe(1);
    });
});
//# sourceMappingURL=presetMinimal.spec.js.map