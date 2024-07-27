import { Logger } from "pino";
import { getFailures, getMetadata, removeFailures, saveMetadata, updateFailures, upsertQuestions } from "qnaplus";
import { ITERATIVE_BATCH_COUNT, IterativeFetchResult, Question, Season, fetchQuestionRange, fetchQuestionsIterative, getOldestUnansweredQuestion, handleIterativeBatch, sleep } from "vex-qna-archiver";

// TODO: remove once utils are refactored into a package
const chunk = <T>(items: T[], size: number): T[][] => {
    return items.reduce<T[][]>((chunks, item, i) => {
        (chunks[Math.floor(i / size)] ??= []).push(item);
        return chunks;
    }, []);
}

const unique = <T>(items: T[]) => items.filter((item, idx, arr) => arr.indexOf(item) === idx);

const handleFailureUpdate = async (logger?: Logger): Promise<IterativeFetchResult> => {
    const { error: failuresError, data: storedFailures } = await getFailures();
    if (failuresError) {
        logger?.error({ error: failuresError }, "Error retrieving failures, continuing based on oldest unanswered question");
        return { questions: [], failures: [] };
    }
    const failureNumbers = storedFailures.map(id => parseInt(id));
    const chunks = chunk(failureNumbers, ITERATIVE_BATCH_COUNT);
    const questions: Question[] = [];
    const failures: string[] = [];
    for (const chunk of chunks) {
        const results = await Promise.allSettled(fetchQuestionRange(chunk));
        const { questions: batchQuestions, failures: batchFailures } = handleIterativeBatch(chunk, results);
        questions.push(...batchQuestions);
        failures.push(...batchFailures);
        await sleep(1500);
    }
    const success = await upsertQuestions(questions, { logger });
    if (success) {
        logger?.info(`Successfully completed failure update (${questions.length} new questions found).`);
        removeFailures(questions.map(q => q.id));
    }
    return { questions, failures };
}

export const doDatabaseUpdate = async (_logger?: Logger) => {
    const logger = _logger?.child({ label: "doDatabaseUpdate" });
    const { error: metadataError, data } = await getMetadata();
    if (metadataError) {
        logger?.error({ error: metadataError }, "Error retrieving question metadata, exiting");
        return;
    }

    const failureUpdateResult = await handleFailureUpdate(logger);
    const { current_season, oldest_unanswered_question } = data;
    const oldestFailureQuestion = getOldestUnansweredQuestion(failureUpdateResult.questions, current_season);
    const start = oldestFailureQuestion !== undefined
        ? Math.min(parseInt(oldestFailureQuestion.id), parseInt(oldest_unanswered_question))
        : parseInt(oldest_unanswered_question);

    logger?.info(`Starting update from Q&A ${oldest_unanswered_question}`);
    const { questions, failures } = await fetchQuestionsIterative({ logger, start });
    const success = await upsertQuestions(questions, { logger });
    if (success) {
        logger?.info(`Updated ${questions.length} questions.`);
    }

    const allFailures = unique([...failureUpdateResult.failures, ...failures]);
    const { error: failureError } = await updateFailures(allFailures);
    if (failureError) {
        logger?.error({ error: failureError }, "Error while updated failures list.");
    }

    const oldestUnansweredFromUpdate = getOldestUnansweredQuestion(questions, current_season as Season);
    if (oldestUnansweredFromUpdate === undefined) {
        logger?.info("Oldest unanswered question from update not found, skipping metadata update.")
        return;
    }
 
    const oldestUnanswered = Math.min(parseInt(oldestUnansweredFromUpdate.id), start);
    const { error } = await saveMetadata({ oldest_unanswered_question: `${oldestUnanswered}` });

    if (error) {
        logger?.error({ error, oldest_unanswered_id: oldestUnanswered }, `Unable to save oldest unanswered question (${oldestUnanswered}) to metadata`);
    } else {
        logger?.info({ oldest_unanswered_id: oldestUnanswered }, `Successfully updated metadata with oldest unanswered question (${oldestUnanswered})`);
    }
}
