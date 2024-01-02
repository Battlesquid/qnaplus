import { Logger } from "pino";

export const partitionSettledPromises = <ResolvedType, OriginalType>(original: OriginalType[], settled: PromiseSettledResult<ResolvedType>[], logger?: Logger): [ResolvedType[], OriginalType[]] => {
    const childLogger = logger?.child({ label: "partitionSettledPromises" });
    const resolved: ResolvedType[] = [];
    const rejected: OriginalType[] = [];
    for (let i = 0; i < settled.length; i++) {
        const job = settled[i];
        if (job.status === "fulfilled") {
            resolved.push(job.value);
        } else {
            rejected.push(original[i]);
        }
    }
    childLogger?.trace(`${resolved.length} succeeded, ${rejected.length} failed.`);
    return [resolved, rejected];
}
