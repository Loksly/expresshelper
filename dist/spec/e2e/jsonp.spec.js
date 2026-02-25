"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const request = require("supertest");
const __1 = require("../../");
describe("Should work as expected (jsonp)", () => {
    beforeEach(function () {
        this.router = express();
        this.router.use((0, __1.expresshelper)({
            enableJSONP: true
        }));
    });
    it("should jsonp work as expected without callback param when asking for /", function (done) {
        const content = "this is an jsonp enabled content";
        this.router.get("/", (_req, res) => {
            res.locals.expresshelper.ok()(content);
        });
        request(this.router).get("/").expect((res) => {
            expect(res.body).toEqual(content);
            done();
        }).end(() => { });
    });
    it("should jsonp work as expected with callback param when asking for /", function (done) {
        const content = "this is an jsonp enabled content";
        this.router.get("/", (_req, res) => {
            res.locals.expresshelper.ok()(content);
        });
        request(this.router).get("/").query({ "callback": "cb" }).expect((res) => {
            expect(res.text).toEqual("/**/ typeof cb === 'function' && cb(\"" + content + "\");");
            done();
        }).end(() => { });
    });
});
//# sourceMappingURL=jsonp.spec.js.map