import pino from "pino";
import { doStorageUpdate } from "./database";

(async () => {
    const logger = pino();
    doStorageUpdate(logger)
})();
