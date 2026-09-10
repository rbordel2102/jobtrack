import { describe, expect, it } from "vitest";

import {
  getAnalyticsSummary,
  getMonthlyApplications,
  getTechnologyFrequencies,
} from "@/lib/analytics-utils";
import type { AnalyticsApplication } from "@/types/analytics";

function createApplication(
  overrides: Partial<AnalyticsApplication> = {},
): AnalyticsApplication {
  return {
    status: "applied",
    workMode: "remote",
    appliedAt: "2026-08-22",
    technologies: ["React"],
    ...overrides,
  };
}

describe("analytics utils", () => {
  it("calcula la distribución actual y las tasas sin inferir conversiones", () => {
    const summary = getAnalyticsSummary([
      createApplication(),
      createApplication({ status: "interview", workMode: "hybrid" }),
      createApplication({ status: "technical_test" }),
      createApplication({ status: "offer", workMode: "onsite" }),
      createApplication({ status: "rejected" }),
    ]);

    expect(summary.total).toBe(5);
    expect(summary.statusCounts.map(({ status, count }) => [status, count])).toEqual([
      ["applied", 1],
      ["interview", 1],
      ["technical_test", 1],
      ["offer", 1],
      ["rejected", 1],
    ]);
    expect(summary.interviewRate).toBe(20);
    expect(summary.offerRate).toBe(20);
    expect(summary.workModeCounts.map(({ workMode, count }) => [workMode, count])).toEqual([
      ["remote", 3],
      ["hybrid", 1],
      ["onsite", 1],
    ]);
  });

  it("devuelve Sin datos semántico mediante tasas nulas sin candidaturas", () => {
    const summary = getAnalyticsSummary([]);

    expect(summary.total).toBe(0);
    expect(summary.interviewRate).toBeNull();
    expect(summary.offerRate).toBeNull();
    expect(summary.statusCounts.every(({ percentage }) => percentage === null)).toBe(
      true,
    );
  });

  it("cuenta cada tecnología una vez por candidatura y normaliza el texto", () => {
    const frequencies = getTechnologyFrequencies([
      createApplication({ technologies: [" React ", "React", "TypeScript"] }),
      createApplication({ technologies: ["react", "Node.js"] }),
    ]);

    expect(frequencies).toEqual([
      { name: "React", count: 2 },
      { name: "Node.js", count: 1 },
      { name: "TypeScript", count: 1 },
    ]);
  });

  it("agrupa candidaturas por mes y ordena cronológicamente", () => {
    const monthly = getMonthlyApplications([
      createApplication({ appliedAt: "2026-09-01" }),
      createApplication({ appliedAt: "2026-08-31" }),
      createApplication({ appliedAt: "2026-09-15" }),
    ]);

    expect(monthly.map(({ month, count }) => [month, count])).toEqual([
      ["2026-08", 1],
      ["2026-09", 2],
    ]);
  });
});
