import { describe, expect, it } from "vitest";

import {
  MAX_OFFER_TEXT_LENGTH,
  MIN_OFFER_TEXT_LENGTH,
  normalizeOfferText,
  parseJobOfferAnalysis,
  redactOfferPersonalData,
  validateOfferText,
} from "@/lib/offer-analysis-validation";

describe("offer analysis validation", () => {
  it("normaliza saltos de línea y espacios exteriores", () => {
    expect(normalizeOfferText("  Una línea\r\notra  ")).toBe("Una línea\notra");
  });

  it("valida los límites de tamaño en servidor y cliente", () => {
    expect(validateOfferText(" ").error).toBeDefined();
    expect(validateOfferText("a".repeat(MIN_OFFER_TEXT_LENGTH - 1)).error).toContain(
      "al menos",
    );
    expect(validateOfferText("a".repeat(MIN_OFFER_TEXT_LENGTH)).value).toHaveLength(
      MIN_OFFER_TEXT_LENGTH,
    );
    expect(validateOfferText("a".repeat(MAX_OFFER_TEXT_LENGTH + 1)).error).toContain(
      "no puede superar",
    );
  });

  it("redacta emails y teléfonos evidentes sin enviar esos valores", () => {
    const redacted = redactOfferPersonalData(
      "Contacto: hiring@example.com o +34600111222.",
    );

    expect(redacted).not.toContain("hiring@example.com");
    expect(redacted).not.toContain("+34600111222");
    expect(redacted).toContain("[email redactado]");
    expect(redacted).toContain("[teléfono redactado]");
  });

  it("valida la estructura recibida de la IA en runtime", () => {
    const parsed = parseJobOfferAnalysis({
      summary: "Resumen",
      seniority: "senior",
      technologies: ["TypeScript"],
      keywords: ["testing"],
      workMode: "unknown",
      applicationHighlights: ["Experiencia con testing"],
    });

    expect(parsed).toEqual({
      summary: "Resumen",
      seniority: "senior",
      technologies: ["TypeScript"],
      keywords: ["testing"],
      workMode: "unknown",
      applicationHighlights: ["Experiencia con testing"],
    });
    expect(
      parseJobOfferAnalysis({
        summary: "Resumen",
        seniority: "impossible",
        technologies: [],
        keywords: [],
        workMode: "unknown",
        applicationHighlights: [],
      }),
    ).toBeNull();
  });
});
