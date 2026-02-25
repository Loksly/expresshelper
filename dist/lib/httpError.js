"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.unprocessableEntity = exports.conflict = exports.notFound = exports.forbidden = exports.unauthorized = exports.badRequest = exports.HttpError = void 0;
var HttpError = (function (_super) {
    __extends(HttpError, _super);
    function HttpError(status, code, message, details) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        _this.name = "HttpError";
        _this.status = status;
        _this.code = code;
        _this.details = details;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return HttpError;
}(Error));
exports.HttpError = HttpError;
function badRequest(message, details) {
    if (message === void 0) { message = "Bad Request"; }
    return new HttpError(400, "BAD_REQUEST", message, details);
}
exports.badRequest = badRequest;
function unauthorized(message, details) {
    if (message === void 0) { message = "Unauthorized"; }
    return new HttpError(401, "UNAUTHORIZED", message, details);
}
exports.unauthorized = unauthorized;
function forbidden(message, details) {
    if (message === void 0) { message = "Forbidden"; }
    return new HttpError(403, "FORBIDDEN", message, details);
}
exports.forbidden = forbidden;
function notFound(message, details) {
    if (message === void 0) { message = "Not Found"; }
    return new HttpError(404, "NOT_FOUND", message, details);
}
exports.notFound = notFound;
function conflict(message, details) {
    if (message === void 0) { message = "Conflict"; }
    return new HttpError(409, "CONFLICT", message, details);
}
exports.conflict = conflict;
function unprocessableEntity(message, details) {
    if (message === void 0) { message = "Unprocessable Entity"; }
    return new HttpError(422, "UNPROCESSABLE_ENTITY", message, details);
}
exports.unprocessableEntity = unprocessableEntity;
//# sourceMappingURL=httpError.js.map