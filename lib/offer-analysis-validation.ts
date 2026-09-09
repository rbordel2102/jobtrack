import type {
  JobOfferAnalysis,
  OfferSeniority,
  OfferWorkMode,
} from "@/types/offer-analysis";

export const MIN_OFFER_TEXT_LENGTH = 80;
export const MAX_OFFER_TEXT_LENGTH = 20_000;

const seniorityValues: readonly OfferSeniority[] = [
  "intern",
  "junior",
  "mid",
  "senior",
  "lead",
  "unknown",
];

const workModeValues: readonly OfferWorkMode[] = [
  "remote",
  "hybrid",
  "onsite",
  "unknown",
];

export interface OfferTextValidationResult {
  value?: string;
  error?: string;
}

export function normalizeOfferText(text: string): string {
  return text.replace(/\r\n?/g, "\n").trim();
}

export function validateOfferText(value: unknown): OfferTextValidationResult {
  if (typeof value !== "string") {
    return { error: "Pega el texto de una oferta de empleo." };
  }

  const normalizedValue = normalizeOfferText(value);

  if (normalizedValue.length === 0) {
    return { error: "Pega el texto de una oferta de empleo." };
  }

  if (normalizedValue.length < MIN_OFFER_TEXT_LENGTH) {
    return {
      error: `La oferta debe tener al menos ${MIN_OFFER_TEXT_LENGTH} caracteres.`,
    };
  }

  if (normalizedValue.length > MAX_OFFER_TEXT_LENGTH) {
    return {
      error: `La oferta no puede superar los ${MAX_OFFER_TEXT_LENGTH.toLocaleString("es-ES")} caracteres.`,
    };
  }

  return { value: normalizedValue };
}

export function redactOfferPersonalData(text: string): string {
  return text
    .replace(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      "[email redactado]",
    )
    .replace(/\+\d{7,15}/g, "[teléfono redactado]")
    .replace(/\b[6789]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}\b/g, "[teléfono redactado]");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is readonly string[] {
  return (
    Array.isArray(value) &&
    value.length <= 20 &&
    value.every(
      (item) => typeof item === "string" && item.trim().length > 0,
    )
  );
}

function isOfferSeniority(value: unknown): value is OfferSeniority {
  return typeof value === "string" && seniorityValues.includes(value as OfferSeniority);
}

function isOfferWorkMode(value: unknown): value is OfferWorkMode {
  return typeof value === "string" && workModeValues.includes(value as OfferWorkMode);
}

export function parseJobOfferAnalysis(
  value: unknown,
): JobOfferAnalysis | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.summary !== "string" ||
    value.summary.trim().length === 0 ||
    value.summary.length > 2_000 ||
    !isOfferSeniority(value.seniority) ||
    !isStringArray(value.technologies) ||
    !isStringArray(value.keywords) ||
    !isOfferWorkMode(value.workMode) ||
    !isStringArray(value.applicationHighlights)
  ) {
    return null;
  }

  return {
    summary: value.summary.trim(),
    seniority: value.seniority,
    technologies: value.technologies.map((item) => item.trim()),
    keywords: value.keywords.map((item) => item.trim()),
    workMode: value.workMode,
    applicationHighlights: value.applicationHighlights.map((item) =>
      item.trim(),
    ),
  };
}
