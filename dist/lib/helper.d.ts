import { Response } from "express";
export interface LoggerWithTracer {
    trace: (...message: any[]) => void;
}
export interface ExpressHelperOptions {
    logger?: LoggerWithTracer;
    enableJSONP?: boolean;
    shouldSend404onEmpty?: boolean;
}
export declare class ExpressHelper {
    private res;
    private options;
    constructor(res: Response, options: ExpressHelperOptions);
    promiseWrapper(promise: Promise<any>, shouldSend404onEmpty?: boolean): void;
    cbWithDefaultValue(defaultvalue: any): (e: any) => void;
    cb(): (e: any, value: any) => void;
    error(errCode?: number | string, defaultMessage?: string): (err: any) => void;
    send(content: any, statusCode?: number): void;
    ok(shouldSend404onEmpty?: boolean): (data: any) => void;
    okWithDefaultValue(defaultvalue: any, statusCode?: number): (data: any) => void;
    notFound(): void;
    unauthenticated(details: any): void;
    forbidden(details: any): void;
    unauthorized(details: any): void;
    callbackError(err: any): void;
    missingParameter(parametername: string): void;
    notImplemented(): void;
}
//# sourceMappingURL=helper.d.ts.map