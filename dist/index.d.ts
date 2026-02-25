import { RequestHandler, Response } from "express";
import { ExpressHelper, ExpressHelperOptions } from "./lib/helper";
export * from "./lib/codes";
export * from "./lib/helper";
export * from "./lib/asyncHandler";
export * from "./lib/httpError";
export * from "./lib/requestId";
export * from "./lib/errorMiddleware";
export * from "./lib/preset";
export interface ResponseHelper extends Response {
    locals: {
        expresshelper: ExpressHelper;
    };
}
export declare function expresshelper(options?: ExpressHelperOptions): RequestHandler;
//# sourceMappingURL=index.d.ts.map