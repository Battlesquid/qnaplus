import pino from "pino";
import { populateWithMetadata } from "./database";

(async () => {
    const logger = pino();
    populateWithMetadata(logger)
})();
