import type { ApplicationStatus, WorkMode } from "@/types/application";

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  applied: "Enviada",
  interview: "Entrevista",
  technical_test: "Prueba técnica",
  offer: "Oferta",
  rejected: "Rechazada",
};

export const applicationStatusOptions = [
  { value: "applied", label: applicationStatusLabels.applied },
  { value: "interview", label: applicationStatusLabels.interview },
  { value: "technical_test", label: applicationStatusLabels.technical_test },
  { value: "offer", label: applicationStatusLabels.offer },
  { value: "rejected", label: applicationStatusLabels.rejected },
] satisfies readonly { value: ApplicationStatus; label: string }[];

export const workModeLabels: Record<WorkMode, string> = {
  remote: "Remoto",
  hybrid: "Híbrido",
  onsite: "Presencial",
};
