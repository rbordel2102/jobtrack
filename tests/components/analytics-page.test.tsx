import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AnalyticsPage } from "@/components/analytics-page";
import type { AnalyticsSummary } from "@/types/analytics";

const summary: AnalyticsSummary = {
  total: 2,
  statusCounts: [
    { status: "applied", count: 1, percentage: 50 },
    { status: "interview", count: 1, percentage: 50 },
    { status: "technical_test", count: 0, percentage: 0 },
    { status: "offer", count: 0, percentage: 0 },
    { status: "rejected", count: 0, percentage: 0 },
  ],
  interviewRate: 50,
  offerRate: 0,
  workModeCounts: [
    { workMode: "remote", count: 2, percentage: 100 },
    { workMode: "hybrid", count: 0, percentage: 0 },
    { workMode: "onsite", count: 0, percentage: 0 },
  ],
  technologies: [{ name: "React", count: 2 }],
  monthlyApplications: [{ month: "2026-08", label: "ago 2026", count: 2 }],
};

describe("AnalyticsPage", () => {
  it("muestra métricas y enlace al análisis de ofertas", () => {
    render(<AnalyticsPage summary={summary} />);

    expect(
      screen.getByRole("heading", { name: "Indicadores actuales" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Actualmente en entrevista").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Actualmente en oferta").length).toBeGreaterThan(0);
    expect(screen.getByText("Distribución por estado")).toBeInTheDocument();
    expect(screen.queryByText("Pipeline actual")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Analizar una oferta" }),
    ).toHaveAttribute("href", "/analytics/offer");
  });

  it("muestra Sin datos cuando no hay candidaturas", () => {
    render(
      <AnalyticsPage
        summary={{
          ...summary,
          total: 0,
          interviewRate: null,
          offerRate: null,
          statusCounts: summary.statusCounts.map((item) => ({
            ...item,
            count: 0,
            percentage: null,
          })),
          workModeCounts: summary.workModeCounts.map((item) => ({
            ...item,
            count: 0,
            percentage: null,
          })),
          technologies: [],
          monthlyApplications: [],
        }}
      />,
    );

    expect(screen.getAllByText("Sin datos").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Todavía no hay candidaturas",
    );
  });
});
