import config from "@qnaplus/config";
import { LogLevel, SapphireClient } from "@sapphire/framework";
import { ActivityType, GatewayIntentBits, Partials } from "discord.js";
import { PinoLoggerAdapter } from "./logger";
import { startBroadcaster } from "./broadcaster";

const client = new SapphireClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    logger: {
        level: config.getenv("NODE_ENV") === 'development' ? LogLevel.Debug : LogLevel.Info,
        instance: new PinoLoggerAdapter()
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

export const start = async () => {
    await client.login(config.getenv("DISCORD_TOKEN"));
    startBroadcaster();
}
