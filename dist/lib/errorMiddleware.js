"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
var httpError_1 = require("./httpError");
function errorMiddleware(options) {
    var format = (options && options.format) ? options.format : "json";
    var includeStack = options ? options.includeStack === true : false;
    return function (err, _req, res, _next) {
        var status = (err instanceof httpError_1.HttpError) ? err.status : 500;
        var code = (err instanceof httpError_1.HttpError) ? err.code : "INTERNAL_SERVER_ERROR";
        var message = (err instanceof Error) ? err.message : "Internal Server Error";
        var details = (err instanceof httpError_1.HttpError) ? err.details : undefined;
        var stack = (includeStack && err instanceof Error) ? err.stack : undefined;
        if (format === "problem+json") {
            var body = {
                type: "https://httpstatuses.com/" + status,
                title: message,
                status: status,
                code: code,
            };
            if (details !== undefined) {
                body.detail = String(details);
            }
            if (stack !== undefined) {
                body.trace = stack;
            }
            res.status(status).set("Content-Type", "application/problem+json").json(body);
        }
        else {
            var body = {
                error: message,
                code: code,
            };
            if (details !== undefined) {
                body.details = details;
            }
            if (stack !== undefined) {
                body.stack = stack;
            }
            res.status(status).json(body);
        }
    };
}
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=errorMiddleware.js.map