import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  class MockAPIError extends Error {
    status: number;

    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  }

  class MockOpenAI {
    static APIError = MockAPIError;
    responses = { create: mocks.create };

    constructor(options: unknown) {
      void options;
      // The test never creates a network client.
    }
  }

  return {
    create: vi.fn(),
    MockAPIError,
    MockOpenAI,
  };
});

vi.mock("server-only", () => ({}));
vi.mock("openai", () => ({ default: mocks.MockOpenAI }));

import { analyzeJobOffer } from "@/lib/offer-analysis-service";

describe("offer analysis service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("JOBTRACK_AI_PROVIDER", "openai");
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    mocks.create.mockRejectedValue(new mocks.MockAPIError("quota", 429));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("usa el analizador local sin API key ni SDK OpenAI", async () => {
    vi.stubEnv("JOBTRACK_AI_PROVIDER", "local");
    vi.stubEnv("OPENAI_API_KEY", "");

    const result = await analyzeJobOffer(
      "Oferta de frontend con React y TypeScript. ".repeat(3),
    );

    expect(result.technologies).toEqual(["TypeScript", "React"]);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("usa el proveedor local por defecto", async () => {
    vi.stubEnv("JOBTRACK_AI_PROVIDER", "");
    vi.stubEnv("OPENAI_API_KEY", "");

    const result = await analyzeJobOffer(
      "Oferta de backend con PostgreSQL y Docker. ".repeat(3),
    );

    expect(result.technologies).toEqual(["PostgreSQL", "Docker"]);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("devuelve un error controlado si OpenAI no tiene API key", async () => {
    vi.stubEnv("JOBTRACK_AI_PROVIDER", "openai");
    vi.stubEnv("OPENAI_API_KEY", "");

    await expect(
      analyzeJobOffer("Oferta de frontend con React y TypeScript. ".repeat(3)),
    ).rejects.toMatchObject({ code: "not_configured" });

    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("clasifica un 429 del proveedor como rate limit del proveedor", async () => {
    const requestStarted = vi.fn();

    await expect(
      analyzeJobOffer(
        "Oferta válida de frontend con React y TypeScript. ".repeat(3),
        requestStarted,
      ),
    ).rejects.toMatchObject({ code: "provider_rate_limit" });

    expect(requestStarted).toHaveBeenCalledOnce();
    expect(mocks.create).toHaveBeenCalledOnce();
  });
});
