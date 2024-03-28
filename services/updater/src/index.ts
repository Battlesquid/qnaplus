import { schedule } from "node-cron";
import pino from "pino";
import { config, update } from "qnaplus";

(async () => {
    const logger = pino();
    logger.info("Starting updater service");
    await update(logger);
    schedule(config.getenv("UPDATE_INTERVAL"), () => {
        update(logger);
    });
})();
