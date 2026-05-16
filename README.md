# TypeScript CLI Starter

A polished TypeScript CLI starter for building Node.js 24+ command-line tools with pnpm 11+, Commander.js, typed environment validation, Vitest testing, Biome formatting, and a clean developer experience.

Use this repo when you want a practical Node.js CLI template that is still easy to understand. It includes a working `ts-template` command, production build output, JSON-friendly command responses, safe environment handling, and tests that show how to keep CLI behavior reliable.

## Features

- TypeScript CLI starter built for Node.js 24+
- Public `ts-template` binary with real commands
- Commander.js command routing with helpful `--help` output
- Typed env validation with `zod` and `dotenv`
- Safe public config output that never prints unrelated secrets
- Rich terminal output with `@clack/prompts` and `picocolors`
- Fast local development with `tsx`
- Vitest unit tests for command behavior and error paths
- Biome for formatting, linting, and import organization
- Clean `dist` build with declarations and source maps

## Requirements

- Node.js 24 or newer
- pnpm 11 or newer

Check your local versions:

```sh
node --version
pnpm --version
```

## Quick Start

Clone the template, install dependencies, and run the CLI in development mode:

```sh
git clone https://github.com/sajaddp/typescript-template.git
cd typescript-template
pnpm install
cp .env.example .env
pnpm dev -- --help
```

Run the sample commands:

```sh
pnpm dev -- hello Sajad
pnpm dev -- env
pnpm dev -- env --json
pnpm dev -- doctor
pnpm dev -- doctor --json
```

Build and run the compiled CLI:

```sh
pnpm build
node dist/cli.js --help
node dist/cli.js hello Ada
```

## CLI Usage

The package exposes a `ts-template` binary after build or package installation.

```sh
ts-template --help
ts-template hello [name]
ts-template env [--json]
ts-template doctor [--json]
```

### `hello [name]`

Prints a friendly greeting and demonstrates the human-readable CLI style.

```sh
pnpm dev -- hello Sajad
pnpm dev -- hello Sajad --json
```

### `env`

Validates public environment configuration and prints only safe values.

```sh
pnpm dev -- env
pnpm dev -- env --json
```

The command reads only:

- `APP_NAME`
- `LOG_LEVEL`

It does not print unrelated variables such as tokens, passwords, or secrets.

### `doctor`

Checks whether the local environment matches the intended Node.js CLI template workflow.

```sh
pnpm dev -- doctor
pnpm dev -- doctor --json
```

The doctor report checks:

- Node.js version is 24 or newer
- pnpm 11+ is being used when command metadata is available
- public environment values pass validation

## Environment Configuration

Create a local `.env` file from the example:

```sh
cp .env.example .env
```

Default values:

```env
APP_NAME="ts-template"
LOG_LEVEL="info"
```

Allowed `LOG_LEVEL` values:

- `debug`
- `info`
- `warn`
- `error`

Environment validation lives in `src/config/env.ts`. The schema is intentionally small so it is easy to extend when you add real app settings.

## Project Structure

```txt
.
├── src/
│   ├── cli.ts              # Executable CLI entrypoint
│   ├── index.ts            # Public exports and Commander.js program setup
│   ├── commands/           # Individual CLI command handlers
│   ├── config/             # Typed environment validation
│   └── lib/                # Shared CLI context and output helpers
├── .github/
│   └── workflows/          # CI and npm Trusted Publishing workflows
├── docs/
│   └── release.md          # npm Trusted Publishing release guide
├── tests/
│   └── cli.test.ts         # Vitest coverage for env, routing, JSON, failures
├── scripts/
│   └── mark-bin-executable.mjs
│                          # Marks the compiled bin as executable after build
├── .editorconfig           # Shared editor formatting defaults
├── .env.example            # Safe public env example
├── .node-version           # Node.js major version for local tools and CI
├── biome.json              # Formatter and linter config
├── package.json            # Scripts, dependencies, bin, and package metadata
├── pnpm-lock.yaml          # Locked dependency graph
├── pnpm-workspace.yaml     # pnpm build-script policy for trusted tooling
└── tsconfig.json           # Focused Node.js 24 CLI TypeScript config
```

## Development Workflow

Use these commands during day-to-day development:

```sh
pnpm dev -- --help
pnpm check
pnpm typecheck
pnpm test
pnpm lint
pnpm format
```

## Testing

This starter uses Vitest for fast TypeScript tests. The current test suite covers:

- default environment loading
- invalid environment values
- `env --json` output
- failure exit codes
- `hello --json`
- `doctor --json`
- old Node.js version detection

Run the suite:

```sh
pnpm test
```

## Build

Compile TypeScript into `dist`:

```sh
pnpm build
```

The build emits:

- JavaScript files
- Type declaration files
- source maps

