"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presetMinimal = void 0;
var helper_1 = require("./helper");
var requestId_1 = require("./requestId");
function presetMinimal(options) {
    var middlewares = [];
    if (!options || options.requestId !== false) {
        var reqIdOpts = (options && options.requestId)
            ? options.requestId
            : undefined;
        middlewares.push(requestId_1.requestIdMiddleware(reqIdOpts));
    }
    var helperOpts = (options && options.expresshelper)
        ? options.expresshelper
        : {};
    middlewares.push(function (_req, res, next) {
        res.locals.expresshelper = new helper_1.ExpressHelper(res, helperOpts);
        next();
    });
    return middlewares;
}
exports.presetMinimal = presetMinimal;
//# sourceMappingURL=preset.js.map