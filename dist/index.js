"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expresshelper = void 0;
var helper_1 = require("./lib/helper");
__exportStar(require("./lib/codes"), exports);
__exportStar(require("./lib/helper"), exports);
;
function expresshelper(options) {
    return function (_req, res, next) {
        res.locals.expresshelper = new helper_1.ExpressHelper(res, options ? options : {});
        next();
    };
}
exports.expresshelper = expresshelper;
//# sourceMappingURL=index.js.map