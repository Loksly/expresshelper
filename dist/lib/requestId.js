"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = void 0;
var crypto = __importStar(require("crypto"));
function generateId() {
    var bytes = crypto.randomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    return [
        bytes.slice(0, 4).toString("hex"),
        bytes.slice(4, 6).toString("hex"),
        bytes.slice(6, 8).toString("hex"),
        bytes.slice(8, 10).toString("hex"),
        bytes.slice(10).toString("hex"),
    ].join("-");
}
function requestIdMiddleware(options) {
    var header = (options && options.header) ? options.header : "x-request-id";
    return function (req, res, next) {
        var existing = req.headers[header];
        var requestId = (typeof existing === "string" && existing.length > 0)
            ? existing
            : generateId();
        res.locals.requestId = requestId;
        res.setHeader(header, requestId);
        next();
    };
}
exports.requestIdMiddleware = requestIdMiddleware;
//# sourceMappingURL=requestId.js.map