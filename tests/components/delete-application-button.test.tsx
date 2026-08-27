import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DeleteApplicationButton } from "@/components/delete-application-button";

vi.mock("@/app/applications/actions", () => ({
  deleteApplicationAction: vi.fn(),
}));

function getDeleteForm(): HTMLFormElement {
  const form = screen.getByRole("button", { name: "Eliminar" }).closest("form");

  if (!form) {
    throw new Error("No se ha encontrado el formulario de eliminación.");
  }

  return form;
}

describe("DeleteApplicationButton", () => {
  it("cancela el submit si el usuario rechaza la confirmación", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<DeleteApplicationButton applicationId="application-1" />);

    const form = getDeleteForm();
    const event = createEvent.submit(form);
    const preventDefault = vi.spyOn(event, "preventDefault");

    fireEvent(form, event);

    expect(preventDefault).toHaveBeenCalledOnce();
  });

  it("permite el submit si el usuario confirma", () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<DeleteApplicationButton applicationId="application-1" />);

    const form = getDeleteForm();
    fireEvent.submit(form);

    expect(window.confirm).toHaveBeenCalledWith(
      "¿Quieres eliminar esta candidatura?",
    );
    expect(screen.getByDisplayValue("application-1")).toHaveAttribute(
      "name",
      "applicationId",
    );
  });
});
