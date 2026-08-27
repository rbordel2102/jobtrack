import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

import { config, parse } from "dotenv";

interface TestEnvironment {
  databaseUrl: string;
  directUrl: string;
  betterAuthSecret: string;
  betterAuthUrl: string;
}

function requireEnvironmentValue(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Falta ${name}. Los tests que usan PostgreSQL requieren un entorno de test explícito en .env.test.`,
    );
  }

  return value;
}

function readDevelopmentEnvironment(): Record<string, string> {
  const developmentEnvironmentPath = resolve(process.cwd(), ".env");

  if (!existsSync(developmentEnvironmentPath)) {
    return {};
  }

  return parse(readFileSync(developmentEnvironmentPath));
}

export function loadTestEnvironment(): TestEnvironment {
  config({ path: resolve(process.cwd(), ".env.test") });

  if (process.env.JOBTRACK_TEST_MODE !== "true") {
    throw new Error(
      "JOBTRACK_TEST_MODE debe ser true. Se bloquea la ejecución para evitar usar un entorno ambiguo.",
    );
  }

  const testEnvironment: TestEnvironment = {
    databaseUrl: requireEnvironmentValue("TEST_DATABASE_URL"),
    directUrl: requireEnvironmentValue("TEST_DIRECT_URL"),
    betterAuthSecret: requireEnvironmentValue("TEST_BETTER_AUTH_SECRET"),
    betterAuthUrl: requireEnvironmentValue("TEST_BETTER_AUTH_URL"),
  };
  const developmentEnvironment = readDevelopmentEnvironment();

  if (
    testEnvironment.databaseUrl === developmentEnvironment.DATABASE_URL ||
    testEnvironment.directUrl === developmentEnvironment.DIRECT_URL ||
    testEnvironment.databaseUrl === process.env.DATABASE_URL ||
    testEnvironment.directUrl === process.env.DIRECT_URL
  ) {
    throw new Error(
      "Las URLs de test coinciden con las URLs de desarrollo. Se bloquea la ejecución para proteger la base Neon de desarrollo.",
    );
  }

  const authUrl = new URL(testEnvironment.betterAuthUrl);

  if (
    !["localhost", "127.0.0.1"].includes(authUrl.hostname) ||
    authUrl.port !== "3100"
  ) {
    throw new Error(
      "TEST_BETTER_AUTH_URL debe apuntar al servidor local de test en el puerto 3100.",
    );
  }

  return testEnvironment;
}

export function getTestRuntimeEnvironment(): Record<string, string> {
  const testEnvironment = loadTestEnvironment();
  const runtimeEnvironment: Record<string, string> = {};

  for (const [name, value] of Object.entries(process.env)) {
    if (typeof value === "string") {
      runtimeEnvironment[name] = value;
    }
  }

  return {
    ...runtimeEnvironment,
    NODE_ENV: "development",
    DATABASE_URL: testEnvironment.databaseUrl,
    DIRECT_URL: testEnvironment.directUrl,
    BETTER_AUTH_SECRET: testEnvironment.betterAuthSecret,
    BETTER_AUTH_URL: testEnvironment.betterAuthUrl,
    JOBTRACK_TEST_MODE: "true",
  };
}
