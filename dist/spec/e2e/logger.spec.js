"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const request = require("supertest");
const __1 = require("../../");
describe("Should work as expected (logger.trace)", () => {
    it("should logger.trace with notFound work as expected when asking for /", function (done) {
        this.router = express();
        this.router.use((0, __1.expresshelper)({
            logger: {
                trace: (...message) => {
                    expect(message).toEqual(["\"Not found\""]);
                    done();
                }
            }
        }));
        this.router.get("/", (_req, res) => {
            res.locals.expresshelper.notFound();
        });
        request(this.router).get("/").end(() => { });
    });
    it("should logger.trace with callbackError work as expected when asking for /", function (done) {
        this.router = express();
        this.router.use((0, __1.expresshelper)({
            logger: {
                trace: (...message) => {
                    expect(message).toEqual(["\"myerror\""]);
                    done();
                }
            }
        }));
        this.router.get("/", (_req, res) => {
            res.locals.expresshelper.callbackError("myerror");
        });
        request(this.router).get("/").end(() => { });
    });
    it("should logger.trace with cb work as expected when asking for /", function (done) {
        this.router = express();
        this.router.use((0, __1.expresshelper)({
            logger: {
                trace: (...message) => {
                    expect(message).toEqual(["\"myerror\""]);
                    done();
                }
            }
        }));
        this.router.get("/", (_req, res) => {
            res.locals.expresshelper.cb()("myerror");
        });
        request(this.router).get("/").end(() => { });
    });
    it("should logger.trace with cbWithDefaultValue work as expected when asking for /", function (done) {
        this.router = express();
        this.router.use((0, __1.expresshelper)({
            logger: {
                trace: (...message) => {
                    expect(message).toEqual(["\"myerror\""]);
                    done();
                }
            }
        }));
        this.router.get("/", (_req, res) => {
            res.locals.expresshelper.cbWithDefaultValue("default value")("myerror");
        });
        request(this.router).get("/").end(() => { });
    });
    it("should logger.trace with error work as expected when asking for /", function (done) {
        this.router = express();
        this.router.use((0, __1.expresshelper)({
            logger: {
                trace: (...message) => {
                    expect(message).toEqual(["\"myerror\""]);
                    done();
                }
            }
        }));
        this.router.get("/", (_req, res) => {
            res.locals.expresshelper.error("error message")("myerror");
        });
        request(this.router).get("/").end(() => { });
    });
});
//# sourceMappingURL=logger.spec.js.map