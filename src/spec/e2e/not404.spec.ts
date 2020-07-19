import express = require('express');
import request = require("supertest");

import { Application, Response, Request } from "express";
import { expresshelper, HTTP_CODES } from "../../";

function expectStatus(router: Application, code: number, done: Function, content?: any) {
    request(router).get("/").expect((res) => {
        expect(res.status).toBe(code);
        if (typeof content !== "undefined") {
            expect(res.body).toEqual(content);
        }
        done();
    }).end((err) => {
        if (err) throw err;
    });
}

describe("Should work as expected", () => {
    beforeEach(function (this: { router: Application }) {
        this.router = express();
        this.router.use(expresshelper({
            enableJSONP: false,
            shouldSend404onEmpty: false
        }));
    });

    it("should NOT return not found when asking for /", function (this: { router: Application }, done) {
        this.router.get("/", (_req: Request, res: Response) => {
            res.locals.expresshelper.ok()();
        });
        expectStatus(this.router, HTTP_CODES.Ok, done, "");
    });
});
