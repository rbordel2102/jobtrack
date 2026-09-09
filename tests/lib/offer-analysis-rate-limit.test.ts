import { describe, expect, it } from "vitest";

import {
  isOfferAnalysisRateLimited,
  recordOfferAnalysisAttempt,
} from "@/lib/offer-analysis-rate-limit";

describe("offer analysis rate limit", () => {
  it("permite el primer intento", () => {
    expect(isOfferAnalysisRateLimited("first-user", 1_000)).toBe(false);
  });

  it("bloquea el segundo intento inmediato", () => {
    recordOfferAnalysisAttempt("immediate-user", 1_000);

    expect(isOfferAnalysisRateLimited("immediate-user", 1_001)).toBe(true);
  });

  it("permite otro intento al terminar los 60 segundos", () => {
    recordOfferAnalysisAttempt("expired-user", 1_000);

    expect(isOfferAnalysisRateLimited("expired-user", 61_000)).toBe(false);
  });

  it("mantiene el límite aislado por usuario", () => {
    recordOfferAnalysisAttempt("user-a", 1_000);

    expect(isOfferAnalysisRateLimited("user-b", 1_001)).toBe(false);
  });
});
