export class HttpError extends Error {
    public readonly status: number;
    public readonly code: string;
    public readonly details?: unknown;

    constructor(status: number, code: string, message: string, details?: unknown) {
        super(message);
        this.name = "HttpError";
        this.status = status;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export function badRequest(message = "Bad Request", details?: unknown): HttpError {
    return new HttpError(400, "BAD_REQUEST", message, details);
}

export function unauthorized(message = "Unauthorized", details?: unknown): HttpError {
    return new HttpError(401, "UNAUTHORIZED", message, details);
}

export function forbidden(message = "Forbidden", details?: unknown): HttpError {
    return new HttpError(403, "FORBIDDEN", message, details);
}

export function notFound(message = "Not Found", details?: unknown): HttpError {
    return new HttpError(404, "NOT_FOUND", message, details);
}

export function conflict(message = "Conflict", details?: unknown): HttpError {
    return new HttpError(409, "CONFLICT", message, details);
}

export function unprocessableEntity(message = "Unprocessable Entity", details?: unknown): HttpError {
    return new HttpError(422, "UNPROCESSABLE_ENTITY", message, details);
}
