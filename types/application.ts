export type ApplicationStatus = "Enviada" | "Entrevista" | "Oferta" | "Rechazada";

export type LogoTone = "blue" | "violet" | "amber" | "emerald" | "rose";

export interface Application {
  id: string;
  company: string;
  companyInitials: string;
  role: string;
  status: ApplicationStatus;
  appliedAt: string;
  appliedLabel: string;
  logoTone: LogoTone;
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
