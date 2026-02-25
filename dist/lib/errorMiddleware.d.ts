import { Request, Response, NextFunction } from "express";
export interface ErrorMiddlewareOptions {
    format?: "json" | "problem+json";
    includeStack?: boolean;
}
declare type ErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => void;
export declare function errorMiddleware(options?: ErrorMiddlewareOptions): ErrorHandler;
export {};
//# sourceMappingURL=errorMiddleware.d.ts.map