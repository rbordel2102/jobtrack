import { describe, expect, it } from "vitest";

import {
  formatApplicationDate,
  getCompanyInitials,
  getDashboardStats,
} from "@/lib/application-utils";
import type { Application, ApplicationStatus } from "@/types/application";

function createApplication(
  id: string,
  status: ApplicationStatus,
): Application {
  return {
    id,
    company: `Company ${id}`,
    companyInitials: "CO",
    position: "Developer",
    status,
    location: "Madrid",
    workMode: "remote",
    appliedAt: "2026-08-22",
    technologies: ["React"],
  };
}

describe("application utils", () => {
  it("obtiene iniciales de empresa de una o dos palabras", () => {
    expect(getCompanyInitials("  acme  ")).toBe("A");
    expect(getCompanyInitials("Acme Corporation")).toBe("AC");
    expect(getCompanyInitials("   ")).toBe("?");
  });

  it("calcula las estadísticas del panel", () => {
    const applications = [
      createApplication("1", "applied"),
      createApplication("2", "interview"),
      createApplication("3", "offer"),
      createApplication("4", "rejected"),
      createApplication("5", "interview"),
    ];

    expect(
      getDashboardStats(applications).map(({ label, value }) => [label, value]),
    ).toEqual([
      ["Candidaturas", 5],
      ["Entrevistas", 2],
      ["Ofertas", 1],
      ["Rechazos", 1],
    ]);
  });

  it("devuelve estadísticas a cero para una lista vacía", () => {
    expect(getDashboardStats([]).every((stat) => stat.value === 0)).toBe(true);
  });

  it("formatea una fecha en español", () => {
    const formattedDate = formatApplicationDate("2026-08-22");

    expect(formattedDate).toContain("22");
    expect(formattedDate).toContain("2026");
  });
});
