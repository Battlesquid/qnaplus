import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getScrapingClient } from "npm:vex-qna-archiver";

import { Hono } from "jsr:@hono/hono";

const app = new Hono();

app.get("/precheck", async (ctx) => {
  const { program, season, id } = ctx.req.query();
  if (program === undefined || season === undefined || id === undefined) {
    return new Response("", { status: 400 });
  }
  const client = getScrapingClient();
  const response = await client.fetch(
    `https://robotevents.com/${program}/${season}/QA/${id}`,
  );
  return new Response("", { status: response.statusCode });
});

Deno.serve(app.fetch);
