import { RequestHandler, NextFunction, Request, Response } from "express";
import { ExpressHelper, ExpressHelperOptions } from "./lib/helper";

export * from "./lib/codes";
export * from "./lib/helper";

export interface ResponseHelper extends Response {
    locals: {
        expresshelper: ExpressHelper;
    };
};

export function expresshelper(options?: ExpressHelperOptions): RequestHandler {
    return function (_req: Request, res: Response, next: NextFunction) {
        res.locals.expresshelper = new ExpressHelper(res, options ? options : {});

        next();
    }
}
