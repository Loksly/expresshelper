"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var request = require("supertest");
var __1 = require("../../");
describe("Should work as expected (jsonp)", function () {
    beforeEach(function () {
        this.router = express();
        this.router.use(__1.expresshelper({
            enableJSONP: true
        }));
    });
    it("should jsonp work as expected when asking for /", function (done) {
        var content = "this is an jsonp enabled content";
        this.router.get("/", function (_req, res) {
            res.locals.expresshelper.ok()(content);
        });
        request(this.router).get("/").expect(function (res) {
            expect(res.body).toEqual(content);
            done();
        }).end(function () { });
    });
    it("should jsonp work as expected when asking for /", function (done) {
        var content = "this is an jsonp enabled content";
        this.router.get("/", function (_req, res) {
            res.locals.expresshelper.ok()(content);
        });
        request(this.router).get("/").query({ "callback": "cb" }).expect(function (res) {
            expect(res.text).toEqual("/**/ typeof cb === 'function' && cb(\"" + content + "\");");
            done();
        }).end(function () { });
    });
});
//# sourceMappingURL=jsonp.spec.js.map