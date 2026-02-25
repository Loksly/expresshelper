"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressHelper = void 0;
const codes_1 = require("./codes");
class ExpressHelper {
    constructor(res, options) {
        this.res = res;
        this.options = options;
        this.options.enableJSONP = this.options.enableJSONP === true;
        this.options.shouldSend404onEmpty = typeof this.options.shouldSend404onEmpty === "boolean" ? this.options.shouldSend404onEmpty : true;
    }
    promiseWrapper(promise, shouldSend404onEmpty) {
        promise.then(this.ok(shouldSend404onEmpty)).catch(this.error());
    }
    cbWithDefaultValue(defaultvalue) {
        return (err) => {
            if (err) {
                this.send(err, codes_1.HTTP_CODES.InternalError);
                this.trace(err);
            }
            else {
                this.send(defaultvalue);
            }
        };
    }
    cb() {
        return (err, value) => {
            if (err) {
                this.send(err, codes_1.HTTP_CODES.InternalError);
                this.trace(err);
            }
            else {
                this.send(value);
            }
        };
    }
    error(errCode, defaultMessage) {
        return (err) => {
            let message = "", errorCode = codes_1.HTTP_CODES.InternalServerError;
            if (!defaultMessage && typeof errCode === "string") {
                message = errCode;
            }
            else if (typeof defaultMessage === "string") {
                message = defaultMessage;
            }
            else {
                message = "An error has occurred";
            }
            if (typeof errCode === "number") {
                errorCode = errCode;
            }
            this.send({ "error": message, "details": err }, errorCode);
            this.trace(err);
        };
    }
    send(content, statusCode) {
        if (typeof statusCode === "number") {
            this.res.status(statusCode);
        }
        if (this.options.enableJSONP) {
            this.res.jsonp(content);
        }
        else {
            this.res.json(content);
        }
    }
    ok(shouldSend404onEmpty) {
        return (data) => {
            if (!data && (shouldSend404onEmpty || this.options.shouldSend404onEmpty)) {
                this.send({ "error": "An error has occurred", "details": "Not found" }, codes_1.HTTP_CODES.NotFoundError);
            }
            else {
                this.send(data);
            }
        };
    }
    okWithDefaultValue(defaultvalue, statusCode) {
        return () => {
            if (typeof statusCode === "number") {
                this.res.status(statusCode);
            }
            if (typeof defaultvalue === "string" && defaultvalue === "") {
                this.res.end();
            }
            else {
                this.send(defaultvalue);
            }
        };
    }
    notFound() {
        this.send({ "error": "An error has occurred", "details": "Not found" }, codes_1.HTTP_CODES.NotFoundError);
        this.trace("Not found");
    }
    unauthenticated(details) {
        this.send({ "error": "Unauthenticated", "details": details }, codes_1.HTTP_CODES.UnauthorizedError);
    }
    forbidden(details) {
        this.send({ "error": "Unauthorized", "details": details }, codes_1.HTTP_CODES.ForbiddenError);
    }
    unauthorized(details) {
        this.forbidden(details);
    }
    callbackError(err) {
        this.send({ "error": "An error has occurred", "details": err }, codes_1.HTTP_CODES.InternalServerError);
        this.trace(err);
    }
    missingParameter(parametername) {
        this.send({ "error": "Missing parameter", "details": parametername }, codes_1.HTTP_CODES.BadRequestError);
    }
    notImplemented() {
        this.send({ "error": "Not implemented" }, codes_1.HTTP_CODES.NotImplementedError);
    }
    trace(err) {
        this.options.logger?.trace(JSON.stringify(err));
    }
}
exports.ExpressHelper = ExpressHelper;
//# sourceMappingURL=helper.js.map