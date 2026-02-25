import { ExpressHelper } from "./lib/helper";

declare global {
    namespace Express {
        interface Locals {
            expresshelper?: ExpressHelper;
            requestId?: string;
        }
    }
}