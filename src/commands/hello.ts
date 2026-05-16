import type { AppEnv } from "../config/env.js";
import { loadEnv } from "../config/env.js";
import type { CliContext } from "../lib/context.js";
import {
  renderError,
  renderIntro,
  renderJson,
  renderNote,
  renderOutro,
} from "../lib/output.js";

type HelloOptions = {
  json?: boolean;
  name?: string;
};

type HelloPayload = {
  appName: string;
  greeting: string;
  logLevel: AppEnv["LOG_LEVEL"];
  nextSteps: string[];
};

export const createHelloPayload = (
  name: string | undefined,
  env: AppEnv,
): HelloPayload => {
  const displayName = name?.trim() || "developer";

  return {
    appName: env.APP_NAME,
    greeting: `Hello, ${displayName}!`,
    logLevel: env.LOG_LEVEL,
    nextSteps: [
      "Run ts-template doctor to verify your setup.",
      "Edit src/commands/hello.ts to customize your first command.",
    ],
  };
};

export const runHelloCommand = (
  options: HelloOptions,
  context: CliContext,
): number => {
  const envResult = loadEnv(context.env);

  if (!envResult.ok) {
    if (options.json) {
      renderJson(context, {
        issues: envResult.issues,
        ok: false,
      });
    } else {
      renderError(context, "Invalid environment", envResult.issues);
    }

    return 1;
  }

  const payload = createHelloPayload(options.name, envResult.env);

  if (options.json) {
    renderJson(context, {
      ok: true,
      ...payload,
    });
    return 0;
  }

  renderIntro(context, payload.appName);
  renderNote(context, "CLI starter", [
    payload.greeting,
    `Log level: ${payload.logLevel}`,
    ...payload.nextSteps,
  ]);
  renderOutro(context, "Ready to build.");

  return 0;
};
