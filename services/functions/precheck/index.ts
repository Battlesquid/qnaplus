import { Hono } from "hono";
import { getScrapingClient } from "vex-qna-archiver";

const app = new Hono();
app.get("/", async (ctx) => {
    const program = ctx.req.param("program");
    const season = ctx.req.param("season");
    const id = ctx.req.param("id");
    if (program === undefined || season === undefined || id === undefined) {
        return new Response("", { status: 400 });
    }
    const client = getScrapingClient();
    const response = await client.fetch(`https://robotevents.com/${program}/${season}/QA/${id}`);
    return new Response("", { status: response.statusCode });
});