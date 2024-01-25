import config from "@qnaplus/config";
import { LogLevel, SapphireClient, container } from "@sapphire/framework";
import { ActivityType, GatewayIntentBits, Partials } from "discord.js";
import { PinoLoggerAdapter } from "./logger";
import { startBroadcaster } from "./broadcaster";
import pino from "pino";

const pinoLogger = pino();

const client = new SapphireClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    logger: {
        level: config.getenv("NODE_ENV") === 'development' ? LogLevel.Debug : LogLevel.Info,
        instance: new PinoLoggerAdapter(pinoLogger)
    },
    partials: [Partials.Message, Partials.Channel],
    presence: {
        status: "online",
        activities: [
            {
                type: ActivityType.Watching,
                name: 'the GDC with great interest.',
            },
        ],
    },
});

const start = async () => {
    await client.login(config.getenv("DISCORD_TOKEN"));
    startBroadcaster(pinoLogger);
}

start()
    .catch(e => container.logger.error(e))