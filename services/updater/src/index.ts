import { getLoggerInstance } from "@qnaplus/logger";
import Cron from "croner";
import { config, update } from "qnaplus";

(async () => {
    const logger = getLoggerInstance("qnaupdater");
    logger.info("Starting updater service");
    await update(logger);
    Cron(config.getenv("UPDATE_INTERVAL"), () => {
        update(logger);
    });
})();
