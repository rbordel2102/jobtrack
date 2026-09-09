export type OfferSeniority =
  | "intern"
  | "junior"
  | "mid"
  | "senior"
  | "lead"
  | "unknown";

export type OfferWorkMode = "remote" | "hybrid" | "onsite" | "unknown";

export type OfferAnalysisProvider = "local" | "openai";

export interface JobOfferAnalysis {
  summary: string;
  seniority: OfferSeniority;
  technologies: readonly string[];
  keywords: readonly string[];
  workMode: OfferWorkMode;
  applicationHighlights: readonly string[];
}

export type OfferAnalysisErrorCode =
  | "not_configured"
  | "rate_limit"
  | "provider_rate_limit"
  | "provider"
  | "invalid_response";

export interface OfferAnalysisActionState {
  status: "idle" | "success" | "error";
  result?: JobOfferAnalysis;
  error?: string;
}

export type OfferAnalysisAction = (
  previousState: OfferAnalysisActionState,
  formData: FormData,
) => Promise<OfferAnalysisActionState>;

export const initialOfferAnalysisActionState: OfferAnalysisActionState = {
  status: "idle",
};
