import express = require('express');
import request = require("supertest");

import { Application, Request, Response } from "express";
import { expresshelper } from "../../";

describe("Should work as expected (logger.trace)", () => {
    it("should logger.trace with notFound work as expected when asking for /", function (this: { router: Application }, done) {
        this.router = express();
        this.router.use(expresshelper({
            logger: {
                trace: (...message: string[]) => {
                    expect(message).toEqual(["\"Not found\""]);
                    done();
                }
            }
        }));
        this.router.get("/", (_req: Request, res: Response) => {
            res.locals.expresshelper!.notFound();
        });
        request(this.router).get("/").end(() => {});
    });

    it("should logger.trace with callbackError work as expected when asking for /", function (this: { router: Application }, done) {
        this.router = express();
        this.router.use(expresshelper({
            logger: {
                trace: (...message: string[]) => {
                    expect(message).toEqual(["\"myerror\""]);
                    done();
                }
            }
        }));
        this.router.get("/", (_req: Request, res: Response) => {
            res.locals.expresshelper!.callbackError("myerror");
        });
        request(this.router).get("/").end(() => {});
    });

    it("should logger.trace with cb work as expected when asking for /", function (this: { router: Application }, done) {
        this.router = express();
        this.router.use(expresshelper({
            logger: {
                trace: (...message: string[]) => {
                    expect(message).toEqual(["\"myerror\""]);
                    done();
                }
            }
        }));
        this.router.get("/", (_req: Request, res: Response) => {
            res.locals.expresshelper!.cb()("myerror");
        });
        request(this.router).get("/").end(() => {});
    });

    it("should logger.trace with cbWithDefaultValue work as expected when asking for /", function (this: { router: Application }, done) {
        this.router = express();
        this.router.use(expresshelper({
            logger: {
                trace: (...message: string[]) => {
                    expect(message).toEqual(["\"myerror\""]);
                    done();
                }
            }
        }));
        this.router.get("/", (_req: Request, res: Response) => {
            res.locals.expresshelper!.cbWithDefaultValue("default value")("myerror");
        });
        request(this.router).get("/").end(() => {});
    });

    it("should logger.trace with error work as expected when asking for /", function (this: { router: Application }, done) {
        this.router = express();
        this.router.use(expresshelper({
            logger: {
                trace: (...message: string[]) => {
                    expect(message).toEqual(["\"myerror\""]);
                    done();
                }
            }
        }));
        this.router.get("/", (_req: Request, res: Response) => {
            res.locals.expresshelper!.error("error message")("myerror");
        });
        request(this.router).get("/").end(() => {});
    });
});
