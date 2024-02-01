import pino from "pino";
import { populate } from "./database";

(async() => {
    const logger = pino();
    populate(logger)
})();
