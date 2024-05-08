import { getLoggerInstance } from "@qnaplus/logger";
import { schedule } from "node-cron";
import { config, update } from "qnaplus";

(async () => {
    const logger = getLoggerInstance("qnaupdater");
    logger.info("Starting updater service");
    await update(logger);
    schedule(config.getenv("UPDATE_INTERVAL"), () => {
        update(logger);
    });
})();
