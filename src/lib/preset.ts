import { Request, Response, NextFunction, RequestHandler } from "express";
import { ExpressHelper, ExpressHelperOptions } from "./helper";
import { requestIdMiddleware, RequestIdOptions } from "./requestId";

export interface PresetMinimalOptions {
    expresshelper?: ExpressHelperOptions;
    requestId?: RequestIdOptions | false;
}

export function presetMinimal(options?: PresetMinimalOptions): RequestHandler[] {
    const middlewares: RequestHandler[] = [];

    if (!options || options.requestId !== false) {
        const reqIdOpts = (options && options.requestId)
            ? options.requestId as RequestIdOptions
            : undefined;
        middlewares.push(requestIdMiddleware(reqIdOpts));
    }

    const helperOpts: ExpressHelperOptions = (options && options.expresshelper)
        ? options.expresshelper
        : {};

    middlewares.push(function (_req: Request, res: Response, next: NextFunction): void {
        res.locals.expresshelper = new ExpressHelper(res, helperOpts);
        next();
    });

    return middlewares;
}
