#!/usr/bin/env node
import "dotenv/config";

import { runCli } from "./index.js";

process.exitCode = await runCli(process.argv);
