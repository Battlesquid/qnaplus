import config from "@qnaplus/config"
import { onAnswered } from "@qnaplus/store"
import { container } from "@sapphire/framework"
import { ChannelType, ColorResolvable, EmbedBuilder, channelMention, hyperlink } from "discord.js"
import { Logger } from "pino"
import { Question } from "vex-qna-archiver"
import { chunk } from "./util/chunk"
import { groupby } from "./util/groupby"

const channels = JSON.parse(config.getenv("BROADCASTER_CHANNELS"))

const ProgramColorMap: Record<string, ColorResolvable> = {
    VRC: "#E62525",
    VEXU: "#952CD1",
    VAIRC: "#4FDE28",
    VIQRC: "#226AE6",
    judging: "#"
}

const MAX_EMBEDS_PER_MESSAGE = 10;

const handleProgramBroadcast = async (program: string, questions: Question[]) => {
    const channelId = channels[program];
    if (channelId === undefined) {
        container.logger.warn(`No channel defined for ${program}, skipping.`);
        return;
    }
    const channel = await container.client.channels.fetch(channelId);
    if (channel === null || channel.type !== ChannelType.GuildText) {
        container.logger.warn(`Channel ${channelMention(channelId)} (${channelId}) is missing or is not a text channel, skipping.`);
        return;
    }
    const embeds = questions.map(({ title, program, author, askedTimestamp, url, tags }) =>
        new EmbedBuilder()
            .setColor(ProgramColorMap[program])
            .setTitle(`New ${program} Q&A response`)
            .setDescription(`Asked by ${author} on ${askedTimestamp}`)
            .addFields({ name: "Question: ", value: hyperlink(title, url) })
            .setFooter({ text: `${tags.length ? "🏷️ " + tags.join(", ") : "No tags"}` }));
    const embedSlices = chunk(embeds, MAX_EMBEDS_PER_MESSAGE);
    for (const embeds of embedSlices) {
        channel.send({ embeds });
    }
}

const handleOnAnswered = async (docs: Question[]) => {
    const grouped = groupby(docs, q => q.program);
    for (const program in grouped) {
        await handleProgramBroadcast(program, grouped[program]);
    }
}

export const startBroadcaster = async (logger?: Logger) => {
    const unsubscribe = await onAnswered(handleOnAnswered, true, logger);
}
