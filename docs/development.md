# Development Guide

Use this guide when changing the CLI, tests, package metadata, or release workflow.

## Prerequisites

- Node.js 24 or newer
- pnpm 11 or newer

Install dependencies from the lockfile:

```sh
pnpm install --frozen-lockfile
```

## Common Commands

| Task | Command |
| --- | --- |
| Show CLI help in development | `pnpm dev:help` |
| Run the sample greeting | `pnpm dev:hello` |
| Check public env output | `pnpm dev:env` |
| Check local toolchain readiness | `pnpm dev:doctor` |
| Run tests once | `pnpm test` |
| Run tests in watch mode | `pnpm test:watch` |
| Typecheck once | `pnpm typecheck` |
| Typecheck in watch mode | `pnpm typecheck:watch` |
| Format and apply safe Biome fixes | `pnpm fix` |
| Remove generated artifacts | `pnpm clean` |
| Run the full local gate | `pnpm verify` |

## Quality Gate

Run this before opening a pull request or preparing a release:

```sh
pnpm verify
```

`pnpm verify` runs:

- `pnpm check`
- `pnpm build`
- `pnpm smoke:dist`
- `pnpm pack:check`

The package check builds a dry-run npm tarball, confirms the package name and version, checks the required public files, rejects local-only files, and verifies that `dist/cli.js` is executable with the Node.js shebang.

## Adding a Command

1. Add a handler in `src/commands/`.
2. Register it in `src/index.ts`.
3. Export any public helper from `src/index.ts` if tests or consumers need it.
4. Write tests in `tests/cli.test.ts`.
5. Document the command in `README.md`.
6. Mention the workflow or behavior change in `CHANGELOG.md`.

Command handlers should write through the injected `CliContext` streams instead of direct `console.log` calls.

## Environment Values

Environment parsing lives in `src/config/env.ts`.

When adding an environment value:

1. Add a safe example to `.env.example`.
2. Update the zod schema.
3. Decide whether the value is safe to display.
4. Add tests for defaults, valid values, invalid values, and secret-safe output.
5. Update the README configuration section.

Never include unrelated secrets in CLI output.

## Package Checks

Use these commands when changing package metadata, build output, or release files:

```sh
pnpm build
pnpm smoke:dist
pnpm pack:check
npm pack --dry-run
```

The package should include generated `dist` files, public metadata, README, changelog, license text, and `.env.example`. It should not include `.env`, `.github`, `src`, `tests`, `node_modules`, coverage, or lockfiles.
