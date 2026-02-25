import express = require('express');
import request = require("supertest");

import { Application, Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../";

describe("asyncHandler", () => {

    it("should forward rejected promise errors to next", function (done) {
        const app: Application = express();
        const expectedError = new Error("async route error");

        app.get("/", asyncHandler(async (_req: Request, _res: Response) => {
            throw expectedError;
        }));

        // Error handler
        app.use((_err: unknown, _req: Request, res: Response, _next: NextFunction) => {
            res.status(500).json({ caught: true });
        });

        request(app).get("/").expect((res) => {
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ caught: true });
            done();
        }).end(() => {});
    });

    it("should not interfere when the handler resolves successfully", function (done) {
        const app: Application = express();

        app.get("/", asyncHandler(async (_req: Request, res: Response) => {
            res.json({ ok: true });
        }));

        request(app).get("/").expect((res) => {
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ ok: true });
            done();
        }).end(() => {});
    });

    it("should forward a promise rejection (non-Error value) to next", function (done) {
        const app: Application = express();

        app.get("/", asyncHandler((_req: Request, _res: Response) => {
            return Promise.reject("string-rejection");
        }));

        app.use((_err: unknown, _req: Request, res: Response, _next: NextFunction) => {
            res.status(500).json({ caught: true });
        });

        request(app).get("/").expect((res) => {
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ caught: true });
            done();
        }).end(() => {});
    });
});
