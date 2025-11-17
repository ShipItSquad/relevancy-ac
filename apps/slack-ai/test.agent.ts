import { encode } from "@toon-format/toon";
import { agent } from "~/lib/agents/notion";

export const testAgent = async () => {
	const response = await agent.generate({
		messages: [
			{ role: "user", content: "what are the contents in the relevancy page" },
		],
	});
	return response;
};

testAgent().then((response) => {
	const text =
		response.response.messages?.[response.response.messages.length - 1]
			?.content;
	console.log(`---- response: ${encode(text)}`);
});
