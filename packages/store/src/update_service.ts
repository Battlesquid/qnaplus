import config from "@qnaplus/config"
import { update } from "./database";
import pino from "pino";

const startUpdater = async () => {
    const logger = pino();
    logger.info("Starting updater service");
    const interval = parseInt(config.getenv("UPDATE_INTERVAL"));
    await update(logger);
    return setInterval(() => {
        update(logger);
    }, interval);
}

startUpdater();
