import { spawn } from "node:child_process";
import { resolve } from "node:path";

import { getTestRuntimeEnvironment } from "./test-env";

const prismaCliPath = resolve(
  process.cwd(),
  "node_modules",
  "prisma",
  "build",
  "index.js",
);
const testEnvironment = getTestRuntimeEnvironment();
const child = spawn(process.execPath, [prismaCliPath, "migrate", "deploy"], {
  env: {
    ...process.env,
    ...testEnvironment,
    NODE_ENV: "development",
  },
  stdio: "inherit",
});

child.once("error", (error) => {
  console.error("No se han podido aplicar las migraciones de test.", error);
  process.exitCode = 1;
});

child.once("exit", (code) => {
  process.exitCode = code ?? 1;
});
