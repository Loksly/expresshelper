export declare class HttpError extends Error {
    readonly status: number;
    readonly code: string;
    readonly details?: unknown;
    constructor(status: number, code: string, message: string, details?: unknown);
}
export declare function badRequest(message?: string, details?: unknown): HttpError;
export declare function unauthorized(message?: string, details?: unknown): HttpError;
export declare function forbidden(message?: string, details?: unknown): HttpError;
export declare function notFound(message?: string, details?: unknown): HttpError;
export declare function conflict(message?: string, details?: unknown): HttpError;
export declare function unprocessableEntity(message?: string, details?: unknown): HttpError;
//# sourceMappingURL=httpError.d.ts.map