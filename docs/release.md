# Release Guide

This repository is prepared for the `2.1.0` release of `@sajaddp/typescript-template`. The installed CLI binary remains `ts-template`.

Publishing is handled by `.github/workflows/publish.yml`. The workflow runs only when a GitHub Release is published, disables package-manager caching, validates the package, inspects the npm tarball, and then runs `npm publish`.

## npm Trusted Publisher Setup

Before creating the GitHub Release, configure npm Trusted Publishing on npmjs.com for `@sajaddp/typescript-template`.

Use these Trusted Publisher values:

- Provider: `GitHub Actions`
- Organization or user: `sajaddp`
- Repository: `typescript-template`
- Workflow filename: `publish.yml`
- Environment name: leave empty unless a GitHub deployment environment is later added

Trusted Publishing uses OIDC, so this repository must not use `NPM_TOKEN` or any long-lived npm token for publishing. The workflow grants `id-token: write` so npm can issue short-lived credentials to the authorized GitHub Actions run. For a public package published from a public GitHub repository, npm generates provenance automatically.

Do not run any publish command before the npm Trusted Publisher is configured.

## Local Validation

Run these commands before creating the GitHub Release:

```sh
pnpm install --frozen-lockfile
pnpm verify
pnpm pack:check
npm pack --dry-run
```

Review the dry-run package contents before publishing. The automated package check verifies the package name, version, required public files, forbidden local-only files, CLI shebang, and executable bin mode. The package should include the generated `dist` files, package metadata, README, changelog, license, and `.env.example`; it should not include local env files, source tests, CI files, coverage, `node_modules`, or lockfiles.

## Release Trigger

After npm Trusted Publishing is configured and local validation passes, create and publish the GitHub Release for version `2.1.0`. Publishing the GitHub Release is what triggers `.github/workflows/publish.yml`.

This guide does not require npm secrets and does not require running `npm publish` locally.
