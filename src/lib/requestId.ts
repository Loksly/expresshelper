import * as crypto from "crypto";
import { Request, Response, NextFunction, RequestHandler } from "express";

export interface RequestIdOptions {
    header?: string;
}

function generateId(): string {
    const bytes = crypto.randomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    return [
        bytes.slice(0, 4).toString("hex"),
        bytes.slice(4, 6).toString("hex"),
        bytes.slice(6, 8).toString("hex"),
        bytes.slice(8, 10).toString("hex"),
        bytes.slice(10).toString("hex"),
    ].join("-");
}

export function requestIdMiddleware(options?: RequestIdOptions): RequestHandler {
    const header = (options && options.header) ? options.header : "x-request-id";
    return (req: Request, res: Response, next: NextFunction): void => {
        const existing = req.headers[header];
        const requestId = (typeof existing === "string" && existing.length > 0)
            ? existing
            : generateId();
        res.locals.requestId = requestId;
        res.setHeader(header, requestId);
        next();
    };
}
