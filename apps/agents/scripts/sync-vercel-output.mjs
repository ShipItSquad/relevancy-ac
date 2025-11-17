import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, readFileSync } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const dest = path.join(projectRoot, ".vercel", "output");

const candidates = [
	{ label: ".mastra/output", path: path.join(projectRoot, ".mastra", "output") },
	{ label: ".output/mastra", path: path.join(projectRoot, ".output", "mastra") },
];

const source = candidates.find((candidate) => existsSync(candidate.path));
let outputReady = false;

if (source) {
	rmSync(dest, { recursive: true, force: true });
	mkdirSync(path.dirname(dest), { recursive: true });
	cpSync(source.path, dest, { recursive: true });
	console.log(`Copied ${source.label} to .vercel/output for deployment.`);
	outputReady = true;
} else if (existsSync(dest)) {
	console.log("Detected existing .vercel/output directory; skipping copy.");
	outputReady = true;
}

if (!outputReady) {
	console.error(
		"Mastra build output not found. Expected one of: " +
			candidates.map((candidate) => candidate.label).join(", "),
	);
	process.exit(1);
}

ensureAdditionalNodeModules(readExtraModulesConfig());

function ensureAdditionalNodeModules(extraModules) {
	const functionsDir = path.join(dest, "functions");
	if (!existsSync(functionsDir)) {
		return;
	}

	const functionDirs = readdirSync(functionsDir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && entry.name.endsWith(".func"))
		.map((entry) => path.join(functionsDir, entry.name));

	if (functionDirs.length === 0) {
		return;
	}

	for (const funcDir of functionDirs) {
		const funcNodeModules = path.join(funcDir, "node_modules");
		for (const mod of extraModules) {
			if (!existsSync(mod.source)) {
				console.warn(`Skipping ${mod.label}; not installed in root node_modules.`);
				continue;
			}

			const destModulePath = path.join(funcNodeModules, mod.relativeDest);
			rmSync(destModulePath, { recursive: true, force: true });
			mkdirSync(path.dirname(destModulePath), { recursive: true });
			cpSync(mod.source, destModulePath, { recursive: true });
			console.log(`Ensured ${mod.label} is available in ${funcDir}.`);
		}
	}
}

function readExtraModulesConfig() {
	const configPath = path.join(projectRoot, "vercel-extra-modules.json");
	if (!existsSync(configPath)) {
		return [];
	}

	try {
		const parsed = JSON.parse(readFileSync(configPath, "utf8"));
		const entries = Array.isArray(parsed.modules) ? parsed.modules : [];
		return entries.map((entry) => ({
			label: entry.label ?? entry.source ?? entry.module,
			source: path.join(projectRoot, "node_modules", entry.path ?? entry.source ?? entry.module),
			relativeDest: entry.relativeDest ?? entry.dest ?? entry.module ?? entry.path,
		}));
	} catch (error) {
		console.warn("Failed to parse vercel-extra-modules.json:", error);
		return [];
	}
}
