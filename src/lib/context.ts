import type { Writable } from "node:stream";

export type CliContext = {
  env: NodeJS.ProcessEnv;
  stderr: Writable;
  stdout: Writable;
};

export const createCliContext = (
  overrides: Partial<CliContext> = {},
): CliContext => ({
  env: process.env,
  stderr: process.stderr,
  stdout: process.stdout,
  ...overrides,
});

export const writeLine = (stream: Writable, value = ""): void => {
  stream.write(`${value}\n`);
};
