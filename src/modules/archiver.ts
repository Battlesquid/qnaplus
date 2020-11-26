import Archiver from "vex-qna-archiver";

export const runArchiver = async (force?: boolean) => {
    if (!process.env.ROBOT_EVENTS_KEY) return;
    const archiver = new Archiver(process.env.ROBOT_EVENTS_KEY, {
        dir: "../db",
        verbose: true
    })

    const categories = ["VRC", "VEXU", "VIQC", "VAIC-HS", "VAIC-U", "RADC", "Judging"];
    await archiver.process(categories, force)

}