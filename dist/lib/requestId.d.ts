import { RequestHandler } from "express";
export interface RequestIdOptions {
    header?: string;
}
export declare function requestIdMiddleware(options?: RequestIdOptions): RequestHandler;
//# sourceMappingURL=requestId.d.ts.map