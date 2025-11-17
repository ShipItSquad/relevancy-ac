/* global defineEventHandler, toWebRequest */
import { createHandler } from "@vercel/slack-bolt";
import { app, receiver } from "~/app";

const handler = createHandler(app, receiver);

// biome-ignore lint: Provided by Nitro runtime globals
export default defineEventHandler(async (event) => {
	// In v3 of Nitro, we will be able to use the request object directly
	// biome-ignore lint: Provided by Nitro runtime globals
	const request = toWebRequest(event);
	// Handle Slack URL verification explicitly to return the challenge immediately
	try {
		const cloned = request.clone();
		const contentType = cloned.headers.get("content-type") || "";
		if (contentType.includes("application/json")) {
			const body = (await cloned.json()) as
				| { type?: string; challenge?: string }
				| undefined;
			if (
				body?.type === "url_verification" &&
				typeof body.challenge === "string"
			) {
				return new Response(JSON.stringify({ challenge: body.challenge }), {
					status: 200,
					headers: { "content-type": "application/json" },
				});
			}
		}
	} catch {
		// fall through to the default handler
	}
	return await handler(request);
});
