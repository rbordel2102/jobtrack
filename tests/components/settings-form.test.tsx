import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SettingsForm } from "@/components/settings-form";
import type { UpdateProfileAction } from "@/types/settings";

describe("SettingsForm", () => {
  it("muestra nombre y email y confirma el guardado", async () => {
    const user = userEvent.setup();
    const action = vi.fn<UpdateProfileAction>(async () => ({
      status: "success",
      message: "Nombre actualizado correctamente.",
    }));

    render(
      <SettingsForm
        action={action}
        email="ana@example.test"
        initialName="Ana García"
      />,
    );

    expect(screen.getByDisplayValue("Ana García")).toBeInTheDocument();
    expect(screen.getByDisplayValue("ana@example.test")).toHaveAttribute(
      "readonly",
    );

    const nameInput = screen.getByLabelText("Nombre visible");
    await user.clear(nameInput);
    await user.type(nameInput, "Ana Actualizada");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    expect(screen.getByRole("status")).toHaveTextContent(
      "Nombre actualizado correctamente.",
    );
    expect(action.mock.calls[0]?.[1].get("name")).toBe("Ana Actualizada");
  });

  it("muestra errores devueltos por el servidor", async () => {
    const user = userEvent.setup();
    const action = vi.fn<UpdateProfileAction>(async () => ({
      status: "error",
      error: "No se ha podido guardar el nombre. Inténtalo de nuevo.",
    }));

    render(
      <SettingsForm
        action={action}
        email="ana@example.test"
        initialName="Ana García"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "No se ha podido guardar el nombre",
      ),
    );
  });
});
