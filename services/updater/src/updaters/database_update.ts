import { Logger } from "pino";
import { getMetadata, getSupabaseInstance, saveMetadata, upsertQuestions } from "qnaplus";
import { Season, fetchQuestionsIterative, getOldestUnansweredQuestion } from "vex-qna-archiver";

export const doDatabaseUpdate = async (_logger?: Logger) => {
    const logger = _logger?.child({ label: "doDatabaseUpdate" });
    const supabase = getSupabaseInstance();
    const { error: metadataError, data } = await getMetadata();
    if (metadataError) {
        logger?.error({ error: metadataError }, "Error retrieving question metadata, exiting");
        return;
    }

    const { current_season, oldest_unanswered_question } = data;
    logger?.info(`Starting update from Q&A ${oldest_unanswered_question}`);
    const questions = await fetchQuestionsIterative({ logger, start: parseInt(oldest_unanswered_question) });
    const success = await upsertQuestions(questions, { logger });
    if (success) {
        logger?.info(`Updated ${questions.length} questions.`);
    }

    const oldestUnanswered = getOldestUnansweredQuestion(questions, current_season as Season);
    if (oldestUnanswered === undefined) {
        logger?.info("Oldest unanswered question not found, skipping metadata update.")
        return;
    }

    const { error } = await saveMetadata({ oldest_unanswered_question: oldestUnanswered.id });

    if (error) {
        logger?.error({ error, oldest_unanswered_id: oldestUnanswered.id }, `Unable to save oldest unanswered question (${oldestUnanswered.id}) to metadata`);
    } else {
        logger?.info({ oldest_unanswered_id: oldestUnanswered.id }, `Successfully updated metadata with oldest unanswered question (${oldestUnanswered.id})`);
    }
}
