export type ApplicationStatus =
  | "applied"
  | "interview"
  | "technical_test"
  | "offer"
  | "rejected";

export type WorkMode = "remote" | "hybrid" | "onsite";

export interface Application {
  id: string;
  company: string;
  companyInitials: string;
  position: string;
  status: ApplicationStatus;
  location: string;
  workMode: WorkMode;
  appliedAt: string;
  technologies: readonly string[];
}

export type DashboardStatLabel =
  | "Candidaturas"
  | "Entrevistas"
  | "Ofertas"
  | "Rechazos";

export type DashboardStatIcon =
  | "briefcase"
  | "calendar"
  | "sparkle"
  | "x-circle";

export interface DashboardStat {
  label: DashboardStatLabel;
  value: number;
  change: string;
  changeLabel: string;
  helperText: string;
  icon: DashboardStatIcon;
}
