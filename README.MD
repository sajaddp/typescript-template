# TypeScript Template

A modern, minimal template for starting TypeScript projects on Node.js with sensible defaults and a smooth developer experience.

## Features

- TypeScript 5 with strict mode and Node LTS (22) aligned config
- Fast iteration using `ts-node` for development
- ESLint (typescript-eslint) and Prettier for consistent, high‑quality code
- Environment variables via `dotenv`
- Dependency management with `pnpm`

## Prerequisites

- Node.js 20 or 22+ (LTS recommended)
- pnpm 10+

## Quick Start

- Clone and install dependencies:

```sh
git clone https://github.com/sajaddp/typescript-template.git
cd typescript-template
pnpm i
```

- Configure environment variables:

- Create a `.env` file in the project root (if it doesn’t exist) and set:

```env
MY_SECRET="your-secret-value"
```

- Run in development mode:

```sh
pnpm dev
```

The app logs the value of `MY_SECRET` to the console.

## Scripts

- `pnpm dev`: Run the app with `ts-node` from `src/index.ts`.
- `pnpm build`: Compile TypeScript with `tsc`.
- `pnpm prettier`: Format code in `src` using Prettier.

Note: After `pnpm build`, JavaScript output is emitted alongside the `.ts` files by default. You can set `outDir` in `tsconfig.json` (e.g., `dist`) and then run `node dist/index.js`.

## Project Structure

```txt
.
├── src/
│   └── index.ts          # Entry point (example: reading an env variable)
├── eslint.config.mjs     # ESLint configuration with typescript-eslint
├── tsconfig.json         # TypeScript configuration aligned with Node 22
├── package.json          # Scripts and dependencies
├── .env                  # Local environment variables
└── README.MD
```

## Code Quality

- ESLint: Lint TypeScript/JS code

  ```sh
  pnpm exec eslint . --ext .ts
  ```

- Prettier: Enforce consistent formatting

  ```sh
  pnpm prettier
  ```

## TypeScript Settings

- Target: `es2023`
- Module/Resolution: `node16`
- Enabled: `strict: true`, `esModuleInterop: true`, `resolveJsonModule: true`

To emit compiled files into a separate directory, enable `outDir` in `tsconfig.json`.

## Troubleshooting

- Missing env value: Ensure `.env` exists and `MY_SECRET` is defined, then run with `pnpm dev`.
- Where is the build output? Without `outDir`, `.js` files are emitted next to `.ts`. Either run `node src/index.js` or configure `outDir` (e.g., `dist`) and run `node dist/index.js`.

## License

Released under the MIT License.
