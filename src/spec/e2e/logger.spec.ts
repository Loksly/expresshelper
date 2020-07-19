import express = require('express');
import request = require("supertest");

import { Application, Request } from "express";
import { expresshelper, ResponseHelper } from "../../";

describe("Should work as expected (logger.trace)", () => {
    it("should logger.trace work as expected when asking for /", function (this: { router: Application }, done) {
        this.router = express();
        this.router.use(expresshelper({
            logger: {
                trace: (...message: string[]) => {
                    expect(message).toEqual(["Not found"]);
                    done();
                }
            }
        }));
        this.router.get("/", (_req: Request, res: ResponseHelper) => {
            res.locals.expresshelper.notFound();
        });
        request(this.router).get("/").expect(() => {}).end();
    });
});
