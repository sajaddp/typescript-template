import { z } from "zod";

export const logLevels = ["debug", "info", "warn", "error"] as const;

export const appEnvSchema = z.object({
  APP_NAME: z
    .string()
    .trim()
    .min(1, "APP_NAME must not be empty.")
    .default("ts-template"),
  LOG_LEVEL: z.enum(logLevels).default("info"),
});

export type AppEnv = z.infer<typeof appEnvSchema>;

export type EnvValidationResult =
  | {
      env: AppEnv;
      ok: true;
    }
  | {
      issues: string[];
      ok: false;
    };

export const loadEnv = (
  source: NodeJS.ProcessEnv = process.env,
): EnvValidationResult => {
  const parsed = appEnvSchema.safeParse({
    APP_NAME: source.APP_NAME,
    LOG_LEVEL: source.LOG_LEVEL,
  });

  if (parsed.success) {
    return {
      env: parsed.data,
      ok: true,
    };
  }

  return {
    issues: parsed.error.issues.map((issue) => {
      const key = issue.path.join(".") || "ENV";
      return `${key}: ${issue.message}`;
    }),
    ok: false,
  };
};
