import { ApplyOptions } from "@sapphire/decorators";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { QnaplusTables, asEnvironmentResource, getDatabaseInstance, getQuestion } from "qnaplus";
import { renotify } from "../interactions";
import { PinoLoggerAdapter } from "../logger_adapter";
import { formatDDMMMYYYY, isValidDate, mmmToMonthNumber } from "../util/date";


@ApplyOptions<Subcommand.Options>({
    name: renotify.interaction.name,
    description: renotify.interaction.description,
    requiredUserPermissions: ["Administrator"],
    requiredClientPermissions: ["SendMessages"],
    subcommands: [
        {
            name: renotify.commands.id.name,
            chatInputRun: "renotifyId",
        },
        {
            name: renotify.commands.bulkId.name,
            chatInputRun: "renotifyBulkId",
        },
        {
            name: renotify.commands.bulkDate.name,
            chatInputRun: "renotifyBulkDate",
        },
        {
            name: renotify.commands.cancel.name,
            chatInputRun: "renotifyCancel",
        },
    ]
})
export class Renotify extends Subcommand {
    private static readonly CHAT_INPUT_DEVELOPMENT_ID: string = "1255678004143849493";

    public override registerApplicationCommands(registry: Subcommand.Registry) {
        registry.registerChatInputCommand(renotify.interaction, {
            idHints: [Renotify.CHAT_INPUT_DEVELOPMENT_ID]
        });
    }

    public async renotifyId(interaction: Subcommand.ChatInputCommandInteraction) {
        const logger = (this.container.logger as PinoLoggerAdapter).child({ label: "renotifyId" });
        const id = interaction.options.getString("id", true);
        const db = getDatabaseInstance();
        const { error } = await db.from(asEnvironmentResource(QnaplusTables.Questions))
            .update({ answered: false })
            .eq("id", id);
        if (error) {
            logger.error({ error });
            interaction.reply(`Unable to find a question with the id '${id}' (Error Code ${error.code})`);
            return;
        }
        logger.info(`Queued question with id '${id}' for renotification.`);
    }

    public async renotifyBulkId(interaction: Subcommand.ChatInputCommandInteraction) {
        const logger = (this.container.logger as PinoLoggerAdapter).child({ label: "rollbackBulkId" });
        const id = interaction.options.getString("id", true);
        const question = await getQuestion(id);
        if (question === null) {
            logger.warn(`No question with the id '${id}' was found, exiting`);
            interaction.reply(`No question with the id '${id}' was found, exiting`);
            return;
        }
        try {
            const count = await this.doRenotifyBulkDate(question.askedTimestampMs);
            const text = `Successfully queued ${count} questions for renotification.`;
            interaction.reply(text);
        } catch (e) {
            logger.error({ error: e });
            interaction.reply("An error occurred");
        }
    }

    public async renotifyBulkDate(interaction: Subcommand.ChatInputCommandInteraction) {
        const logger = (this.container.logger as PinoLoggerAdapter).child({ label: "renotifyBulkDate" });
        const date = interaction.options.getString("date", true);
        const regex = /(\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{4})/;
        const match = date.match(regex);
        if (match === null) {
            const text = `${date} does not match the format 'DD-MMM-YYYY', exiting.`;
            logger.error(text);
            interaction.reply(text);
            return;
        }
        const computedDate = new Date(date);
        const [, day, mmm, year] = match;
        const month = mmmToMonthNumber(mmm);
        if (!isValidDate(new Date(date), parseInt(year), month, parseInt(day))) {
            const errorText = `Provided date is invalid (Read as '${date}', computed as '${formatDDMMMYYYY(computedDate)}').`;
            logger.error(errorText);
            interaction.reply(errorText);
            return;
        }
        try {
            const count = await this.doRenotifyBulkDate(computedDate.getTime());
            const text = `Successfully queued ${count} questions for renotification.`;
            interaction.reply(text);
        } catch (e) {
            logger.error({ error: e });
            interaction.reply("An error occurred");
        }
    }

    public async renotifyCancel(interaction: Subcommand.ChatInputCommandInteraction) {

    }

    private async doRenotifyBulkDate(dateMs: number) {
        const db = getDatabaseInstance();
        const { data: ids, error: questionsError } = await db.from(asEnvironmentResource(QnaplusTables.Questions))
            .select("id")
            .eq("answered", true)
            .gte("answeredTimestampMs", dateMs)
        if (questionsError) {
            throw questionsError;
        }
        if (ids.length === 0) {
            return 0;
        }
        const { count, error: renotifyError } = await db.from(QnaplusTables.RenotifyQueue)
            .upsert(ids, { count: "exact", ignoreDuplicates: true });
        if (renotifyError) {
            throw renotifyError;
        }
        // TODO figure out what a count of 'null' means
        return count ?? 0;
    }
}