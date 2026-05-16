import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const packageJson = JSON.parse(
  readFileSync(join(root, "package.json"), "utf8"),
);

const output = execFileSync("npm", ["pack", "--json", "--dry-run"], {
  cwd: root,
  encoding: "utf8",
  stdio: ["ignore", "pipe", "inherit"],
});

const jsonStart = output.indexOf("[");

if (jsonStart === -1) {
  throw new Error("npm pack did not return JSON output.");
}

const [pack] = JSON.parse(output.slice(jsonStart));
const files = pack.files.map((file) => file.path);
const fileSet = new Set(files);
const errors = [];

const requiredFiles = [
  ".env.example",
  "CHANGELOG.md",
  "LICENSE",
  "README.md",
  "dist/cli.d.ts",
  "dist/cli.js",
  "dist/index.d.ts",
  "dist/index.js",
  "package.json",
];

const forbiddenExactFiles = [".env", "pnpm-lock.yaml"];
const forbiddenPrefixes = [
  ".git/",
  ".github/",
  "coverage/",
  "node_modules/",
  "src/",
  "tests/",
];

if (pack.name !== packageJson.name) {
  errors.push(`Expected package name ${packageJson.name}, found ${pack.name}.`);
}

if (pack.version !== packageJson.version) {
  errors.push(
    `Expected package version ${packageJson.version}, found ${pack.version}.`,
  );
}

for (const file of requiredFiles) {
  if (!fileSet.has(file)) {
    errors.push(`Required package file is missing: ${file}.`);
  }
}

for (const file of files) {
  if (
    forbiddenExactFiles.includes(file) ||
    forbiddenPrefixes.some((prefix) => file.startsWith(prefix))
  ) {
    errors.push(`Forbidden package file is included: ${file}.`);
  }
}

const cliFile = pack.files.find((file) => file.path === "dist/cli.js");

if (!cliFile || (cliFile.mode & 0o111) === 0) {
  errors.push("dist/cli.js must be executable in the npm package.");
}

const cliSource = readFileSync(join(root, "dist/cli.js"), "utf8");

if (!cliSource.startsWith("#!/usr/bin/env node")) {
  errors.push("dist/cli.js must start with the Node.js shebang.");
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`Package check failed: ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Package check passed: ${pack.filename} (${pack.entryCount} files).`,
  );
}
