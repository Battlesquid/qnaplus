import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getScrapingClient } from "npm:vex-qna-archiver";

import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const program = url.searchParams.get("program");
  const season = url.searchParams.get("season");
  const id = url.searchParams.get("id");

  if (program === undefined || season === undefined || id === undefined) {
    return new Response("", { status: 400, headers: corsHeaders });
  }
  const client = getScrapingClient();
  const response = await client.fetch(
    `https://robotevents.com/${program}/${season}/QA/${id}`,
  );

  return new Response(`RobotEvents: ${response.statusCode}`, {
    status: response.statusCode,
    headers: corsHeaders,
  });
});
