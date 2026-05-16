# Contributing

This repository is a focused TypeScript CLI starter. Keep changes small, testable, and aligned with the existing CLI architecture.

## Local Setup

```sh
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev:help
```

Use Node.js 24+ and pnpm 11+. The expected pnpm version is declared in `package.json`.

## Daily Workflow

```sh
pnpm dev:hello
pnpm test:watch
pnpm typecheck:watch
pnpm fix
pnpm verify
```

`pnpm verify` is the local quality gate. It runs formatting checks, linting, typechecking, tests, a fresh build, compiled CLI smoke tests, and npm package content checks.

## CLI Changes

When adding or changing a command:

1. Add or update the handler in `src/commands/`.
2. Register the command in `src/index.ts`.
3. Keep output behind the injected `CliContext` streams.
4. Add or update Vitest coverage in `tests/cli.test.ts`.
5. Update `README.md` and `CHANGELOG.md`.

Do not print unrelated secrets, tokens, passwords, or private environment values in human-readable or JSON output.

## Publishing

Do not run `npm publish` for normal development. Publishing is handled by `.github/workflows/publish.yml` after npm Trusted Publishing is configured on npmjs.com. See `docs/release.md` for release steps.
