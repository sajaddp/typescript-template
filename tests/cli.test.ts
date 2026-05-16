import { Writable } from "node:stream";
import { describe, expect, it } from "vitest";

import { loadEnv } from "../src/config/env.js";
import { createDoctorReport, runCli } from "../src/index.js";

class MemoryStream extends Writable {
  readonly chunks: string[] = [];

  override _write(
    chunk: Buffer | string,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ): void {
    this.chunks.push(chunk.toString());
    callback();
  }

  override toString(): string {
    return this.chunks.join("");
  }
}

const createTestIo = () => ({
  stderr: new MemoryStream(),
  stdout: new MemoryStream(),
});

describe("environment validation", () => {
  it("loads safe defaults when public env values are missing", () => {
    const result = loadEnv({});

    expect(result).toEqual({
      env: {
        APP_NAME: "ts-template",
        LOG_LEVEL: "info",
      },
      ok: true,
    });
  });

  it("rejects invalid log levels", () => {
    const result = loadEnv({
      LOG_LEVEL: "verbose",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.join(" ")).toContain("LOG_LEVEL");
    }
  });
});

describe("CLI routing", () => {
  it("prints env JSON without exposing unrelated secrets", async () => {
    const io = createTestIo();

    const exitCode = await runCli(["node", "ts-template", "env", "--json"], {
      ...io,
      env: {
        APP_NAME: "Demo CLI",
        LOG_LEVEL: "debug",
        MY_SECRET: "never-print-me",
      },
    });

    expect(exitCode).toBe(0);
    expect(io.stderr.toString()).toBe("");
    expect(io.stdout.toString()).not.toContain("never-print-me");
    expect(JSON.parse(io.stdout.toString())).toEqual({
      env: {
        APP_NAME: "Demo CLI",
        LOG_LEVEL: "debug",
      },
      ok: true,
    });
  });

  it("returns a failure exit code for invalid env values", async () => {
    const io = createTestIo();

    const exitCode = await runCli(["node", "ts-template", "env"], {
      ...io,
      env: {
        APP_NAME: "Demo CLI",
        LOG_LEVEL: "verbose",
      },
    });

    expect(exitCode).toBe(1);
    expect(io.stdout.toString()).toBe("");
    expect(io.stderr.toString()).toContain("Invalid environment");
  });

  it("greets a named user as JSON", async () => {
    const io = createTestIo();

    const exitCode = await runCli(
      ["node", "ts-template", "hello", "Ada", "--json"],
      {
        ...io,
        env: {
          APP_NAME: "Demo CLI",
          LOG_LEVEL: "info",
        },
      },
    );

    expect(exitCode).toBe(0);
    expect(JSON.parse(io.stdout.toString())).toMatchObject({
      appName: "Demo CLI",
      greeting: "Hello, Ada!",
      ok: true,
    });
  });

  it("accepts the pnpm run argument separator", async () => {
    const io = createTestIo();

    const exitCode = await runCli(
      ["node", "ts-template", "--", "hello", "Sajad", "--json"],
      {
        ...io,
        env: {
          APP_NAME: "Demo CLI",
          LOG_LEVEL: "info",
        },
      },
    );

    expect(exitCode).toBe(0);
    expect(JSON.parse(io.stdout.toString())).toMatchObject({
      greeting: "Hello, Sajad!",
      ok: true,
    });
  });

  it("reports doctor checks as JSON", async () => {
    const io = createTestIo();

    const exitCode = await runCli(["node", "ts-template", "doctor", "--json"], {
      ...io,
      env: {
        APP_NAME: "Demo CLI",
        LOG_LEVEL: "warn",
        npm_config_user_agent: "pnpm/11.1.2 npm/? node/v24.0.0",
      },
    });

    const report = JSON.parse(io.stdout.toString());

    expect(exitCode).toBe(0);
    expect(report.ok).toBe(true);
    expect(report.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Node.js >=24",
          status: "pass",
        }),
        expect.objectContaining({
          name: "pnpm 11+",
          status: "pass",
        }),
      ]),
    );
  });
});

describe("doctor report", () => {
  it("fails old Node.js versions", () => {
    const report = createDoctorReport(
      {
        APP_NAME: "Demo CLI",
        LOG_LEVEL: "info",
      },
      "18.19.0",
    );

    expect(report.ok).toBe(false);
    expect(report.checks).toContainEqual(
      expect.objectContaining({
        name: "Node.js >=24",
        status: "fail",
      }),
    );
  });

  it("fails old pnpm versions when detected", () => {
    const report = createDoctorReport(
      {
        APP_NAME: "Demo CLI",
        LOG_LEVEL: "info",
        npm_config_user_agent: "pnpm/10.33.3 npm/? node/v24.0.0",
      },
      "24.0.0",
    );

    expect(report.ok).toBe(false);
    expect(report.checks).toContainEqual(
      expect.objectContaining({
        name: "pnpm 11+",
        status: "fail",
      }),
    );
  });
});
