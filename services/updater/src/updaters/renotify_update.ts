import { Logger } from "pino";
import { QnaplusChannels, QnaplusEvents, QnaplusTables, getRenotifyQueue, getSupabaseInstance } from "qnaplus";

export const onRenotifyQueueFlushAck = (_logger: Logger) => {
    const logger = _logger.child({ label: "renotifyQueueAck" });
    logger.info("Registering listener for RenotifyQueueFlushAck");

    const supabase = getSupabaseInstance();
    supabase.channel(QnaplusChannels.RenotifyQueue)
        .on(
            "broadcast",
            { event: QnaplusEvents.RenotifyQueueFlushAck },
            async () => {
                const { count, error, status, statusText } = await supabase.from(QnaplusTables.RenotifyQueue)
                    .delete({ count: "exact" })
                    .neq("id", "0");
                if (error) {
                    logger.error({ error, status, statusText });
                    return;
                }
                logger.info(`Successfully cleared ${count ?? 0} questions from the renotify queue.`);
            }
        )
        .subscribe();
}

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

    const broadcastResponse = await supabase.channel(QnaplusChannels.DbChanges)
        .send({ type: "broadcast", event: QnaplusEvents.RenotifyQueueFlush, payload: { questions: payload } });
    switch (broadcastResponse) {
        case "ok":
            logger.info("Sent broadcast successfully.");
            break;
        case "error":
            logger.error("Error broadcasting message, will try again on next update.");
            return;
        case "timed out":
            logger.info("Broadcast timed out, will try again on next update.");
            return;
    }
}
