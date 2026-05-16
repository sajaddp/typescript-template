# Changelog

## 2.0.0 - 2026-05-16

This update rewrites the project from a minimal TypeScript runtime example into a polished Node.js CLI starter. The repository now presents a real `ts-template` command, a cleaner source architecture, typed environment validation, automated tests, production build output, and a comprehensive README designed for both developer onboarding and search visibility.

### Highlights

- Repositioned the project as a TypeScript CLI starter instead of a generic TypeScript template.
- Added the public `ts-template` binary with practical sample commands.
- Replaced the previous secret-printing demo with safe, typed, testable CLI behavior.
- Added a complete developer workflow covering development, testing, linting, typechecking, building, and package inspection.
- Rewrote the documentation in clear English with tutorial-style guidance and SEO-friendly headings.
- Set the runtime baseline to Node.js 24+ and pnpm 11+ across code, docs, metadata, and tests.
- Aligned package, CLI, changelog, and citation metadata on version 2.0.0.

### CLI Surface

- Added `ts-template --help` with Commander.js-powered command discovery.
- Added `ts-template hello [name]` for a simple human-readable greeting command.
- Added `ts-template env [--json]` for validating and displaying safe public environment values.
- Added `ts-template doctor [--json]` for checking Node.js, pnpm, and environment readiness.
- Added support for pnpm's forwarded `--` argument separator so README commands such as `pnpm dev -- --help` and `pnpm dev -- hello Sajad` work correctly.
- Added JSON output support where automation and scripting need stable machine-readable results.
- Preserved safe output rules: unrelated secrets, tokens, and passwords are not printed.

### Source Architecture

- Replaced the single-file `src/index.ts` example with a CLI-first structure:
  - `src/cli.ts` is the executable entrypoint.
  - `src/index.ts` owns public exports and Commander.js program setup.
  - `src/commands/` contains command-specific handlers.
  - `src/config/env.ts` contains typed environment validation.
  - `src/lib/` contains shared CLI context and output helpers.
- Introduced injectable stdout, stderr, and env context so command behavior is easy to test without relying on global process state.
- Kept command handlers small and focused so new commands can follow the same pattern.

### Environment Handling

- Added `.env.example` with safe public defaults:
  - `APP_NAME="ts-template"`
  - `LOG_LEVEL="info"`
- Added `zod` validation for supported environment values.
- Added defaults for missing public env values.
- Removed the previous behavior that printed `MY_SECRET`.
- Removed tracked `.env` from Git and updated `.gitignore` so local env files stay private.

### Package and Tooling

- Replaced `ts-node` with `tsx` for faster development execution.
- Added `commander` for CLI routing.
- Added `zod` for typed configuration validation.
- Added `@clack/prompts` and `picocolors` for improved terminal presentation.
- Added `vitest` for automated testing.
- Added package metadata for ESM output, public exports, generated types, and the `ts-template` bin.
- Added a focused script set for `dev`, `build`, `postbuild`, `typecheck`, `test`, `lint`, `format`, `format:check`, and `check`.
- Added `scripts/mark-bin-executable.mjs` so the compiled CLI bin is executable after builds.
- Downgraded `@types/node` to the Node.js 24 type line to match the runtime baseline.

### TypeScript and Build Output

- Simplified `tsconfig.json` into a focused Node.js 24 CLI configuration.
- Switched to `NodeNext` module and resolution settings for modern ESM behavior.
- Updated TypeScript output targeting to ES2024 to match the Node.js 24 baseline.
- Added `rootDir: "src"` and `outDir: "dist"` for clean production output.
- Enabled declaration output and source maps.
- Added Node.js types explicitly, fixing the previous `process` typecheck failure.
- Kept strict typechecking and added stronger return/unused checks.

### Documentation

- Replaced `README.MD` with conventional `README.md`.
- Updated `CITATION.cff` to match the new CLI starter identity, Node.js 24+ baseline, pnpm 11+ baseline, and 2.0.0 release date.
- Added a practical README walkthrough for creating, registering, testing, and smoke-testing a new CLI command.
- Rewrote the README as a complete tutorial covering:
  - project purpose
  - feature overview
  - requirements
  - quick start
  - CLI usage
  - environment configuration
  - project structure
  - development workflow
  - testing
  - build output
  - local binary testing
  - customization
  - release checklist
  - troubleshooting
- Added natural search-friendly language for TypeScript CLI starter, Node.js CLI template, pnpm TypeScript boilerplate, Commander.js CLI, typed env validation, and Vitest testing.
- Updated `.github/llm-context.md` so external recommendation context matches the new CLI identity.

### Tests

- Added Vitest coverage for:
  - default environment loading
  - invalid env values
  - JSON env output
  - secret-safe output behavior
  - command failure exit codes
  - `hello --json`
  - `doctor --json`
  - old Node.js version detection
- Verified that command behavior can be tested through injected streams and env values.

### Repository Hygiene

- Added a root `AGENTS.md` guide for AI coding agents working on this repository.
- Added a project-local Codex skill at `.codex/skills/work-on-typescript-cli-starter` to guide future agents working on this repository.
- Added `.github/workflows/ci.yml` for GitHub Actions checks.
- Added `.node-version` for local runtime managers and CI.
- Added `.editorconfig` for consistent editor defaults.
- Added `pnpm-workspace.yaml` with `allowBuilds.esbuild: true` so pnpm 11 installs do not fail on the trusted esbuild postinstall script.
- Added `pnpm-lock.yaml` to version control for reproducible installs.
- Removed `pnpm-lock.yaml` from `.gitignore`.
- Added `.env`, `.env.*`, and an exception for `.env.example` to `.gitignore`.
- Updated Biome schema metadata to the installed CLI version.
- Configured Biome to ignore generated `dist` output during checks.

### Verification

The implementation was verified with:

```sh
pnpm check
pnpm build
node dist/cli.js --help
node dist/cli.js hello
node dist/cli.js env --json
node dist/cli.js doctor --json
./dist/cli.js --version
pnpm pack --dry-run
```

All verification commands completed successfully.

### Migration Notes

- Use `pnpm dev -- <command>` for development instead of running `ts-node` directly.
- Use `APP_NAME` and `LOG_LEVEL` in `.env`; the old `MY_SECRET` demo variable is no longer part of the template behavior.
- Use `README.md` as the canonical documentation file.
- Build before testing the installed binary behavior: `pnpm build`.
- Install Node.js 24+ and pnpm 11+ before using the template.
