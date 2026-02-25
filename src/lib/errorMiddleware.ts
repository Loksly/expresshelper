import { Request, Response, NextFunction } from "express";
import { HttpError } from "./httpError";

export interface ErrorMiddlewareOptions {
    format?: "json" | "problem+json";
    includeStack?: boolean;
}

type ErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => void;

export function errorMiddleware(options?: ErrorMiddlewareOptions): ErrorHandler {
    const format = (options && options.format) ? options.format : "json";
    const includeStack = options ? options.includeStack === true : false;

    return (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
        const status = (err instanceof HttpError) ? err.status : 500;
        const code = (err instanceof HttpError) ? err.code : "INTERNAL_SERVER_ERROR";
        const message = (err instanceof Error) ? err.message : "Internal Server Error";
        const details = (err instanceof HttpError) ? err.details : undefined;
        const stack = (includeStack && err instanceof Error) ? err.stack : undefined;

        if (format === "problem+json") {
            const body: Record<string, unknown> = {
                type: "https://httpstatuses.com/" + status,
                title: message,
                status,
                code,
            };
            if (details !== undefined) { body.detail = String(details); }
            if (stack !== undefined) { body.trace = stack; }
            res.status(status).set("Content-Type", "application/problem+json").json(body);
        } else {
            const body: Record<string, unknown> = {
                error: message,
                code,
            };
            if (details !== undefined) { body.details = details; }
            if (stack !== undefined) { body.stack = stack; }
            res.status(status).json(body);
        }
    };
}
