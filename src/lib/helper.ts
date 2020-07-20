import { Response } from "express";
import { HTTP_CODES } from "./codes";

export interface LoggerWithTracer {
    trace: (...message: any[]) => void;
}

export interface ExpressHelperOptions {
    logger?: LoggerWithTracer,
    enableJSONP?: boolean;
    shouldSend404onEmpty?: boolean;
}

export class ExpressHelper {

    constructor(private res: Response,
        private options: ExpressHelperOptions) {
        this.options.enableJSONP = this.options.enableJSONP === true; // default is false
        this.options.shouldSend404onEmpty = typeof this.options.shouldSend404onEmpty === "boolean" ? this.options.shouldSend404onEmpty : true; // default is true
    }

    public promiseWrapper(promise: Promise<any>, shouldSend404onEmpty?: boolean): void {
        promise.then(this.ok(shouldSend404onEmpty)).catch(this.error());
    }

    public cbWithDefaultValue(defaultvalue: any): (e: any) => void {

        return (err: any) => {
            if (err) {
                this.send(err, HTTP_CODES.InternalError);
                this.trace(err);
            } else {
                this.send(defaultvalue);
            }
        }
    }

    public cb(): (err: any, value?: any) => void {

        return (err: any, value: any) => {
            if (err) {
                this.send(err, HTTP_CODES.InternalError);
                this.trace(err);
            } else {
                this.send(value);
            }
        }
    }

    public error(errCode?: number | string, defaultMessage?: string): (err: any) => void {

        return (err: any) => {
            let message = "",
                errorCode = HTTP_CODES.InternalServerError;

            if (!defaultMessage && typeof errCode === "string") {
                message = errCode;
            } else if (typeof defaultMessage === "string") {
                message = defaultMessage;
            } else {
                message = "An error has occurred";
            }
            if (typeof errCode === "number") {
                errorCode = errCode;
            }

            this.send({ "error": message, "details": err }, errorCode);
            this.trace(err);
        }
    }

    public send(content: any, statusCode?: number): void {
        if (typeof statusCode === "number") {
            this.res.status(statusCode);
        }
        if (this.options.enableJSONP) {
            this.res.jsonp(content);
        } else {
            this.res.json(content);
        }
    }

    public ok(shouldSend404onEmpty?: boolean): (data: any) => void {

        return (data: any) => {
            if (!data && (shouldSend404onEmpty || this.options.shouldSend404onEmpty)) {
                this.send({ "error": "An error has occurred", "details": "Not found" }, HTTP_CODES.NotFoundError);
            } else {
                this.send(data);
            }
        }
    }

    public okWithDefaultValue(defaultvalue: any, statusCode?: number): (data: any) => void {
        return () => {
            if (typeof statusCode === "number") {
                this.res.status(statusCode);
            }

            if (typeof defaultvalue === "string" && defaultvalue === "") {
                this.res.end();
            } else {
                this.send(defaultvalue);
            }
        }
    }

    public notFound(): void {
        this.send({ "error": "An error has occurred", "details": "Not found" }, HTTP_CODES.NotFoundError);
        this.trace("Not found");
    }

    public unauthenticated(details: any): void {
        this.send({ "error": "Unauthenticated", "details": details }, HTTP_CODES.UnauthorizedError);
    }

    public forbidden(details: any): void {
        this.send({ "error": "Unauthorized", "details": details }, HTTP_CODES.ForbiddenError);
    }

    public unauthorized(details: any): void {
        this.forbidden(details);
    }

    public callbackError(err: any): void {
        this.send({ "error": "An error has occurred", "details": err }, HTTP_CODES.InternalServerError);
        this.trace(err);
    }

    public missingParameter(parametername: string): void {
        this.send({ "error": "Missing parameter", "details": parametername }, HTTP_CODES.BadRequestError);
    }

    public notImplemented(): void {
        this.send({ "error": "Not implemented" }, HTTP_CODES.NotImplementedError);
    }

    private trace(err: any): void {
        this.options.logger?.trace(JSON.stringify(err));
    }
}
