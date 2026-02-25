import express = require('express');
import request = require("supertest");

import { Application, Request, Response } from "express";
import { expresshelper } from "../../";

describe("Should work as expected (jsonp)", () => {

    beforeEach(function (this: { router: Application }) {
        this.router = express();
        this.router.use(expresshelper({
            enableJSONP: true
        }));
    });

    it("should jsonp work as expected without callback param when asking for /", function (this: { router: Application }, done) {
        const content = "this is an jsonp enabled content";
        this.router.get("/", (_req: Request, res: Response) => {
            res.locals.expresshelper!.ok()(content);
        });

        request(this.router).get("/").expect((res) => {
            expect(res.body).toEqual(content);
            done();
        }).end(() => {});
    });

    it("should jsonp work as expected with callback param when asking for /", function (this: { router: Application }, done) {
        const content = "this is an jsonp enabled content";
        this.router.get("/", (_req: Request, res: Response) => {
            res.locals.expresshelper!.ok()(content);
        });

        request(this.router).get("/").query({"callback": "cb"}).expect((res: request.Response) => {
            expect(res.text).toEqual("/**/ typeof cb === 'function' && cb(\"" + content + "\");");
            done();
        }).end(() => {});
    });
});
