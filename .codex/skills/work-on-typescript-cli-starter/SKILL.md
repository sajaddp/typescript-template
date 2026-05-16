---
name: work-on-typescript-cli-starter
description: Project-specific workflow for maintaining the sajaddp/typescript-template repository. Use when Codex is working in this repo or is asked to change, test, document, release, or troubleshoot the `ts-template` Node.js 24+ TypeScript CLI starter with pnpm 11+, Commander.js, zod env validation, Vitest, Biome, and ESM build output.
---

# Work on TypeScript CLI Starter

## Project Shape

Treat this repository as a lightweight, opinionated TypeScript CLI starter, not a web app or framework template.

- Public CLI name: `ts-template`
- Package name: `@sajaddp/typescript-template`
- Runtime baseline: Node.js 24+ and pnpm 11+
- Module format: ESM with `NodeNext`
- Source root: `src`
- Build output: `dist`
- Main entrypoints:
  - `src/cli.ts` loads dotenv and runs the CLI.
  - `src/index.ts` exports the public API and wires Commander.js.
  - `src/commands/` contains command handlers.
  - `src/config/env.ts` owns typed env validation.
  - `src/lib/` contains shared CLI context and output helpers.

## Working Rules

- Keep changes minimal and aligned with the existing architecture.
- Preserve injected `CliContext` usage for command code; avoid direct `console.log` in command handlers.
- Keep human-readable output safe: never print unrelated secrets, tokens, passwords, or private env values.
- Keep JSON output stable and useful for automation.
- Use clear, fluent English for README, changelog, CLI descriptions, package metadata, and public-facing reports.
- Keep examples and docs aligned with `pnpm dev -- <command>` and built CLI usage via `node dist/cli.js`.
- Update `CHANGELOG.md` when a change affects public behavior, docs, scripts, requirements, package metadata, or developer workflow.
- Do not add heavy frameworks or broad abstractions unless the user explicitly asks and the change remains justified.

## Common Tasks

### Add or Change a CLI Command

1. Add or update the handler in `src/commands/`.
2. Register the command in `src/index.ts`.
3. Keep command output behind injected `stdout` and `stderr`.
4. Add or update Vitest coverage in `tests/cli.test.ts`.
5. Document the command in `README.md`.
6. Mention the public behavior change in `CHANGELOG.md`.

### Add or Change Env Values

1. Update `.env.example`.
2. Update the zod schema and types in `src/config/env.ts`.
3. Decide explicitly whether each value is safe to display in `env` output.
4. Add tests for defaults, valid values, invalid values, and secret-safe behavior.
5. Update README configuration guidance.

### Change Runtime or Tooling Baselines

1. Update `package.json` `engines`, `packageManager`, keywords, and scripts if needed.
2. Update `tsconfig.json` target/lib/display when runtime capabilities change.
3. Update `src/commands/doctor.ts` and its tests.
4. Update README prerequisites, project structure notes, and troubleshooting.
5. Update `CHANGELOG.md` and `.github/llm-context.md`.

### Documentation Work

- Keep README practical and SEO-friendly without keyword stuffing.
- Favor runnable examples over marketing copy.
- Keep the canonical example name `Sajad` in greeting examples unless the user asks otherwise.
- Use `README.md` as the canonical docs file.

## Validation

Run the narrowest relevant checks during iteration, then run the full set before finishing substantial changes:

```sh
pnpm check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
node dist/cli.js --help
node dist/cli.js hello
node dist/cli.js env --json
node dist/cli.js doctor --json
pnpm smoke:dist
npm pack --dry-run
pnpm pack:dry
```

For doctor checks that need a pnpm 11 user agent, use:

```sh
npm_config_user_agent='pnpm/11.1.2 npm/? node/v24.0.0' node dist/cli.js doctor --json
```

## Git Hygiene

- `.env` must remain untracked and ignored.
- `.env.example` and `pnpm-lock.yaml` must stay tracked.
- `pnpm-workspace.yaml` must stay tracked because it allows the trusted `esbuild` install script required by the toolchain.
- `dist/` is generated and ignored; do not stage build output unless the user explicitly asks.
- Preserve user changes in the worktree; never reset or revert unrelated edits.

## Publishing Rules

- `.github/workflows/publish.yml` is the only publish workflow.
- Publishing uses npm Trusted Publishing with GitHub Actions OIDC.
- Never add `NPM_TOKEN` or long-lived npm tokens to this repository.
- Do not run `npm publish` unless the user explicitly asks for it in a future task.
