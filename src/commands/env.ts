import { loadEnv } from "../config/env.js";
import type { CliContext } from "../lib/context.js";
import {
  renderError,
  renderIntro,
  renderJson,
  renderNote,
  renderOutro,
} from "../lib/output.js";

type EnvOptions = {
  json?: boolean;
};

export const runEnvCommand = (
  options: EnvOptions,
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

  if (options.json) {
    renderJson(context, {
      env: envResult.env,
      ok: true,
    });
    return 0;
  }

  renderIntro(context, "Environment");
  renderNote(context, "Loaded values", [
    `APP_NAME: ${envResult.env.APP_NAME}`,
    `LOG_LEVEL: ${envResult.env.LOG_LEVEL}`,
    "Secret values are intentionally never displayed.",
  ]);
  renderOutro(context, "Environment is valid.");

  return 0;
};
