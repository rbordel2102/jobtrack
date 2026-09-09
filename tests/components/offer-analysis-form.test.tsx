import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { OfferAnalysisForm } from "@/components/offer-analysis-form";
import type {
  JobOfferAnalysis,
  OfferAnalysisAction,
} from "@/types/offer-analysis";

const analysis: JobOfferAnalysis = {
  summary: "Resumen de una oferta de prueba",
  seniority: "senior",
  technologies: ["TypeScript"],
  keywords: ["arquitectura"],
  workMode: "hybrid",
  applicationHighlights: ["Experiencia liderando proyectos"],
};

function validOfferText(): string {
  return "Oferta para desarrollar producto digital con TypeScript y colaboración con equipos de producto. ";
}

describe("OfferAnalysisForm", () => {
  it("muestra el aviso de privacidad y evita enviar texto inválido", async () => {
    const user = userEvent.setup();
    const action = vi.fn<OfferAnalysisAction>();

    render(<OfferAnalysisForm action={action} provider="local" />);

    expect(screen.getByText(/Análisis automático local/)).toBeVisible();
    expect(screen.getByText(/sin enviar el texto a servicios externos/)).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Analizar oferta" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Pega el texto");
    expect(action).not.toHaveBeenCalled();
  });

  it("muestra el resultado estructurado de la Server Action", async () => {
    const user = userEvent.setup();
    const action = vi.fn<OfferAnalysisAction>(async () => ({
      status: "success",
      result: analysis,
    }));

    render(<OfferAnalysisForm action={action} provider="local" />);
    await user.type(screen.getByLabelText("Texto de la oferta"), validOfferText());
    await user.click(screen.getByRole("button", { name: "Analizar oferta" }));

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Análisis de la oferta" })).toBeVisible(),
    );
    expect(action).toHaveBeenCalledOnce();
    expect(screen.getByText("Resumen de una oferta de prueba")).toBeVisible();
    expect(screen.getByText("TypeScript")).toBeVisible();
  });
});
