"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var request = require("supertest");
var __1 = require("../../");
describe("Should work as expected (logger.trace)", function () {
    it("should logger.trace work as expected when asking for /", function (done) {
        this.router = express();
        this.router.use(__1.expresshelper({
            logger: {
                trace: function () {
                    var message = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        message[_i] = arguments[_i];
                    }
                    expect(message).toEqual(["Not found"]);
                    done();
                }
            }
        }));
        this.router.get("/", function (_req, res) {
            res.locals.expresshelper.notFound();
        });
        request(this.router).get("/").expect(function () { }).end();
    });
});
//# sourceMappingURL=logger.spec.js.map