import pino from "pino";
import { config, update } from "qnaplus";

(async () => {
    const logger = pino();
    logger.info("Starting updater service");
    const interval = parseInt(config.getenv("UPDATE_INTERVAL"));
    await update(logger);
    return setInterval(() => {
        update(logger);
    }, interval);
})();
