import { config } from "@qnaplus/config";

export const asEnvironmentResource = (resource: string) => {
    return config.getenv("NODE_ENV") === "development"
        ? `${resource}.development`
        : `${resource}.production`;
}

export const QnaplusTables = {
    Questions: "questions",
    Metadata: "metadata",
    RenotifyQueue: "renotify_queue",
}

export const QnaplusBuckets = {
    Data: "data"
}

export const QnaplusEvents = {
    RenotifyQueueFlush: "renotify_queue_flush"
}

export const QnaplusChannels = {
    DbChanges: "db-changes"
}