import { onAnswered } from "@qnaplus/store";
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

