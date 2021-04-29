import Archiver from "vex-qna-archiver";
import path from "path"

export const runArchiver = async (force?: boolean) => {
    // console.log(process.env.ROBOT_EVENTS_KEY)
    if (!process.env.ROBOT_EVENTS_KEY) return;

    const directory = path.resolve(__dirname, "../data");
    const archiver = new Archiver(process.env.ROBOT_EVENTS_KEY, {
        dir: directory,
        verbose: true
    })

    const categories = ["VRC", "VEXU", "VIQC", "VAIC-HS", "VAIC-U", "RADC", "Judging"];
    await archiver.process(categories, force)
}