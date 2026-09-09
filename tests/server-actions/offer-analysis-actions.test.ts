import { beforeEach, describe, expect, it, vi } from "vitest";

import { analyzeJobOfferAction } from "@/app/analytics/offer/actions";
import { initialOfferAnalysisActionState } from "@/types/offer-analysis";
import type { JobOfferAnalysis } from "@/types/offer-analysis";

const mocks = vi.hoisted(() => ({
  requireSession: vi.fn(),
  analyzeJobOffer: vi.fn(),
  getOfferAnalysisProvider: vi.fn(),
  isOfferAnalysisRateLimited: vi.fn(),
  recordOfferAnalysisAttempt: vi.fn(),
}));

vi.mock("@/lib/auth-utils", () => ({
  requireSession: mocks.requireSession,
}));

vi.mock("@/lib/offer-analysis-service", () => ({
  analyzeJobOffer: mocks.analyzeJobOffer,
  getOfferAnalysisProvider: mocks.getOfferAnalysisProvider,
  OfferAnalysisError: class OfferAnalysisError extends Error {
    code: string;

    constructor(code: string) {
      super(code);
      this.code = code;
    }
  },
}));

vi.mock("@/lib/offer-analysis-rate-limit", () => ({
  isOfferAnalysisRateLimited: mocks.isOfferAnalysisRateLimited,
  recordOfferAnalysisAttempt: mocks.recordOfferAnalysisAttempt,
}));

const analysis: JobOfferAnalysis = {
  summary: "Resumen de prueba",
  seniority: "mid",
  technologies: ["React"],
  keywords: ["testing"],
  workMode: "remote",
  applicationHighlights: ["Experiencia con React"],
};

function validFormData(): FormData {
  const formData = new FormData();

  formData.set("offerText", "Oferta de frontend con React y TypeScript. ".repeat(3));
  return formData;
}

describe("offer analysis Server Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireSession.mockResolvedValue({ user: { id: "user-1" } });
    mocks.getOfferAnalysisProvider.mockReturnValue("openai");
    mocks.isOfferAnalysisRateLimited.mockReturnValue(false);
    mocks.analyzeJobOffer.mockImplementation(
      async (_offerText: string, onRequestStarted?: () => void) => {
        onRequestStarted?.();
        return analysis;
      },
    );
  });

  it("rechaza ofertas vacías antes de llamar al proveedor", async () => {
    const formData = new FormData();

    const result = await analyzeJobOfferAction(
      initialOfferAnalysisActionState,
      formData,
    );

    expect(result.status).toBe("error");
    expect(result.error).toContain("Pega el texto");
    expect(mocks.analyzeJobOffer).not.toHaveBeenCalled();
  });

  it("usa la sesión para limitar y analiza solo el texto validado", async () => {
    const result = await analyzeJobOfferAction(
      initialOfferAnalysisActionState,
      validFormData(),
    );

    expect(result).toEqual({ status: "success", result: analysis });
    expect(mocks.isOfferAnalysisRateLimited).toHaveBeenCalledWith("user-1");
    expect(mocks.recordOfferAnalysisAttempt).toHaveBeenCalledWith("user-1");
    expect(mocks.analyzeJobOffer).toHaveBeenCalledWith(
      "Oferta de frontend con React y TypeScript. Oferta de frontend con React y TypeScript. Oferta de frontend con React y TypeScript.",
      expect.any(Function),
    );
  });

  it("devuelve un error sin llamar a IA si el usuario está limitado", async () => {
    mocks.isOfferAnalysisRateLimited.mockReturnValue(true);

    const result = await analyzeJobOfferAction(
      initialOfferAnalysisActionState,
      validFormData(),
    );

    expect(result.status).toBe("error");
    expect(result.error).toContain("límite temporal");
    expect(mocks.analyzeJobOffer).not.toHaveBeenCalled();
  });
});
