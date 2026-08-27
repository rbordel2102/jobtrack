import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ApplicationForm } from "@/components/application-form";
import {
  initialApplicationActionState,
  type ApplicationFormAction,
  type ApplicationFormValues,
} from "@/lib/application-validation";

const initialValues: ApplicationFormValues = {
  company: "Acme",
  position: "Frontend developer",
  status: "applied",
  location: "Madrid",
  workMode: "remote",
  appliedAt: "2026-08-22",
  technologies: "React, TypeScript",
};

function createAction() {
  return vi.fn<ApplicationFormAction>(async () => initialApplicationActionState);
}

describe("ApplicationForm", () => {
  it("renderiza los valores iniciales en modo edición", () => {
    const action = createAction();

    render(
      <ApplicationForm
        action={action}
        initialValues={initialValues}
        mode="edit"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Editar candidatura" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Empresa")).toHaveValue("Acme");
    expect(screen.getByLabelText("Puesto")).toHaveValue("Frontend developer");
    expect(screen.getByLabelText("Tecnologías")).toHaveValue(
      "React, TypeScript",
    );
    expect(
      screen.getByRole("button", { name: "Guardar cambios" }),
    ).toBeInTheDocument();
  });

  it("muestra errores y no envía el formulario inválido", async () => {
    const user = userEvent.setup();
    const action = createAction();

    render(
      <ApplicationForm
        action={action}
        initialValues={{
          ...initialValues,
          company: "",
          position: "",
          location: "",
          appliedAt: "",
          technologies: "",
        }}
        mode="create"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Crear candidatura" }));

    expect(screen.getByText("Introduce el nombre de la empresa.")).toBeVisible();
    expect(screen.getByText("Introduce el puesto.")).toBeVisible();
    expect(screen.getByText("Introduce la ubicación.")).toBeVisible();
    expect(action).not.toHaveBeenCalled();
  });

  it("envía los valores válidos mediante la Server Action", async () => {
    const user = userEvent.setup();
    const action = createAction();

    render(
      <ApplicationForm
        action={action}
        initialValues={{
          ...initialValues,
          company: "",
          position: "",
          location: "",
          appliedAt: "",
          technologies: "",
        }}
        mode="create"
      />,
    );

    await user.type(screen.getByLabelText("Empresa"), "Acme");
    await user.type(screen.getByLabelText("Puesto"), "Frontend developer");
    await user.type(screen.getByLabelText("Ubicación"), "Madrid");
    await user.type(screen.getByLabelText("Fecha de candidatura"), "2026-08-22");
    await user.type(screen.getByLabelText("Tecnologías"), "React, TypeScript");
    await user.click(screen.getByRole("button", { name: "Crear candidatura" }));

    await waitFor(() => expect(action).toHaveBeenCalledOnce());

    const formData = action.mock.calls[0]?.[1];

    expect(formData).toBeInstanceOf(FormData);
    expect(formData?.get("company")).toBe("Acme");
    expect(formData?.get("technologies")).toBe("React, TypeScript");
  });
});
