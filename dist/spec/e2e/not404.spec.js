"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const request = require("supertest");
const __1 = require("../../");
function expectStatus(router, code, done, content) {
    request(router).get("/").expect((res) => {
        expect(res.status).toBe(code);
        if (typeof content !== "undefined") {
            expect(res.body).toEqual(content);
        }
        done();
    }).end(() => { });
}
describe("Should work as expected (shouldSend404onEmpty: false)", () => {
    beforeEach(function () {
        this.router = express();
        this.router.use((0, __1.expresshelper)({
            enableJSONP: false,
            shouldSend404onEmpty: false
        }));
    });
    it("should NOT return not found when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            res.locals.expresshelper.ok()("");
        });
        expectStatus(this.router, __1.HTTP_CODES.Ok, done, "");
    });
});
describe("Should work as expected for default values", () => {
    beforeEach(function () {
        this.router = express();
        this.router.use((0, __1.expresshelper)());
    });
    it("should return not found when asking for /", function (done) {
        this.router.get("/", (_req, res) => {
            res.locals.expresshelper.ok()("");
        });
        expectStatus(this.router, __1.HTTP_CODES.NotFoundError, done);
    });
});
//# sourceMappingURL=not404.spec.js.map