import { Command, CommanderError } from "commander";
import pc from "picocolors";

import { runDoctorCommand } from "./commands/doctor.js";
import { runEnvCommand } from "./commands/env.js";
import { runHelloCommand } from "./commands/hello.js";
import { type CliContext, createCliContext } from "./lib/context.js";

export { createDoctorReport, runDoctorCommand } from "./commands/doctor.js";
export { runEnvCommand } from "./commands/env.js";
export { runHelloCommand } from "./commands/hello.js";
export { type AppEnv, loadEnv, logLevels } from "./config/env.js";

export const CLI_NAME = "ts-template";
export const CLI_VERSION = "1.0.0";

type JsonOption = {
  json?: boolean;
};

const throwOnFailure = (exitCode: number): void => {
  if (exitCode !== 0) {
    throw new CommanderError(exitCode, "command.failed", "Command failed.");
  }
};

const normalizeArgv = (argv: string[]): string[] => {
  if (argv[2] === "--") {
    return [argv[0] ?? "node", argv[1] ?? CLI_NAME, ...argv.slice(3)];
  }

  return argv;
};

export const createProgram = (
  contextOverrides: Partial<CliContext> = {},
): Command => {
  const context = createCliContext(contextOverrides);
  const program = new Command();

  program
    .name(CLI_NAME)
    .description(
      "A polished TypeScript CLI starter for Node.js 24+, pnpm 11+, Commander.js, typed env validation, and Vitest.",
    )
    .version(CLI_VERSION)
    .showHelpAfterError()
    .exitOverride()
    .configureHelp({
      sortOptions: true,
      sortSubcommands: true,
    })
    .configureOutput({
      outputError: (message, write) => write(pc.red(message)),
      writeErr: (message) => context.stderr.write(message),
      writeOut: (message) => context.stdout.write(message),
    });

  program
    .command("hello")
    .description("Print a friendly greeting and show the starter's CLI style.")
    .argument("[name]", "Name to greet.", "developer")
    .option("--json", "Print machine-readable JSON output.")
    .action((name: string, options: JsonOption) => {
      throwOnFailure(
        runHelloCommand(
          {
            json: Boolean(options.json),
            name,
          },
          context,
        ),
      );
    });

  program
    .command("env")
    .description("Validate and display public environment configuration.")
    .option("--json", "Print machine-readable JSON output.")
    .action((options: JsonOption) => {
      throwOnFailure(
        runEnvCommand(
          {
            json: Boolean(options.json),
          },
          context,
        ),
      );
    });

  program
    .command("doctor")
    .description("Check the local Node.js, pnpm, and environment setup.")
    .option("--json", "Print machine-readable JSON output.")
    .action((options: JsonOption) => {
      throwOnFailure(
        runDoctorCommand(
          {
            json: Boolean(options.json),
          },
          context,
        ),
      );
    });

  return program;
};

export const runCli = async (
  argv: string[] = process.argv,
  contextOverrides: Partial<CliContext> = {},
): Promise<number> => {
  const normalizedArgv = normalizeArgv(argv);
  const program = createProgram(contextOverrides);

  try {
    if (normalizedArgv.length <= 2) {
      program.outputHelp();
      return 0;
    }

    await program.parseAsync(normalizedArgv, {
      from: "node",
    });

    return 0;
  } catch (error) {
    if (error instanceof CommanderError) {
      return error.exitCode;
    }

    throw error;
  }
};
