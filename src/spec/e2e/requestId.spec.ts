import express = require('express');
import request = require("supertest");

import { Application, Response } from "express";
import { requestIdMiddleware } from "../../";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe("requestIdMiddleware", () => {

    it("should generate an id when no x-request-id header is present", function (done) {
        const app: Application = express();
        app.use(requestIdMiddleware());
        app.get("/", (_req, res: Response) => {
            res.json({ requestId: res.locals.requestId });
        });

        request(app).get("/").expect((res) => {
            expect(res.status).toBe(200);
            expect(UUID_RE.test(res.body.requestId)).toBe(true);
            expect(res.header["x-request-id"]).toBeDefined();
            done();
        }).end(() => {});
    });

    it("should pass through an existing x-request-id header", function (done) {
        const app: Application = express();
        app.use(requestIdMiddleware());
        app.get("/", (_req, res: Response) => {
            res.json({ requestId: res.locals.requestId });
        });

        const existingId = "my-custom-request-id";
        request(app).get("/").set("x-request-id", existingId).expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.requestId).toBe(existingId);
            expect(res.header["x-request-id"]).toBe(existingId);
            done();
        }).end(() => {});
    });

    it("should use a custom header when specified", function (done) {
        const app: Application = express();
        app.use(requestIdMiddleware({ header: "x-correlation-id" }));
        app.get("/", (_req, res: Response) => {
            res.json({ requestId: res.locals.requestId });
        });

        const existingId = "correlation-123";
        request(app).get("/").set("x-correlation-id", existingId).expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body.requestId).toBe(existingId);
            expect(res.header["x-correlation-id"]).toBe(existingId);
            done();
        }).end(() => {});
    });

    it("should generate a new id for each request", function (done) {
        const app: Application = express();
        app.use(requestIdMiddleware());
        app.get("/", (_req, res: Response) => {
            res.json({ requestId: res.locals.requestId });
        });

        const ids: string[] = [];
        let completed = 0;

        function onDone() {
            completed++;
            if (completed === 2) {
                expect(ids[0]).not.toBe(ids[1]);
                done();
            }
        }

        request(app).get("/").expect((res) => {
            ids.push(res.body.requestId);
            onDone();
        }).end(() => {});

        request(app).get("/").expect((res) => {
            ids.push(res.body.requestId);
            onDone();
        }).end(() => {});
    });
});
