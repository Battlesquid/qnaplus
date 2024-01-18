import { onAnswered } from "@qnaplus/store";
import { LogLevel, SapphireClient } from "@sapphire/framework";
import { GatewayIntentBits, Partials, ActivityType } from "discord.js";
import pino from "pino";

(async () => {
    const logger = pino({ level: "trace" });
    const unsubscribe = await onAnswered(
        (docs) => {
            console.log(docs);
        },
        true,
        logger
    );
})();

const client = new SapphireClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
    logger: {
        level: process.env.NODE_ENV === 'development' ? LogLevel.Debug : LogLevel.Info,
    },
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    presence: {
        status: "online",
        activities: [
            {
                type: ActivityType.Playing,
                name: '/help',
            },
        ],
    },

});