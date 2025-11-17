import { MastraClient } from "@mastra/client-js";
import { config } from "dotenv";

config();

console.log(process.env.MASTRA_SERVER_URL);
console.log(process.env.MASTRA_JWT_TOKEN);
const client = new MastraClient({
	baseUrl: process.env.MASTRA_SERVER_URL || "http://localhost:4111",
	headers: {
		Authorization: `Bearer ${process.env.MASTRA_JWT_TOKEN}`,
	},
});

export default client;
