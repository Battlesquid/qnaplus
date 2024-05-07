import { config } from "@qnaplus/config"
import pino from "pino"

export const getLoggerInstance = () => {
    return pino({
        transport: {
            targets: [
                {
                    target: "pino-parseable",
                    options: {
                        endpoint: config.getenv("PARSEABLE_ENDPOINT"),
                        stream: config.getenv("PARSEABLE_STREAM"),
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
