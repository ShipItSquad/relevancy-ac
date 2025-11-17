/* global defineEventHandler, toWebRequest */
import { createHandler } from "@vercel/slack-bolt";
import { app, receiver } from "~/app";

const handler = createHandler(app, receiver);

// biome-ignore lint: Provided by Nitro runtime globals
export default defineEventHandler(async (event) => {
	// In v3 of Nitro, we will be able to use the request object directly
	// biome-ignore lint: Provided by Nitro runtime globals
	const request = toWebRequest(event);
	// Simple URL verification handling: try JSON body first, otherwise fall through
	try {
		const body = (await request.clone().json()) as {
			type?: string;
			challenge?: string;
		};
		if (
			body?.type === "url_verification" &&
			typeof body.challenge === "string"
		) {
			return new Response(JSON.stringify({ challenge: body.challenge }), {
				status: 200,
				headers: { "content-type": "application/json" },
			});
		}
	} catch {
		// Not JSON or no body; let Bolt handle the rest
	}
	return await handler(request);
});
