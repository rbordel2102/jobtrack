import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ApplicationsList } from "@/components/applications-list";
import type { Application } from "@/types/application";

vi.mock("@/app/applications/actions", () => ({
  deleteApplicationAction: vi.fn(),
}));

const applications: Application[] = [
  {
    id: "application-acme",
    company: "Acme",
    companyInitials: "AC",
    position: "Frontend developer",
    status: "interview",
    location: "Madrid",
    workMode: "remote",
    appliedAt: "2026-08-22",
    technologies: ["React", "TypeScript"],
  },
  {
    id: "application-beta",
    company: "Beta",
    companyInitials: "BE",
    position: "Product designer",
    status: "rejected",
    location: "Barcelona",
    workMode: "hybrid",
    appliedAt: "2026-08-20",
    technologies: ["Figma"],
  },
];

describe("ApplicationsList", () => {
  it("muestra candidaturas y enlaces de edición", () => {
    render(<ApplicationsList applications={applications} />);

    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    const cards = screen.getAllByRole("article");

    expect(within(cards[0]!).getByText("Entrevista")).toBeInTheDocument();
    expect(within(cards[1]!).getByText("Rechazada")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Editar" })).toHaveLength(2);
  });

  it("filtra por empresa o puesto", async () => {
    const user = userEvent.setup();

    render(<ApplicationsList applications={applications} />);

    await user.type(screen.getByRole("searchbox", { name: "Buscar por empresa o puesto" }), "designer");

    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.queryByText("Acme")).not.toBeInTheDocument();
    expect(screen.getByText("1 candidatura")).toBeInTheDocument();
  });

  it("filtra por estado y muestra el estado vacío", async () => {
    const user = userEvent.setup();

    render(<ApplicationsList applications={applications} />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Filtrar por estado" }),
      "offer",
    );

    expect(screen.getByText("No hay candidaturas que coincidan.")).toBeVisible();
    expect(screen.queryByText("Acme")).not.toBeInTheDocument();
    expect(screen.queryByText("Beta")).not.toBeInTheDocument();
  });
});
