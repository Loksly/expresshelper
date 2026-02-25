import { RequestHandler } from "express";
import { ExpressHelperOptions } from "./helper";
import { RequestIdOptions } from "./requestId";
export interface PresetMinimalOptions {
    expresshelper?: ExpressHelperOptions;
    requestId?: RequestIdOptions | false;
}
export declare function presetMinimal(options?: PresetMinimalOptions): RequestHandler[];
//# sourceMappingURL=preset.d.ts.map