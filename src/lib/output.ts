import { intro, note, outro } from "@clack/prompts";
import pc from "picocolors";

import type { CliContext } from "./context.js";
import { writeLine } from "./context.js";

type Status = "fail" | "pass" | "warn";

const canUseInteractiveOutput = (context: CliContext): boolean =>
  context.stdout === process.stdout && Boolean(process.stdout.isTTY);

export const renderIntro = (context: CliContext, title: string): void => {
  if (canUseInteractiveOutput(context)) {
    intro(title);
    return;
  }

  writeLine(context.stdout, title);
};

export const renderNote = (
  context: CliContext,
  title: string,
  lines: string[],
): void => {
  const message = lines.join("\n");

  if (canUseInteractiveOutput(context)) {
    note(message, title);
    return;
  }

  writeLine(context.stdout, title);
  for (const line of lines) {
    writeLine(context.stdout, `  ${line}`);
  }
};

export const renderOutro = (context: CliContext, message: string): void => {
  if (canUseInteractiveOutput(context)) {
    outro(message);
    return;
  }

  writeLine(context.stdout, message);
};

export const renderJson = (context: CliContext, payload: unknown): void => {
  writeLine(context.stdout, JSON.stringify(payload, null, 2));
};

export const renderError = (
  context: CliContext,
  title: string,
  issues: string[],
): void => {
  writeLine(context.stderr, pc.red(title));

  for (const issue of issues) {
    writeLine(context.stderr, `- ${issue}`);
  }
};

export const formatStatus = (status: Status): string => {
  if (status === "pass") {
    return pc.green("[ok]");
  }

  if (status === "warn") {
    return pc.yellow("[warn]");
  }

  return pc.red("[fail]");
};
