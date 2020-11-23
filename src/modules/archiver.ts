import Archiver from "vex-qna-archiver";

export default async () => {
    if (!process.env.ROBOT_EVENTS_KEY) return;
    const archiver = new Archiver(process.env.ROBOT_EVENTS_KEY, {
        dir: "../db"
    })

    const categories = ["VRC", "VEXU", "VIQC", "VAIC-HS", "VAIC-U", "RADC", "Judging"];
    for (const category of categories) {
        await archiver.processCategory(category)
    }
}