Run the compiled CLI:

```sh
node dist/cli.js --help
```

## Local Binary Testing

After building, link the package locally if you want to test the real `ts-template` command:

```sh
pnpm build
pnpm link --global
ts-template --help
ts-template doctor
```

Unlink when finished:

```sh
pnpm unlink --global @sajaddp/typescript-template
```

## Customization Guide

### Rename the CLI

Update these places:

- `package.json` `bin`
- `src/index.ts` `CLI_NAME`
- README command examples

Then rebuild:

```sh
pnpm build
```

### Add a New Command

1. Create a new file in `src/commands`.
2. Export a command runner that accepts options and `CliContext`.
3. Register it in `src/index.ts`.
4. Add Vitest coverage in `tests/cli.test.ts`.
5. Document the command in this README.

Keep command handlers easy to test by writing to the injected `stdout` and `stderr` streams instead of using `console.log` directly.

#### Practical Example: Add `status`

This example adds a `status` command with both human-readable and JSON output.

Create `src/commands/status.ts`:

```ts
import type { CliContext } from "../lib/context.js";
import { writeLine } from "../lib/context.js";
import { renderJson } from "../lib/output.js";

type StatusOptions = {
  json?: boolean;
};

type StatusPayload = {
  ok: true;
  service: string;
  status: "ready";
};

export const createStatusPayload = (): StatusPayload => ({
  ok: true,
  service: "ts-template",
  status: "ready",
});

export const runStatusCommand = (
  options: StatusOptions,
  context: CliContext,
): number => {
  const payload = createStatusPayload();

  if (options.json) {
    renderJson(context, payload);
    return 0;
  }

  writeLine(context.stdout, `${payload.service}: ${payload.status}`);
  return 0;
};
```

Register it in `src/index.ts`:

```ts
import { runStatusCommand } from "./commands/status.js";
```

Export it with the other command helpers:

```ts
export { runStatusCommand } from "./commands/status.js";
```

Add the command inside `createProgram`, next to the existing commands:

```ts
program
  .command("status")
  .description("Show whether the CLI is ready.")
  .option("--json", "Print machine-readable JSON output.")
  .action((options: JsonOption) => {
    throwOnFailure(
      runStatusCommand(
        {
          json: Boolean(options.json),
        },
        context,
      ),
    );
  });
```

Add a Vitest case in `tests/cli.test.ts`:

```ts
it("reports status as JSON", async () => {
  const io = createTestIo();

  const exitCode = await runCli(["node", "ts-template", "status", "--json"], {
    ...io,
    env: {},
  });

  expect(exitCode).toBe(0);
  expect(JSON.parse(io.stdout.toString())).toEqual({
    ok: true,
    service: "ts-template",
    status: "ready",
  });
});
```

Run it during development:

```sh
pnpm dev -- status
pnpm dev -- status --json
pnpm test
```

Build and smoke test the compiled CLI:

```sh
pnpm build
node dist/cli.js status
node dist/cli.js status --json
```

### Add More Env Values

1. Add the variable to `.env.example`.
2. Extend `appEnvSchema` in `src/config/env.ts`.
3. Update tests for defaults, valid values, and invalid values.
4. Decide whether the value is safe to show in the `env` command.

Do not print secrets in human-readable output or JSON output unless that is the explicit purpose of your CLI.

## Release Checklist

Target release version: `2.1.0`.

Before publishing or tagging a release:

```sh
pnpm check
pnpm build
pnpm smoke:dist
npm pack --dry-run
```

The `pack:dry` script also builds and inspects the npm package:

```sh
pnpm pack:dry
```

## Publishing

The selected npm package name is `@sajaddp/typescript-template`. The package keeps the installed CLI binary name as `ts-template`.

Automated publishing is prepared through GitHub Releases and npm Trusted Publishing with GitHub Actions OIDC. No `NPM_TOKEN` is required, and no long-lived npm token should be added to GitHub Secrets.

Publishing is handled by `.github/workflows/publish.yml` after the npm Trusted Publisher is configured on npmjs.com. See `docs/release.md` for the full release steps for version `2.1.0`.

## Troubleshooting

### `process` is not typed

Make sure `@types/node` is installed and `types: ["node"]` exists in `tsconfig.json`.

### `ts-template` is not found

Build first, then use the compiled file directly:

```sh
pnpm build
node dist/cli.js --help
```

For a real binary command, link the package globally with `pnpm link --global`.

### Env validation fails

Check `.env` and use supported values:

```env
APP_NAME="ts-template"
LOG_LEVEL="info"
```

Then run:

```sh
pnpm dev -- env
```

### JSON output is needed for automation

Use `--json` on commands designed for scripting:

```sh
pnpm dev -- env --json
pnpm dev -- doctor --json
```

## License

Released under the MIT License.
