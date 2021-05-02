import Archiver from "vex-qna-archiver";
import {ArchiverOptions} from "../types";

export const runArchiver = async (options: ArchiverOptions) => {
    if (!process.env.ROBOT_EVENTS_KEY) return;

    const archiver = new Archiver(process.env.ROBOT_EVENTS_KEY, {
        dir: options.directory,
        verbose: options?.verbose
    })

    await archiver.process(options.categories, options?.force)
}