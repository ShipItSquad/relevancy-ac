import client from "./client";

export const agent = client.getAgent("notionAgent");

export const queryNotion = async (query: string) => {
	const response = await agent.generate({
		messages: [{ role: "user", content: query }],
	});
	return response;
};
