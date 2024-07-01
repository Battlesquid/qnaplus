import pino, { Logger } from "pino";
import { QnaplusChannels, QnaplusEvents, QnaplusTables, asEnvironmentResource, getRenotifyQueue, getSupabaseInstance } from "qnaplus";

export const doRenotifyUpdate = async (_logger: Logger) => {
    const logger = _logger.child({ label: "doRenotifyUpdate" });
    const supabase = getSupabaseInstance();
    const { data: payload, error, status, statusText } = await getRenotifyQueue();
    if (error !== null) {
        logger.error({ error, status, statusText }, "Unable to process renotify queue, skipping.");
        return;
    }
    if (payload.length === 0) {
        logger.info("No questions queued for renotification, skipping.");
        return;
    }
    const broadcastResponse = await supabase.channel(asEnvironmentResource(QnaplusChannels.DbChanges))
        .send({ type: "broadcast", event: QnaplusEvents.RenotifyQueueFlush, payload: { questions: payload } });

    switch (broadcastResponse) {
        case "ok":
            logger.info("Broadcast successful, deleting queue.");
            break;
        case "error":
            logger.error("Error broadcasting message, will try again on next update.");
            return;
        case "timed out":
            logger.info("Broadcast timed out, will try again on next update.");
            return;
    }
    const { count, error: clearError, status: clearStatus, statusText: clearStatusText } = await supabase.from(asEnvironmentResource(QnaplusTables.RenotifyQueue))
        .delete({ count: "exact" })
        .neq("id", "0");
    if (clearError) {
        logger.error({ error: clearError, status: clearStatus, statusText: clearStatusText });
        return;
    }
    logger.info(`Successfully cleared ${count ?? 0} questions from the renotify queue.`);
}
