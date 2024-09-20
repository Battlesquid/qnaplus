import { RequestBuilder } from "ts-curl-impersonate";
import { corsHeaders } from "./cors";

export default {
    async fetch(request: Request): Promise<Response> {
        if (request.method === "OPTIONS") {
            return new Response("ok", { headers: corsHeaders });
        }

        const url = new URL(request.url);
        const program = url.searchParams.get("program");
        const season = url.searchParams.get("season");
        const id = url.searchParams.get("id");

        if (program === undefined || season === undefined || id === undefined) {
            return new Response("", { status: 400, headers: corsHeaders });
        }
        const response = await new RequestBuilder()
            .url(`https://robotevents.com/${program}/${season}/QA/${id}`)
            .send();

        if (response.stderr !== undefined) {
            return new Response(`RobotEvents: 500`, {
                status: 500,
                headers: corsHeaders,
            });
        }

        return new Response(`RobotEvents: ${response.details.response_code}`, {
            status: response.details.response_code,
            headers: corsHeaders,
        });
    },
};
