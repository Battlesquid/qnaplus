import { config } from "@qnaplus/config"
import pino, { LoggerOptions } from "pino"

export const getLoggerInstance = (stream: string, options?: LoggerOptions) => {
    return pino({
        ...options,
        transport: {
            targets: [
                {
                    target: "pino-parseable",
                    options: {
                        endpoint: config.getenv("PARSEABLE_ENDPOINT"),
                        stream,
                        auth: {
                            username: config.getenv("PARSEABLE_USERNAME"),
                            password: config.getenv("PARSEABLE_PASSWORD")
                        }
                    }
                },
                {
                    target: 'pino/file',
                    options: { destination: 1 }
                }
            ]
        }
    })
}
