import type { ApplicationStatus, WorkMode } from "@/types/application";

export interface AnalyticsApplication {
  status: ApplicationStatus;
  workMode: WorkMode;
  appliedAt: string;
  technologies: readonly string[];
}

export interface AnalyticsStatusCount {
  status: ApplicationStatus;
  count: number;
  percentage: number | null;
}

export interface AnalyticsWorkModeCount {
  workMode: WorkMode;
  count: number;
  percentage: number | null;
}

export interface TechnologyFrequency {
  name: string;
  count: number;
}

export interface MonthlyApplicationCount {
  month: string;
  label: string;
  count: number;
}

export interface AnalyticsSummary {
  total: number;
  statusCounts: readonly AnalyticsStatusCount[];
  interviewRate: number | null;
  offerRate: number | null;
  workModeCounts: readonly AnalyticsWorkModeCount[];
  technologies: readonly TechnologyFrequency[];
  monthlyApplications: readonly MonthlyApplicationCount[];
}
