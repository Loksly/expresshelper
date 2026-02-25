import express = require('express');
import request = require("supertest");

import { Application, Response } from "express";
import { presetMinimal } from "../../";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe("presetMinimal", () => {

    it("should attach expresshelper to res.locals", function (done) {
        const app: Application = express();
        app.use(presetMinimal());
        app.get("/", (_req, res: Response) => {
            res.json({ hasHelper: typeof res.locals.expresshelper !== "undefined" });
        });

        request(app).get("/").expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.hasHelper).toBe(true);
            done();
        }).end(() => {});
    });

    it("should attach requestId to res.locals by default", function (done) {
        const app: Application = express();
        app.use(presetMinimal());
        app.get("/", (_req, res: Response) => {
            res.json({ requestId: res.locals.requestId });
        });

        request(app).get("/").expect((res) => {
            expect(res.status).toBe(200);
            expect(UUID_RE.test(res.body.requestId)).toBe(true);
            done();
        }).end(() => {});
    });

    it("should skip requestId middleware when requestId option is false", function (done) {
        const app: Application = express();
        app.use(presetMinimal({ requestId: false }));
        app.get("/", (_req, res: Response) => {
            res.json({
                hasHelper: typeof res.locals.expresshelper !== "undefined",
                hasRequestId: typeof res.locals.requestId !== "undefined",
            });
        });

        request(app).get("/").expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.hasHelper).toBe(true);
            expect(res.body.hasRequestId).toBe(false);
            done();
        }).end(() => {});
    });

    it("should not install a global error handler", function (done) {
        const app: Application = express();
        app.use(presetMinimal());

        // Throw an error — if presetMinimal had installed an error handler it would respond
        app.get("/", (_req, _res, next) => {
            next(new Error("unhandled"));
        });

        // Our own error handler
        app.use((_err: unknown, _req: unknown, res: Response, _next: unknown) => {
            res.status(500).json({ handledByApp: true });
        });

        request(app).get("/").expect((res) => {
            expect(res.status).toBe(500);
            expect(res.body.handledByApp).toBe(true);
            done();
        }).end(() => {});
    });

    it("should accept custom expresshelper options", function (done) {
        const app: Application = express();
        app.use(presetMinimal({ expresshelper: { shouldSend404onEmpty: false } }));
        app.get("/", (_req, res: Response) => {
            res.locals.expresshelper!.ok()("");
        });

        request(app).get("/").expect((res) => {
            // shouldSend404onEmpty:false => empty string returns 200
            expect(res.status).toBe(200);
            done();
        }).end(() => {});
    });

    it("should return an array of RequestHandlers", function () {
        const handlers = presetMinimal();
        expect(Array.isArray(handlers)).toBe(true);
        expect(handlers.length).toBe(2);
    });

    it("should return array with one handler when requestId is disabled", function () {
        const handlers = presetMinimal({ requestId: false });
        expect(Array.isArray(handlers)).toBe(true);
        expect(handlers.length).toBe(1);
    });
});
