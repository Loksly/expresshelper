"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var request = require("supertest");
var __1 = require("../../");
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
describe("requestIdMiddleware", function () {
    it("should generate an id when no x-request-id header is present", function (done) {
        var app = express();
        app.use(__1.requestIdMiddleware());
        app.get("/", function (_req, res) {
            res.json({ requestId: res.locals.requestId });
        });
        request(app).get("/").expect(function (res) {
            expect(res.status).toBe(200);
            expect(UUID_RE.test(res.body.requestId)).toBe(true);
            expect(res.header["x-request-id"]).toBeDefined();
            done();
        }).end(function () { });
    });
    it("should pass through an existing x-request-id header", function (done) {
        var app = express();
        app.use(__1.requestIdMiddleware());
        app.get("/", function (_req, res) {
            res.json({ requestId: res.locals.requestId });
        });
        var existingId = "my-custom-request-id";
        request(app).get("/").set("x-request-id", existingId).expect(function (res) {
            expect(res.status).toBe(200);
            expect(res.body.requestId).toBe(existingId);
            expect(res.header["x-request-id"]).toBe(existingId);
            done();
        }).end(function () { });
    });
    it("should use a custom header when specified", function (done) {
        var app = express();
        app.use(__1.requestIdMiddleware({ header: "x-correlation-id" }));
        app.get("/", function (_req, res) {
            res.json({ requestId: res.locals.requestId });
        });
        var existingId = "correlation-123";
        request(app).get("/").set("x-correlation-id", existingId).expect(function (res) {
            expect(res.status).toBe(200);
            expect(res.body.requestId).toBe(existingId);
            expect(res.header["x-correlation-id"]).toBe(existingId);
            done();
        }).end(function () { });
    });
    it("should generate a new id for each request", function (done) {
        var app = express();
        app.use(__1.requestIdMiddleware());
        app.get("/", function (_req, res) {
            res.json({ requestId: res.locals.requestId });
        });
        var ids = [];
        var completed = 0;
        function onDone() {
            completed++;
            if (completed === 2) {
                expect(ids[0]).not.toBe(ids[1]);
                done();
            }
        }
        request(app).get("/").expect(function (res) {
            ids.push(res.body.requestId);
            onDone();
        }).end(function () { });
        request(app).get("/").expect(function (res) {
            ids.push(res.body.requestId);
            onDone();
        }).end(function () { });
    });
});
//# sourceMappingURL=requestId.spec.js.map