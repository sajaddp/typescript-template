import { loadEnv } from "../config/env.js";
import type { CliContext } from "../lib/context.js";
import { writeLine } from "../lib/context.js";
import {
  formatStatus,
  renderError,
  renderIntro,
  renderJson,
  renderOutro,
} from "../lib/output.js";

type DoctorOptions = {
  json?: boolean;
};

const REQUIRED_NODE_MAJOR = 24;
const REQUIRED_PNPM_MAJOR = 11;

export type DoctorStatus = "fail" | "pass" | "warn";

export type DoctorCheck = {
  detail: string;
  name: string;
  status: DoctorStatus;
};

export type DoctorReport = {
  checks: DoctorCheck[];
  ok: boolean;
};

const parseMajorVersion = (version: string): number => {
  const [major] = version.split(".");
  return Number(major);
};

const getPnpmVersion = (userAgent: string | undefined): string | undefined => {
  const match = userAgent?.match(/pnpm\/(\d+\.\d+\.\d+)/);
  return match?.[1];
};

const createNodeCheck = (nodeVersion: string): DoctorCheck => {
  const major = parseMajorVersion(nodeVersion);

  if (Number.isFinite(major) && major >= REQUIRED_NODE_MAJOR) {
    return {
      detail: `Detected Node.js ${nodeVersion}.`,
      name: "Node.js >=24",
      status: "pass",
    };
  }

  return {
    detail: `Detected Node.js ${nodeVersion}. Install Node.js 24 or newer.`,
    name: "Node.js >=24",
    status: "fail",
  };
};

const createPackageManagerCheck = (env: NodeJS.ProcessEnv): DoctorCheck => {
  const pnpmVersion = getPnpmVersion(env.npm_config_user_agent);

  if (!pnpmVersion) {
    return {
      detail:
        "Run commands through pnpm 11+ for the intended template workflow.",
      name: "pnpm 11+",
      status: "warn",
    };
  }

  const major = parseMajorVersion(pnpmVersion);

  if (Number.isFinite(major) && major >= REQUIRED_PNPM_MAJOR) {
    return {
      detail: `Detected pnpm ${pnpmVersion}.`,
      name: "pnpm 11+",
      status: "pass",
    };
  }

  return {
    detail: `Detected pnpm ${pnpmVersion}. Upgrade to pnpm 11 or newer.`,
    name: "pnpm 11+",
    status: "fail",
  };
};

const createEnvCheck = (env: NodeJS.ProcessEnv): DoctorCheck => {
  const envResult = loadEnv(env);

  if (envResult.ok) {
    return {
      detail: `APP_NAME=${envResult.env.APP_NAME}, LOG_LEVEL=${envResult.env.LOG_LEVEL}.`,
      name: "Environment",
      status: "pass",
    };
  }

  return {
    detail: envResult.issues.join(" "),
    name: "Environment",
    status: "fail",
  };
};

export const createDoctorReport = (
  env: NodeJS.ProcessEnv = process.env,
  nodeVersion = process.versions.node,
): DoctorReport => {
  const checks = [
    createNodeCheck(nodeVersion),
    createPackageManagerCheck(env),
    createEnvCheck(env),
  ];

  return {
    checks,
    ok: checks.every((check) => check.status !== "fail"),
  };
};

export const runDoctorCommand = (
  options: DoctorOptions,
  context: CliContext,
): number => {
  const report = createDoctorReport(context.env);

  if (options.json) {
    renderJson(context, report);
    return report.ok ? 0 : 1;
  }

  renderIntro(context, "Doctor");
  for (const check of report.checks) {
    writeLine(
      context.stdout,
      `${formatStatus(check.status)} ${check.name} - ${check.detail}`,
    );
  }

  if (!report.ok) {
    renderError(context, "Required checks failed", [
      "Fix failed checks, then run ts-template doctor again.",
    ]);
    return 1;
  }

  renderOutro(context, "All required checks passed.");
  return 0;
};
