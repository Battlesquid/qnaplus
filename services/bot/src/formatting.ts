import { ChangeEvent, ChangeQuestion, ChangeTypeMap } from "@qnaplus/store";
import { ColorResolvable, EmbedBuilder, bold, codeBlock, hyperlink } from "discord.js";
import { chunk } from "./util/chunk";

const ProgramColorMap: Record<string, ColorResolvable> = {
    V5RC: "#f54242",
    VURC: "#8a42f5",
    VAIRC: "#42f569",
    VIQRC: "#4290f5",
    judging: "#f5ad42"
}

const baseEmbedDescription = ({ author, askedTimestamp, title, url }: ChangeQuestion) => {
    return `Asked by ${author} on ${askedTimestamp}\n${bold("Question")}: ${hyperlink(title, url)}`
}

type ChangeFormatMap = {
    [P in ChangeEvent]: (embed: EmbedBuilder, question: ChangeTypeMap[P]) => void;
}

const embedFormatter: ChangeFormatMap = {
    answered(embed, q) {
        embed
            .setTitle(`New ${q.program} Q&A response`)
            .setDescription(baseEmbedDescription(q));
    },
    answer_edited(embed, q) {
        const description = baseEmbedDescription(q);

        const diffStrs = q.diff
            .filter(p => p.added || p.removed)
            .map(p => p.added ? `+${p.value}` : `-${p.value}`);
        for (let i = 0; i < diffStrs.length; i++) {
            const nextIdx = Math.min(i + 1, diffStrs.length - 1);
            const expected = ["-", "+"][i % 2];
            if (!diffStrs[i].startsWith(expected)) {
                diffStrs.splice(nextIdx, 0, "");
                i++;
            }
        }

        const diffBlocks = chunk(diffStrs, 2)
            .map(c => codeBlock("diff", c.join("\n")))
            .join("\n");

        embed
            .setTitle(`${q.program} Q&A response edited`)
            .setDescription(`${description}\n${diffBlocks}`);
    }
}

export const buildQuestionEmbed = (question: ChangeQuestion) => {
    const { program, tags } = question;
    const base = new EmbedBuilder()
        .setColor(ProgramColorMap[program])
        .setFooter({ text: tags.length > 0 ? `🏷️ ${tags.join(", ")}` : "No tags" });
    switch (question.changeType) {
        case "answer_edited":
            embedFormatter["answer_edited"](base, question);
            break;
        case "answered":
            embedFormatter["answered"](base, question);
            break;
        default:
            ((_: never) => { })(question);
    }
    return base;
}
