"use server";

import { requireSession } from "@/lib/auth-utils";
import {
  analyzeJobOffer,
  OfferAnalysisError,
  getOfferAnalysisProvider,
} from "@/lib/offer-analysis-service";
import {
  isOfferAnalysisRateLimited,
  recordOfferAnalysisAttempt,
} from "@/lib/offer-analysis-rate-limit";
import { validateOfferText } from "@/lib/offer-analysis-validation";
import type {
  OfferAnalysisAction,
  OfferAnalysisActionState,
} from "@/types/offer-analysis";

function getErrorMessage(error: unknown): string {
  if (!(error instanceof OfferAnalysisError)) {
    return "No se ha podido analizar la oferta. Inténtalo de nuevo más tarde.";
  }

  switch (error.code) {
    case "not_configured":
      return "El análisis de ofertas no está configurado en este entorno.";
    case "rate_limit":
      return "Has alcanzado el límite temporal. Espera un minuto antes de volver a analizar una oferta.";
    case "provider_rate_limit":
      return "El proveedor de análisis está temporalmente saturado. Inténtalo de nuevo más tarde.";
    case "invalid_response":
      return "La respuesta del análisis no se ha podido interpretar correctamente.";
    case "provider":
      return "El servicio de análisis no está disponible ahora. Inténtalo de nuevo más tarde.";
  }
}

export const analyzeJobOfferAction: OfferAnalysisAction = async (
  previousState: OfferAnalysisActionState,
  formData: FormData,
): Promise<OfferAnalysisActionState> => {
  void previousState;

  const session = await requireSession();
  const validation = validateOfferText(formData.get("offerText"));

  if (validation.error || !validation.value) {
    return {
      status: "error",
      error: validation.error ?? "Pega el texto de una oferta de empleo.",
    };
  }

  const provider = getOfferAnalysisProvider();

  if (
    provider === "openai" &&
    isOfferAnalysisRateLimited(session.user.id)
  ) {
    return {
      status: "error",
      error: getErrorMessage(new OfferAnalysisError("rate_limit")),
    };
  }

  try {
    const result = await analyzeJobOffer(
      validation.value,
      provider === "openai"
        ? () => recordOfferAnalysisAttempt(session.user.id)
        : undefined,
    );

    return { status: "success", result };
  } catch (error: unknown) {
    return { status: "error", error: getErrorMessage(error) };
  }
};
