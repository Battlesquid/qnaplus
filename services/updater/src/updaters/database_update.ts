import { Logger } from "pino";
import { getFailures, getMetadata, getQuestion, removeFailures, saveMetadata, updateFailures, upsertQuestions } from "qnaplus";
import { ITERATIVE_BATCH_COUNT, IterativeFetchResult, Question, Season, fetchQuestionRange, fetchQuestionsIterative, getOldestUnansweredQuestion, handleIterativeBatch, sleep } from "vex-qna-archiver";

// TODO: remove once utils are refactored into a package
const chunk = <T>(items: T[], size: number): T[][] => {
    return items.reduce<T[][]>((chunks, item, i) => {
        (chunks[Math.floor(i / size)] ??= []).push(item);
        return chunks;
    }, []);
}

const unique = <T>(items: T[]) => items.filter((item, idx, arr) => arr.indexOf(item) === idx);

const sort = <T>(items: T[], fn: (a: T, b: T) => number) => {
    const copy = [...items];
    copy.sort(fn);
    return copy;
}

const handleFailureUpdate = async (logger?: Logger): Promise<IterativeFetchResult> => {
    const { error: failuresError, data: storedFailures } = await getFailures();
    if (failuresError) {
        logger?.error({ error: failuresError }, "Error retrieving failures, continuing based on oldest unanswered question");
        return { questions: [], failures: [] };
    }
    const failureNumbers = storedFailures.map(failure => parseInt(failure.id));
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
    console.log(failureUpdateResult)
    const { current_season, oldest_unanswered_question } = data;
    const oldestFailureQuestion = getOldestUnansweredQuestion(failureUpdateResult.questions, current_season);
    logger?.info(`Oldest failure question: ${oldestFailureQuestion}`);

    const start = oldestFailureQuestion !== undefined
        ? Math.min(parseInt(oldestFailureQuestion.id), parseInt(oldest_unanswered_question))
        : parseInt(oldest_unanswered_question);

    logger?.info(`Starting update from Q&A ${start}`);
    const { questions, failures } = await fetchQuestionsIterative({ logger, start });
    const success = await upsertQuestions(questions, { logger });
    if (success) {
        logger?.info(`Updated ${questions.length} questions.`);
    }

    const allFailures = unique([...failureUpdateResult.failures, ...failures])
    const validFailures = await Promise.all(
        allFailures.filter(async id => (await getQuestion(id)) !== null)
    );
    logger?.info(
        { validFailures, allFailures },
        `${failureUpdateResult.failures.length} failures in database, ${failures.length} failures found for this update, ${validFailures.length} valid failures found.`
    );
    const finalFailures = validFailures.map(id => ({ id }));
    const { error: failureError } = await updateFailures(finalFailures);
    if (failureError) {
        logger?.error({ error: failureError }, "Error while updating failures list.");
    }

    const oldestUnansweredFromUpdate = getOldestUnansweredQuestion(questions, current_season as Season);
    console.log(oldestUnansweredFromUpdate)
    if (oldestUnansweredFromUpdate === undefined) {
        logger?.info("Oldest unanswered question from update not found, skipping metadata update.")
        return;
    }

    // TODO figure out why i wrote this
    // const oldestUnanswered = Math.min(parseInt(oldestUnansweredFromUpdate.id), start);
    const oldestUnanswered = oldestUnansweredFromUpdate.id;
    const { error } = await saveMetadata({ oldest_unanswered_question: `${oldestUnanswered}` });

    if (error) {
        logger?.error({ error, oldest_unanswered_id: oldestUnanswered }, `Unable to save oldest unanswered question (${oldestUnanswered}) to metadata`);
    } else {
        logger?.info({ oldest_unanswered_id: oldestUnanswered }, `Successfully updated metadata with oldest unanswered question (${oldestUnanswered})`);
    }
}
