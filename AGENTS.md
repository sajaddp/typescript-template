# Agent Guide

Use this guide when working on this repository with Codex or any other AI coding agent.

## Project Identity

This repository is a lightweight TypeScript CLI starter for Node.js 24+ and pnpm 11+.

- Public CLI name: `ts-template`
- Package name: `@sajaddp/typescript-template`
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
- `scripts/`: build, cleanup, and npm package validation helpers.
- `tests/cli.test.ts`: Vitest coverage for env parsing, routing, JSON output, and failure paths.
- `.github/workflows/ci.yml`: GitHub Actions workflow for install, checks, and build.
- `.github/workflows/publish.yml`: npm Trusted Publishing workflow triggered by published GitHub Releases.
- `.node-version`: Node.js version used by local tools and CI.
- `.editorconfig`: editor defaults for consistent whitespace and newlines.
- `README.md`: public user-facing documentation.
- `CONTRIBUTING.md`: contributor workflow and repository rules.
- `docs/development.md`: local development workflow and quality gates.
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
- Keep `pnpm verify` as the local quality gate when changing scripts, package metadata, build output, or public docs.

## Publishing Rules

- `.github/workflows/publish.yml` is the only publish workflow.
- Publishing uses npm Trusted Publishing with GitHub Actions OIDC.
- Never add `NPM_TOKEN` or long-lived npm tokens to this repository.
- Do not run `npm publish` unless the user explicitly instructs it in a future task.
- Keep package docs aligned across `package.json`, `CHANGELOG.md`, `README.md`, and `docs/release.md`.
- The prepared release version for this task is `2.1.0`.

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
pnpm check
pnpm fix
pnpm lint
pnpm typecheck
pnpm typecheck:watch
pnpm test
pnpm test:watch
pnpm build
node dist/cli.js --help
node dist/cli.js hello
node dist/cli.js env --json
node dist/cli.js doctor --json
pnpm smoke:dist
pnpm pack:check
npm pack --dry-run
pnpm pack:dry
pnpm verify
```

For a doctor check that simulates pnpm 11 metadata:

```sh
npm_config_user_agent='pnpm/11.1.2 npm/? node/v24.0.0' node dist/cli.js doctor --json
```

## Extra Local Rule

If Laravel code is ever introduced in this workspace, never use `uses(TestCase::class, RefreshDatabase::class)`.
