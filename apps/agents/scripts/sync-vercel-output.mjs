import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const dest = path.join(projectRoot, ".vercel", "output");

const candidates = [
	{ label: ".mastra/output", path: path.join(projectRoot, ".mastra", "output") },
	{ label: ".output/mastra", path: path.join(projectRoot, ".output", "mastra") },
];

const source = candidates.find((candidate) => existsSync(candidate.path));

if (source) {
	rmSync(dest, { recursive: true, force: true });
	mkdirSync(path.dirname(dest), { recursive: true });
	cpSync(source.path, dest, { recursive: true });
	console.log(`Copied ${source.label} to .vercel/output for deployment.`);
	process.exit(0);
}

if (existsSync(dest)) {
	console.log("Detected existing .vercel/output directory; skipping copy.");
	process.exit(0);
}

console.error(
	"Mastra build output not found. Expected one of: " +
		candidates.map((candidate) => candidate.label).join(", "),
);
process.exit(1);
