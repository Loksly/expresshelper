"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var request = require("supertest");
var __1 = require("../../");
function expectStatus(router, code, done, content) {
    request(router).get("/").expect(function (res) {
        expect(res.status).toBe(code);
        if (typeof content !== "undefined") {
            expect(res.body).toEqual(content);
        }
        done();
    }).end(function (err) {
        if (err)
            throw err;
    });
}
describe("Should work as expected", function () {
    beforeEach(function () {
        this.router = express();
        this.router.use(__1.expresshelper({
            enableJSONP: false,
            shouldSend404onEmpty: false
        }));
    });
    it("should NOT return not found when asking for /", function (done) {
        this.router.get("/", function (_req, res) {
            res.locals.expresshelper.ok()("");
        });
        expectStatus(this.router, __1.HTTP_CODES.Ok, done, "");
    });
});
//# sourceMappingURL=not404.spec.js.map