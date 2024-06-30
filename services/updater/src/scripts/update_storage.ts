import pino from "pino";
import { doStorageUpdate } from "../updaters/storage_update";

(async () => {
    const logger = pino();
    doStorageUpdate(logger)
})();
