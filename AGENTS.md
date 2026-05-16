# Agent Guide

Use this guide when working on this repository with Codex or any other AI coding agent.

## Project Identity

This repository is a lightweight TypeScript CLI starter for Node.js 24+ and pnpm 11+.

- Public CLI name: `ts-template`
- Package name: `typescript-template`
- Runtime: Node.js 24+
- Package manager: pnpm 11+
- Module system: ESM with TypeScript `NodeNext`
- Build output: `dist/`

Do not turn this project into a web app, framework template, or broad boilerplate unless the user explicitly asks.

## Repository Map

- `src/cli.ts`: executable CLI entrypoint; loads dotenv and runs the program.
- `src/index.ts`: public exports and Commander.js command registration.
- `src/commands/`: individual command handlers.
- `src/config/env.ts`: zod-based environment validation.
- `src/lib/`: shared CLI context and output helpers.
- `tests/cli.test.ts`: Vitest coverage for env parsing, routing, JSON output, and failure paths.
- `README.md`: public user-facing documentation.
- `CHANGELOG.md`: release notes and notable changes.
- `pnpm-workspace.yaml`: pnpm 11 build-script allowlist; keep `esbuild: true` unless tooling changes.
- `.codex/skills/work-on-typescript-cli-starter/SKILL.md`: deeper project-specific Codex workflow.

## Working Principles

- Use best practices with the smallest change that solves the problem.
- Follow the existing architecture before introducing new abstractions.
- Keep command handlers testable by using injected `CliContext` streams instead of direct `console.log`.
- Never print unrelated secrets, tokens, passwords, or private env values in human-readable or JSON output.
- Keep JSON output stable for automation.
- Keep public docs, CLI descriptions, changelog entries, and package metadata in clear fluent English.
- Preserve the README example name `Sajad` unless the user requests another name.
- Do not stage or commit generated `dist/` output unless the user explicitly asks.
- Keep `.env` untracked; keep `.env.example` tracked.
- Keep `pnpm-lock.yaml` tracked.

## Common Change Workflow

When adding or changing a CLI command:

1. Update or add a handler in `src/commands/`.
2. Register the command in `src/index.ts`.
3. Add or update tests in `tests/cli.test.ts`.
4. Update `README.md` command documentation.
5. Update `CHANGELOG.md` if public behavior changes.

When changing environment variables:

1. Update `.env.example`.
2. Update `src/config/env.ts`.
3. Decide whether the value is safe to display.
4. Add tests for valid, invalid, default, and secret-safe behavior.
5. Update README configuration guidance.

When changing runtime/tooling requirements:

1. Update `package.json` engines and package manager metadata.
2. Update `tsconfig.json` when runtime capabilities change.
3. Update `src/commands/doctor.ts` and related tests.
4. Update `README.md`, `CHANGELOG.md`, and `.github/llm-context.md`.

## Validation

Run targeted checks while working. For substantial changes, run:

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
node dist/cli.js --help
node dist/cli.js hello
node dist/cli.js env --json
node dist/cli.js doctor --json
pnpm pack --dry-run
```

For a doctor check that simulates pnpm 11 metadata:

```sh
npm_config_user_agent='pnpm/11.1.2 npm/? node/v24.0.0' node dist/cli.js doctor --json
```

## Extra Local Rule

If Laravel code is ever introduced in this workspace, never use `uses(TestCase::class, RefreshDatabase::class)`.
