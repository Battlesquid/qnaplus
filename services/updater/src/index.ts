import { getLoggerInstance } from "@qnaplus/logger";
import Cron from "croner";
import { config, doDatabaseUpdate, doStorageUpdate } from "qnaplus";

(async () => {
    const logger = getLoggerInstance("qnaupdater");
    logger.info("Starting updater service");

    await doDatabaseUpdate(logger);
    logger.info("Starting database update job")
    Cron(config.getenv("DATABASE_UPDATE_INTERVAL"), () => {
        doDatabaseUpdate(logger);
    });

    logger.info("Starting webapp update job");
    Cron(config.getenv("WEBAPP_UPDATE_INTERVAL"), () => {
        doStorageUpdate(logger);
    });
})();
