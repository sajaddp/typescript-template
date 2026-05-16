import { readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const generatedDirectories = ["coverage", "dist"];

for (const directory of generatedDirectories) {
  rmSync(join(root, directory), {
    force: true,
    recursive: true,
  });
}

for (const entry of readdirSync(root)) {
  if (entry.endsWith(".tgz")) {
    rmSync(join(root, entry), {
      force: true,
    });
  }
}
