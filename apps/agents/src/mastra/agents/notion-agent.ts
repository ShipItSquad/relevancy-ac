import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { MCPClient } from "@mastra/mcp";
import path from "node:path";
import { createRequire } from "node:module";
import { config } from "dotenv";

config();

const nodeRequire = createRequire(import.meta.url);
const notionMcpCli = path.join(
	path.dirname(nodeRequire.resolve("@notionhq/notion-mcp-server/package.json")),
	"bin/cli.mjs",
);

const NOTION_API_KEY = process.env.NOTION_API_KEY!;
const NOTION_VERSION = process.env.NOTION_VERSION!;
const OPENAPI_MCP_HEADERS = JSON.stringify({
	Authorization: `Bearer ${NOTION_API_KEY}`,
	"Notion-Version": NOTION_VERSION,
});
// Initialize MCP Client to connect to Notion MCP server
const notionMcp = new MCPClient({
	id: "notion-mcp-client",
	servers: {
		notion: {
			command: process.execPath,
			args: [notionMcpCli],
			env: {
				OPENAPI_MCP_HEADERS,
			},
		},
	},
});

export async function createNotionAgent() {
  const notionTools = await notionMcp.getTools();
  return new Agent({
    name: 'Notion Agent',
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
    model: 'openai/gpt-4o',
    tools: notionTools,
    memory: new Memory({
      storage: new LibSQLStore({
        url: 'file:../mastra.db',
      }),
    }),
  });
}

export const notionAgent = await createNotionAgent();
