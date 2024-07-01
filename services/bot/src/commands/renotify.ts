import { ApplyOptions } from "@sapphire/decorators";
import { PaginatedMessageEmbedFields } from "@sapphire/discord.js-utilities";
import { Subcommand } from "@sapphire/plugin-subcommands";
import Cron from "croner";
import { EmbedBuilder, EmbedField } from "discord.js";
import { QnaplusTables, asEnvironmentResource, config, getQuestion, getRenotifyQueue, getSupabaseInstance } from "qnaplus";
import { renotify } from "../interactions";
import { PinoLoggerAdapter } from "../logger_adapter";
import { formatDDMMMYYYY, isValidDate, mmmToMonthNumber } from "../util/date";
import { LoggerSubcommand } from "../util/logger_subcommand";


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
            name: renotify.commands.list.name,
            chatInputRun: "renotifyList",
        },
        {
            name: renotify.commands.cancel.name,
            chatInputRun: "renotifyCancel",
        },
    ]
})
export class Renotify extends LoggerSubcommand {
    private static readonly CHAT_INPUT_DEVELOPMENT_ID: string = "1255678004143849493";

    public override registerApplicationCommands(registry: Subcommand.Registry) {
        registry.registerChatInputCommand(renotify.interaction, {
            idHints: [Renotify.CHAT_INPUT_DEVELOPMENT_ID]
        });
    }

    public async renotifyId(interaction: Subcommand.ChatInputCommandInteraction) {
        const logger = (this.container.logger as PinoLoggerAdapter).child({ label: "renotifyId" });
        const id = interaction.options.getString("id", true);
        const db = getSupabaseInstance();

        const question = await getQuestion(id);
        if (question === null) {
            this.logWarnAndReply(
                logger,
                interaction,
                `No question with the id '${id}' was found, exiting.`
            )
            return;
        }

        const { error, status, statusText } = await db.from(asEnvironmentResource(QnaplusTables.RenotifyQueue))
            .upsert({ id });
        if (error) {
            this.logErrorAndReply(
                logger,
                interaction,
                `Unable to queue question with id '${id}' for renotification`,
                { error, status, statusText }
            );
            return;
        }
        this.logInfoAndReply(
            logger,
            interaction,
            `Queued question with id '${id}' for renotification.${this.getNextRuntimeString()} Cancel anytime using /renotify cancel.`
        );
    }

    public async renotifyBulkId(interaction: Subcommand.ChatInputCommandInteraction) {
        const logger = (this.container.logger as PinoLoggerAdapter).child({ label: "renotifyBulkId" });
        const id = interaction.options.getString("id", true);
        const question = await getQuestion(id);
        if (question === null) {
            this.logWarnAndReply(
                logger,
                interaction,
                `No question with the id '${id}' was found, exiting.`
            )
            return;
        }
        try {
            const count = await this.doRenotifyBulkDate(question.askedTimestampMs);
            this.logInfoAndReply(
                logger,
                interaction,
                `Successfully queued ${count} questions for renotification.${this.getNextRuntimeString()} Cancel anytime using /renotify cancel.`
            )
        } catch (e) {
            this.logErrorAndReply(
                logger,
                interaction,
                "An error occurred",
                e as object
            );
        }
    }

    public async renotifyBulkDate(interaction: Subcommand.ChatInputCommandInteraction) {
        const logger = (this.container.logger as PinoLoggerAdapter).child({ label: "renotifyBulkDate" });
        const date = interaction.options.getString("date", true);
        const regex = /(\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{4})/;
        const match = date.match(regex);
        if (match === null) {
            this.logErrorAndReply(
                logger,
                interaction,
                `${date} does not match the format 'DD-MMM-YYYY', exiting.`
            );
            return;
        }
        const computedDate = new Date(date);
        const [, day, mmm, year] = match;
        const month = mmmToMonthNumber(mmm);
        if (!isValidDate(new Date(date), parseInt(year), month, parseInt(day))) {
            this.logErrorAndReply(
                logger,
                interaction,
                `Provided date is invalid (read as '${date}', computed as '${formatDDMMMYYYY(computedDate)}').`
            );
            return;
        }
        try {
            const count = await this.doRenotifyBulkDate(computedDate.getTime());
            this.logInfoAndReply(
                logger,
                interaction,
                `Successfully queued ${count} questions for renotification.${this.getNextRuntimeString()} Cancel anytime using /renotify cancel.`
            )
        } catch (e) {
            this.logErrorAndReply(
                logger,
                interaction,
                "An error occurred",
                e as object
            );
        }
    }

    public async renotifyList(interaction: Subcommand.ChatInputCommandInteraction) {
        const logger = (this.container.logger as PinoLoggerAdapter).child({ label: "renotifyList" });
        const { data: questions, error, status, statusText } = await getRenotifyQueue();
        if (error !== null) {
            this.logErrorAndReply(
                logger,
                interaction,
                "Error retreiving renotify queue.",
                { error, status, statusText }
            );
            return;
        }

        if (questions.length === 0) {
            this.logInfoAndReply(
                logger,
                interaction,
                "No questioned queued for renotification."
            );
            return;
        }

        const fields = questions.map<EmbedField>(({ title, author, askedTimestamp, url }) => {
            return {
                name: title,
                value: `Asked by ${author} on ${askedTimestamp}\n${url}`,
                inline: false
            }
        });

        const template = new EmbedBuilder()
            .setTitle("Renotify Queue")
            .setColor("Blurple")

        new PaginatedMessageEmbedFields()
            .setTemplate(template)
            .setItems(fields)
            .setItemsPerPage(5)
            .make()
            .run(interaction);
    }

    public async renotifyCancel(interaction: Subcommand.ChatInputCommandInteraction) {
        const logger = (this.container.logger as PinoLoggerAdapter).child({ label: "renotifyCancel" });
        const db = getSupabaseInstance();
        const { count, error, status, statusText } = await db.from(asEnvironmentResource(QnaplusTables.RenotifyQueue))
            .delete({ count: "exact" })
            .neq("id", "0");
        if (error) {
            this.logErrorAndReply(
                logger,
                interaction,
                "An error occurred while clearing renotify queue.",
                { error, status, statusText }
            );
            return;
        }
        this.logInfoAndReply(
            logger,
            interaction,
            `Successfully cleared ${count ?? 0} questions from the renotify queue.`
        );
    }

    private async doRenotifyBulkDate(dateMs: number) {
        const db = getSupabaseInstance();
        const {
            data: ids,
            error: questionsError,
            status: questionsStatus,
            statusText: questionStatusText
        } = await db.from(asEnvironmentResource(QnaplusTables.Questions))
            .select("id")
            .eq("answered", true)
            .gte("askedTimestampMs", dateMs)
        if (questionsError) {
            throw { error: questionsError, status: questionsStatus, statusText: questionStatusText };
        }
        if (ids.length === 0) {
            return 0;
        }
        const {
            count,
            error: renotifyError,
            status: renotifyStatus,
            statusText: renotifyStatusText
        } = await db.from(asEnvironmentResource(QnaplusTables.RenotifyQueue))
            .upsert(ids, { count: "exact", ignoreDuplicates: true });
        if (renotifyError) {
            throw { error: renotifyError, status: renotifyStatus, statusText: renotifyStatusText };
        }
        // TODO figure out what a count of 'null' means
        return count ?? 0;
    }

    private getNextRuntimeString() {
        const nextRuntime = Cron(config.getenv("DATABASE_UPDATE_INTERVAL")).msToNext();
        const minutes = Math.round(nextRuntime! / 1000 / 60);
        return ` ${minutes} minutes until next run.`;
    }
}
