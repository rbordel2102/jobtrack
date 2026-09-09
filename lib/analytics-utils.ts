import {
  applicationStatusOptions,
  workModeOptions,
} from "@/lib/application-config";
import type {
  AnalyticsApplication,
  AnalyticsStatusCount,
  AnalyticsSummary,
  AnalyticsWorkModeCount,
  MonthlyApplicationCount,
  TechnologyFrequency,
} from "@/types/analytics";
import type { ApplicationStatus, WorkMode } from "@/types/application";

function roundPercentage(value: number): number {
  return Math.round(value * 10) / 10;
}

function getPercentage(count: number, total: number): number | null {
  if (total === 0) {
    return null;
  }

  return roundPercentage((count / total) * 100);
}

function countByStatus(
  applications: readonly AnalyticsApplication[],
  status: ApplicationStatus,
): number {
  return applications.filter((application) => application.status === status)
    .length;
}

function countByWorkMode(
  applications: readonly AnalyticsApplication[],
  workMode: WorkMode,
): number {
  return applications.filter((application) => application.workMode === workMode)
    .length;
}

function getStatusCounts(
  applications: readonly AnalyticsApplication[],
): readonly AnalyticsStatusCount[] {
  const total = applications.length;

  return applicationStatusOptions.map(({ value }) => {
    const count = countByStatus(applications, value);

    return {
      status: value,
      count,
      percentage: getPercentage(count, total),
    };
  });
}

function getWorkModeCounts(
  applications: readonly AnalyticsApplication[],
): readonly AnalyticsWorkModeCount[] {
  const total = applications.length;

  return workModeOptions.map(({ value }) => {
    const count = countByWorkMode(applications, value);

    return {
      workMode: value,
      count,
      percentage: getPercentage(count, total),
    };
  });
}

function getMonthKey(appliedAt: string): string | null {
  const match = /^(\d{4})-(\d{2})-\d{2}$/.exec(appliedAt);

  return match ? `${match[1]}-${match[2]}` : null;
}

function getMonthLabel(month: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${month}-01T00:00:00.000Z`));
}

export function getMonthlyApplications(
  applications: readonly AnalyticsApplication[],
): readonly MonthlyApplicationCount[] {
  const counts = new Map<string, number>();

  for (const application of applications) {
    const month = getMonthKey(application.appliedAt);

    if (!month) {
      continue;
    }

    counts.set(month, (counts.get(month) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort(([firstMonth], [secondMonth]) =>
      firstMonth.localeCompare(secondMonth),
    )
    .map(([month, count]) => ({
      month,
      label: getMonthLabel(month),
      count,
    }));
}

export function getTechnologyFrequencies(
  applications: readonly AnalyticsApplication[],
): readonly TechnologyFrequency[] {
  const frequencies = new Map<string, TechnologyFrequency>();

  for (const application of applications) {
    const technologiesInApplication = new Set<string>();

    for (const technology of application.technologies) {
      const name = technology.trim();
      const normalizedName = name.toLocaleLowerCase("es-ES");

      if (!name || technologiesInApplication.has(normalizedName)) {
        continue;
      }

      technologiesInApplication.add(normalizedName);
      const previous = frequencies.get(normalizedName);

      frequencies.set(normalizedName, {
        name: previous?.name ?? name,
        count: (previous?.count ?? 0) + 1,
      });
    }
  }

  return [...frequencies.values()].sort(
    (firstTechnology, secondTechnology) =>
      secondTechnology.count - firstTechnology.count ||
      firstTechnology.name.localeCompare(secondTechnology.name, "es-ES"),
  );
}

export function getAnalyticsSummary(
  applications: readonly AnalyticsApplication[],
): AnalyticsSummary {
  const total = applications.length;
  const statusCounts = getStatusCounts(applications);
  const interviewCount = countByStatus(applications, "interview");
  const offerCount = countByStatus(applications, "offer");

  return {
    total,
    statusCounts,
    interviewRate: getPercentage(interviewCount, total),
    offerRate: getPercentage(offerCount, total),
    workModeCounts: getWorkModeCounts(applications),
    technologies: getTechnologyFrequencies(applications),
    monthlyApplications: getMonthlyApplications(applications),
    pipeline: statusCounts,
  };
}
