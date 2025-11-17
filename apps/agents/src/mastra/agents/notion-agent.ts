import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { MCPClient } from "@mastra/mcp";
import { Memory } from "@mastra/memory";
import { config } from "dotenv";

config();
function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
}

const NOTION_MCP_URL = new URL(requireEnv("NOTION_MCP_URL"));
const NOTION_MCP_AUTH_TOKEN = requireEnv("NOTION_MCP_AUTH_TOKEN");
// Initialize MCP Client to connect to Notion MCP server
const notionMcp = new MCPClient({
	id: "notion-mcp-client",
	servers: {
		notion: {
			url: NOTION_MCP_URL,
			requestInit: {
				headers: {
					Authorization: `Bearer ${NOTION_MCP_AUTH_TOKEN}`,
				},
			},
		},
	},
});

export async function createNotionAgent() {
	const notionTools = await notionMcp.getTools();
	return new Agent({
		name: "Notion Agent",
		instructions: `
You are a helpful Notion assistant that can interact with Notion databases, pages, and content.

Your primary functions are to help users:
- Query and retrieve information from Notion databases
- Create and update pages in Notion
- Manage tasks and notes in Notion workspaces
- Search and filter Notion content

When responding:
- Always ask for clarification if the user's request is ambiguous
- Explain what actions you're taking in Notion
- Provide clear confirmation when operations are complete
- Handle errors gracefully and suggest alternatives if operations fail

Use the available tools to interact with Notion.
`,
		model: "openai/gpt-4o",
		tools: notionTools,
		memory: new Memory({
			storage: new LibSQLStore({
				url: "file:../mastra.db",
			}),
		}),
	});
}

export const notionAgent = await createNotionAgent();
