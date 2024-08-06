export default {
	async fetch(request: Request): Promise<Response> {
        const params = new URL(request.url).searchParams;
        const program = params.get("program");
        const season = params.get("season");
        const id = params.get("id");
        const response = await fetch(`https://robotevents.com/`)
		return new Response('Hello World!');
	},
};