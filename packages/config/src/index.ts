import { config as configenv } from "dotenv"
import * as path from "path";

const ENV_VARIABLES = [
    "FIREBASE_CONFIG",
    "DISCORD_TOKEN",
    "NODE_ENV",
    "BROADCASTER_CHANNELS"
] as const;

type ConfigVariable = typeof ENV_VARIABLES[number];

const loadConfig = () => {
    configenv({ path: path.resolve(__dirname, "../.env") });

    const loaded: Record<string, string> = {};
    ENV_VARIABLES.forEach((v) => {
        const value = process.env[v];
        if (value === undefined) {
            throw Error(`Environment variable '${v}' missing, exiting.`);
        }
        loaded[v] = value;
    });
    return loaded;
}

let CONFIG: Record<string, string> | null = null;

export default {
    getenv(key: ConfigVariable) {
        if (CONFIG === null) {
            CONFIG = loadConfig();
        }
        return CONFIG[key];
    }
}