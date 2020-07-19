import { ExpressHelper } from "./lib/helper";

declare global {
    namespace Express {
        interface Request {
            locals: {
                expresshelper?: ExpressHelper;
            }
        }
    }
}