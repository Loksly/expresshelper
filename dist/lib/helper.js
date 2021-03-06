"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressHelper = void 0;
var codes_1 = require("./codes");
var ExpressHelper = (function () {
    function ExpressHelper(res, options) {
        this.res = res;
        this.options = options;
        this.options.enableJSONP = this.options.enableJSONP === true;
        this.options.shouldSend404onEmpty = typeof this.options.shouldSend404onEmpty === "boolean" ? this.options.shouldSend404onEmpty : true;
    }
    ExpressHelper.prototype.promiseWrapper = function (promise, shouldSend404onEmpty) {
        promise.then(this.ok(shouldSend404onEmpty)).catch(this.error());
    };
    ExpressHelper.prototype.cbWithDefaultValue = function (defaultvalue) {
        var _this = this;
        return function (err) {
            if (err) {
                _this.send(err, codes_1.HTTP_CODES.InternalError);
                _this.trace(err);
            }
            else {
                _this.send(defaultvalue);
            }
        };
    };
    ExpressHelper.prototype.cb = function () {
        var _this = this;
        return function (err, value) {
            if (err) {
                _this.send(err, codes_1.HTTP_CODES.InternalError);
                _this.trace(err);
            }
            else {
                _this.send(value);
            }
        };
    };
    ExpressHelper.prototype.error = function (errCode, defaultMessage) {
        var _this = this;
        return function (err) {
            var message = "", errorCode = codes_1.HTTP_CODES.InternalServerError;
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
            _this.send({ "error": message, "details": err }, errorCode);
            _this.trace(err);
        };
    };
    ExpressHelper.prototype.send = function (content, statusCode) {
        if (typeof statusCode === "number") {
            this.res.status(statusCode);
        }
        if (this.options.enableJSONP) {
            this.res.jsonp(content);
        }
        else {
            this.res.json(content);
        }
    };
    ExpressHelper.prototype.ok = function (shouldSend404onEmpty) {
        var _this = this;
        return function (data) {
            if (!data && (shouldSend404onEmpty || _this.options.shouldSend404onEmpty)) {
                _this.send({ "error": "An error has occurred", "details": "Not found" }, codes_1.HTTP_CODES.NotFoundError);
            }
            else {
                _this.send(data);
            }
        };
    };
    ExpressHelper.prototype.okWithDefaultValue = function (defaultvalue, statusCode) {
        var _this = this;
        return function () {
            if (typeof statusCode === "number") {
                _this.res.status(statusCode);
            }
            if (typeof defaultvalue === "string" && defaultvalue === "") {
                _this.res.end();
            }
            else {
                _this.send(defaultvalue);
            }
        };
    };
    ExpressHelper.prototype.notFound = function () {
        this.send({ "error": "An error has occurred", "details": "Not found" }, codes_1.HTTP_CODES.NotFoundError);
        this.trace("Not found");
    };
    ExpressHelper.prototype.unauthenticated = function (details) {
        this.send({ "error": "Unauthenticated", "details": details }, codes_1.HTTP_CODES.UnauthorizedError);
    };
    ExpressHelper.prototype.forbidden = function (details) {
        this.send({ "error": "Unauthorized", "details": details }, codes_1.HTTP_CODES.ForbiddenError);
    };
    ExpressHelper.prototype.unauthorized = function (details) {
        this.forbidden(details);
    };
    ExpressHelper.prototype.callbackError = function (err) {
        this.send({ "error": "An error has occurred", "details": err }, codes_1.HTTP_CODES.InternalServerError);
        this.trace(err);
    };
    ExpressHelper.prototype.missingParameter = function (parametername) {
        this.send({ "error": "Missing parameter", "details": parametername }, codes_1.HTTP_CODES.BadRequestError);
    };
    ExpressHelper.prototype.notImplemented = function () {
        this.send({ "error": "Not implemented" }, codes_1.HTTP_CODES.NotImplementedError);
    };
    ExpressHelper.prototype.trace = function (err) {
        var _a;
        (_a = this.options.logger) === null || _a === void 0 ? void 0 : _a.trace(JSON.stringify(err));
    };
    return ExpressHelper;
}());
exports.ExpressHelper = ExpressHelper;
//# sourceMappingURL=helper.js.map