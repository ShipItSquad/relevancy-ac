import { MastraJwtAuth } from "@mastra/auth";
import { Mastra } from "@mastra/core/mastra";
import { VercelDeployer } from "@mastra/deployer-vercel";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import { notionAgent } from "./agents/notion-agent";
import {
	completenessScorer,
	toolCallAppropriatenessScorer,
	translationScorer,
} from "./scorers/weather-scorer";

export const mastra = new Mastra({
	workflows: {},
	agents: { notionAgent },
	scorers: {
		toolCallAppropriatenessScorer,
		completenessScorer,
		translationScorer,
	},
	storage: new LibSQLStore({
		// stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
		url: ":memory:",
	}),
	logger: new PinoLogger({
		name: "Mastra",
		level: "info",
	}),
	telemetry: {
		// Telemetry is deprecated and will be removed in the Nov 4th release
		enabled: false,
	},
	observability: {
		// Enables DefaultExporter and CloudExporter for AI tracing
		default: { enabled: true },
	},
	deployer: new VercelDeployer({
		maxDuration: 299,
		memory: 1536,
	}),
	server: {
		experimental_auth: new MastraJwtAuth({
			secret: process.env.MASTRA_JWT_SECRET,
		}),
	},
});
