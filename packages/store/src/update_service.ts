import config from "@qnaplus/config"
import { update } from "./database";

const startUpdater = () => {
    const interval = parseInt(config.getenv("UPDATE_INTERVAL"));
    return setInterval(() => {
        update();
    }, interval);
}

startUpdater();
