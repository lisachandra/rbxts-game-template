import { execSync } from "node:child_process";
import fs from "node:fs";

const pattern = process.argv[2] ?? "";

if (!pattern) {
	console.log("emulator");
	process.exit(0);
}

const configPath = "jest.config.ts";
if (!fs.existsSync(configPath)) {
	console.error(`Config file not found: ${configPath}`);
	process.exit(1);
}

const config = fs.readFileSync(configPath, "utf8");

function getList(name) {
	const start = config.indexOf(`const ${name}`);
	if (start === -1) {
		return [];
	}

	const openBracket = config.indexOf("[", start);
	if (openBracket === -1) {
		return [];
	}

	const closeBracket = config.indexOf("];", openBracket);
	if (closeBracket === -1) {
		return [];
	}

	const content = config.slice(openBracket, closeBracket);
	const list = [];
	for (const match of content.matchAll(/"([^"]+)"/g)) {
		list.push(match[1]);
	}

	return list;
}

const reeParityPaths = new Set(getList("reeParityPaths"));
const slowTestPaths = new Set(getList("slowTestPaths"));

let allSpecs = [];
try {
	const output = execSync(
		'git ls-files --cached --others --exclude-standard "src/**/*.spec.ts" "src/**/*.spec.tsx"',
		{
			encoding: "utf8",
			stdio: ["ignore", "pipe", "ignore"],
		},
	);
	allSpecs = output
		.trim()
		.split(/\r?\n/)
		.map((s) => s.split("\\").join("/"))
		.filter(Boolean);
} catch {
	console.error("Failed to list spec files via git ls-files");
	process.exit(1);
}

let matcher;
try {
	matcher = new RegExp(pattern);
} catch {
	matcher = {
		test: (s) => s.includes(pattern),
	};
}

const matched = [];
for (const file of allSpecs) {
	const instance = file
		.replace(/^src\//, "")
		.replace(/\.tsx?$/, "")
		.replace(/\/index(\.spec)/, "/init$1");
	if (matcher.test(file) || matcher.test(instance)) {
		matched.push(file);
	}
}

if (matched.length === 0) {
	console.log("emulator");
	process.exit(0);
}

let hasRee = false;
let hasSlow = false;
let hasStd = false;

for (const file of matched) {
	if (reeParityPaths.has(file)) {
		hasRee = true;
	} else if (slowTestPaths.has(file)) {
		hasSlow = true;
	} else {
		hasStd = true;
	}
}

if (hasRee && (hasSlow || hasStd)) {
	console.error(
		`Pattern "${pattern}" matches both ree-parity unsupported specs and standard/slow specs. Narrow pattern to target a specific spec.`,
	);
	process.exit(1);
}

if (hasRee) {
	console.log("studio");
} else {
	console.log("emulator");
}
