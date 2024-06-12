import { getLoggerInstance } from "@qnaplus/logger";
import Cron from "croner";
import { config, doNotificationUpdate, doWebappUpdate } from "qnaplus";

(async () => {
    const logger = getLoggerInstance("qnaupdater");
    // logger.info("Starting updater service");
    // await doNotificationUpdate(logger);
    // Cron(config.getenv("UPDATE_INTERVAL"), () => {
    //     doNotificationUpdate(logger);
    // });
    doWebappUpdate(logger);

})();
