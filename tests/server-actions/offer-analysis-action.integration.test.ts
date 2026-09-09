import { randomUUID } from "node:crypto";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { analyzeJobOfferAction } from "@/app/analytics/offer/actions";
import { recordOfferAnalysisAttempt } from "@/lib/offer-analysis-rate-limit";
import { initialOfferAnalysisActionState } from "@/types/offer-analysis";
import type { JobOfferAnalysis } from "@/types/offer-analysis";

const mocks = vi.hoisted(() => {
  class MockOfferAnalysisError extends Error {
    code: string;

    constructor(code: string) {
      super(code);
      this.code = code;
    }
  }

  return {
    requireSession: vi.fn(),
    analyzeJobOffer: vi.fn(),
    getOfferAnalysisProvider: vi.fn(),
    OfferAnalysisError: MockOfferAnalysisError,
  };
});

vi.mock("server-only", () => ({}));

vi.mock("@/lib/auth-utils", () => ({
  requireSession: mocks.requireSession,
}));

vi.mock("@/lib/offer-analysis-service", () => ({
  analyzeJobOffer: mocks.analyzeJobOffer,
  getOfferAnalysisProvider: mocks.getOfferAnalysisProvider,
  OfferAnalysisError: mocks.OfferAnalysisError,
}));

const analysis: JobOfferAnalysis = {
  summary: "Resumen de integración",
  seniority: "mid",
  technologies: ["React"],
  keywords: ["integración"],
  workMode: "remote",
  applicationHighlights: ["Experiencia con React"],
};

function validFormData(): FormData {
  const formData = new FormData();

  formData.set(
    "offerText",
    "Oferta válida de frontend con React y TypeScript. ".repeat(3),
  );
  return formData;
}

describe("offer analysis Server Action with the real rate limiter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getOfferAnalysisProvider.mockReturnValue("openai");
    mocks.analyzeJobOffer.mockImplementation(
      async (_offerText: string, onRequestStarted?: () => void) => {
        onRequestStarted?.();
        return analysis;
      },
    );
  });

  it("permite el primero, bloquea el segundo y no bloquea a otro usuario", async () => {
    const firstUserId = `integration-first-${randomUUID()}`;
    const secondUserId = `integration-second-${randomUUID()}`;
    mocks.requireSession.mockResolvedValue({ user: { id: firstUserId } });

    const firstResult = await analyzeJobOfferAction(
      initialOfferAnalysisActionState,
      validFormData(),
    );

    expect(firstResult.status).toBe("success");
    expect(firstResult.error).toBeUndefined();
    expect(mocks.analyzeJobOffer).toHaveBeenCalledTimes(1);

    const secondResult = await analyzeJobOfferAction(
      initialOfferAnalysisActionState,
      validFormData(),
    );

    expect(secondResult).toEqual({
      status: "error",
      error: "Has alcanzado el límite temporal. Espera un minuto antes de volver a analizar una oferta.",
    });
    expect(mocks.analyzeJobOffer).toHaveBeenCalledTimes(1);

    mocks.requireSession.mockResolvedValue({ user: { id: secondUserId } });

    const differentUserResult = await analyzeJobOfferAction(
      initialOfferAnalysisActionState,
      validFormData(),
    );

    expect(differentUserResult.status).toBe("success");
    expect(mocks.analyzeJobOffer).toHaveBeenCalledTimes(2);
  });

  it("no presenta un 429 del proveedor como el cooldown local", async () => {
    const userId = `integration-provider-${randomUUID()}`;
    mocks.requireSession.mockResolvedValue({ user: { id: userId } });
    mocks.analyzeJobOffer.mockImplementation(
      async (_offerText: string, onRequestStarted?: () => void) => {
        onRequestStarted?.();
        throw new mocks.OfferAnalysisError("provider_rate_limit");
      },
    );

    const result = await analyzeJobOfferAction(
      initialOfferAnalysisActionState,
      validFormData(),
    );

    expect(result.status).toBe("error");
    expect(result.error).toContain("proveedor de análisis");
    expect(result.error).not.toContain("Espera un minuto");
  });

  it("no aplica el rate limit cuando el proveedor es local", async () => {
    const userId = `integration-local-${randomUUID()}`;
    mocks.getOfferAnalysisProvider.mockReturnValue("local");
    mocks.requireSession.mockResolvedValue({ user: { id: userId } });
    recordOfferAnalysisAttempt(userId);

    const result = await analyzeJobOfferAction(
      initialOfferAnalysisActionState,
      validFormData(),
    );

    expect(result.status).toBe("success");
    expect(mocks.analyzeJobOffer).toHaveBeenCalledTimes(1);
  });
});
