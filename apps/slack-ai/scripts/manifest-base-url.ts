import fs from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

const MANIFEST_PATH = path.join(process.cwd(), "manifest.json");
const SLACK_EVENTS_PATH = "/api/slack/events";
const TRAILING_SLASHES_RE = /\/+$/;

type SlackManifest = {
	features?: {
		slash_commands?: Array<{ url: string }>;
	};
	settings?: {
		event_subscriptions?: { request_url: string };
		interactivity?: { request_url: string };
	};
};

function normalizeBaseUrl(input: string): string {
	const trimmed = input.trim();
	// Validate URL
	try {
		// Throws if invalid
		new URL(trimmed);
		// Remove trailing slash
		return trimmed.replace(TRAILING_SLASHES_RE, "");
	} catch {
		throw new Error(`BASE_URL is not a valid URL: "${input}"`);
	}
}

async function readManifest(): Promise<SlackManifest> {
	const raw = await fs.readFile(MANIFEST_PATH, "utf8");
	return JSON.parse(raw) as SlackManifest;
}

async function writeManifest(manifest: SlackManifest): Promise<void> {
	const next = `${JSON.stringify(manifest, null, 2)}\n`;
	await fs.writeFile(MANIFEST_PATH, next, "utf8");
}

function updateManifestUrls(manifest: SlackManifest, newUrl: string): void {
	if (
		manifest.features?.slash_commands &&
		Array.isArray(manifest.features.slash_commands)
	) {
		for (const cmd of manifest.features.slash_commands) {
			if (cmd && typeof cmd.url === "string") {
				cmd.url = newUrl;
			}
		}
	}
	if (manifest.settings?.event_subscriptions) {
		manifest.settings.event_subscriptions.request_url = newUrl;
	}
	if (manifest.settings?.interactivity) {
		manifest.settings.interactivity.request_url = newUrl;
	}
}

async function main(): Promise<void> {
	const baseUrl = process.env.BASE_URL;
	if (!baseUrl) {
		throw new Error("Missing BASE_URL in .env (apps/slack-ai/.env)");
	}
	const normalized = normalizeBaseUrl(baseUrl);
	const targetUrl = `${normalized}${SLACK_EVENTS_PATH}`;

	const manifest = await readManifest();
	updateManifestUrls(manifest, targetUrl);
	await writeManifest(manifest);

	console.log(`✅ Updated Slack manifest URLs to: ${targetUrl}`);
}

main().catch((err) => {
	console.error(
		"❌ Failed to update manifest base URL:",
		err instanceof Error ? err.message : String(err)
	);
	process.exitCode = 1;
});
