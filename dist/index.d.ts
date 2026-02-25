import { RequestHandler, Response } from "express";
import { ExpressHelper, ExpressHelperOptions } from "./lib/helper";
export * from "./lib/codes";
export * from "./lib/helper";
export interface ResponseHelper extends Response {
    locals: {
        expresshelper: ExpressHelper;
    } & Record<string, any>;
}
export declare function expresshelper(options?: ExpressHelperOptions): RequestHandler;
//# sourceMappingURL=index.d.ts.map