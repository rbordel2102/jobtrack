import type { Application, ApplicationStatus, DashboardStat } from "@/types/application";

export function formatApplicationDate(appliedAt: string): string {
  const date = new Date(`${appliedAt}T00:00:00`);

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getCompanyInitials(company: string): string {
  const initials = company
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();

  return initials || "?";
}

export function getDashboardStats(
  applications: readonly Application[],
): readonly DashboardStat[] {
  const countByStatus = (status: ApplicationStatus) =>
    applications.filter((application) => application.status === status).length;

  return [
    {
      label: "Candidaturas",
      value: applications.length,
      change: "Actual",
      changeLabel: "Datos registrados",
      helperText: "Candidaturas registradas en tu proceso",
      icon: "briefcase",
    },
    {
      label: "Entrevistas",
      value: countByStatus("interview"),
      change: "Actual",
      changeLabel: "Datos registrados",
      helperText: "Candidaturas en fase de entrevista",
      icon: "calendar",
    },
    {
      label: "Ofertas",
      value: countByStatus("offer"),
      change: "Actual",
      changeLabel: "Datos registrados",
      helperText: "Ofertas recibidas en tus candidaturas",
      icon: "sparkle",
    },
    {
      label: "Rechazos",
      value: countByStatus("rejected"),
      change: "Actual",
      changeLabel: "Datos registrados",
      helperText: "Candidaturas marcadas como rechazadas",
      icon: "x-circle",
    },
  ] satisfies readonly DashboardStat[];
}
