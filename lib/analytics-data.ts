import "server-only";

import { prisma } from "@/lib/prisma";
import { getAnalyticsSummary } from "@/lib/analytics-utils";
import type { AnalyticsSummary } from "@/types/analytics";
import type { ApplicationStatus, WorkMode } from "@/types/application";

interface AnalyticsRecord {
  status: ApplicationStatus;
  workMode: WorkMode;
  appliedAt: Date;
  technologies: string[];
}

export async function getAnalytics(
  userId: string,
): Promise<AnalyticsSummary> {
  const records: AnalyticsRecord[] = await prisma.application.findMany({
    where: { userId },
    select: {
      status: true,
      workMode: true,
      appliedAt: true,
      technologies: true,
    },
  });

  return getAnalyticsSummary(
    records.map((record) => ({
      status: record.status,
      workMode: record.workMode,
      appliedAt: record.appliedAt.toISOString().slice(0, 10),
      technologies: record.technologies,
    })),
  );
}
