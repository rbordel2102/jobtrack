import { describe, expect, it, beforeEach, vi } from "vitest";

import {
  createApplicationAction,
  deleteApplicationAction,
  updateApplicationAction,
} from "@/app/applications/actions";
import { initialApplicationActionState } from "@/lib/application-validation";
import type { Application } from "@/types/application";

const mocks = vi.hoisted(() => ({
  requireSession: vi.fn(),
  createApplication: vi.fn(),
  updateApplication: vi.fn(),
  deleteApplication: vi.fn(),
  redirect: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth-utils", () => ({
  requireSession: mocks.requireSession,
}));

vi.mock("@/lib/application-data", () => ({
  createApplication: mocks.createApplication,
  updateApplication: mocks.updateApplication,
  deleteApplication: mocks.deleteApplication,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

const sessionUserId = "session-user-1";
const application: Application = {
  id: "application-1",
  company: "Acme",
  companyInitials: "AC",
  position: "Frontend developer",
  status: "applied",
  location: "Madrid",
  workMode: "remote",
  appliedAt: "2026-08-22",
  technologies: ["React"],
};

function validFormData(): FormData {
  const formData = new FormData();

  formData.set("company", "Acme");
  formData.set("position", "Frontend developer");
  formData.set("status", "applied");
  formData.set("location", "Madrid");
  formData.set("workMode", "remote");
  formData.set("appliedAt", "2026-08-22");
  formData.set("technologies", "React");
  formData.set("userId", "browser-controlled-user");

  return formData;
}

describe("application Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireSession.mockResolvedValue({
      user: { id: sessionUserId },
    });
    mocks.redirect.mockImplementation((path: string) => {
      throw new Error(`REDIRECT:${path}`);
    });
  });

  it("valida create antes de llamar a la capa de datos", async () => {
    const formData = validFormData();
    formData.set("company", " ");

    const result = await createApplicationAction(
      initialApplicationActionState,
      formData,
    );

    expect(result.fieldErrors.company).toBe(
      "Introduce el nombre de la empresa.",
    );
    expect(mocks.createApplication).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("usa el userId de sesión y no uno enviado por el navegador al crear", async () => {
    mocks.createApplication.mockResolvedValue(application);

    await expect(
      createApplicationAction(initialApplicationActionState, validFormData()),
    ).rejects.toThrow("REDIRECT:/applications?success=created");

    expect(mocks.createApplication).toHaveBeenCalledWith(sessionUserId, {
      company: "Acme",
      position: "Frontend developer",
      status: "applied",
      location: "Madrid",
      workMode: "remote",
      appliedAt: "2026-08-22",
      technologies: ["React"],
    });
    expect(mocks.createApplication).not.toHaveBeenCalledWith(
      "browser-controlled-user",
      expect.anything(),
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/applications");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/");
    expect(mocks.redirect).toHaveBeenCalledWith(
      "/applications?success=created",
    );
  });

  it("devuelve un error de formulario si create falla", async () => {
    mocks.createApplication.mockRejectedValue(new Error("database error"));

    const result = await createApplicationAction(
      initialApplicationActionState,
      validFormData(),
    );

    expect(result).toEqual({
      fieldErrors: {},
      formError: "No se ha podido guardar la candidatura. Inténtalo de nuevo.",
    });
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("actualiza usando el userId de sesión y redirige", async () => {
    mocks.updateApplication.mockResolvedValue(application);

    await expect(
      updateApplicationAction(
        application.id,
        initialApplicationActionState,
        validFormData(),
      ),
    ).rejects.toThrow("REDIRECT:/applications?success=updated");

    expect(mocks.updateApplication).toHaveBeenCalledWith(
      application.id,
      sessionUserId,
      expect.objectContaining({ company: "Acme" }),
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/applications");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/");
    expect(mocks.redirect).toHaveBeenCalledWith(
      "/applications?success=updated",
    );
  });

  it("devuelve un error si la candidatura a editar no existe para el usuario", async () => {
    mocks.updateApplication.mockResolvedValue(null);

    const result = await updateApplicationAction(
      application.id,
      initialApplicationActionState,
      validFormData(),
    );

    expect(result).toEqual({
      fieldErrors: {},
      formError: "No se ha encontrado la candidatura que quieres editar.",
    });
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("traduce P2025 de update a un error de candidatura no encontrada", async () => {
    mocks.updateApplication.mockRejectedValue({ code: "P2025" });

    const result = await updateApplicationAction(
      application.id,
      initialApplicationActionState,
      validFormData(),
    );

    expect(result.formError).toBe(
      "No se ha encontrado la candidatura que quieres editar.",
    );
  });

  it("redirige a no encontrada cuando falta el id al eliminar", async () => {
    const formData = new FormData();

    await expect(deleteApplicationAction(formData)).rejects.toThrow(
      "REDIRECT:/applications?error=not_found",
    );

    expect(mocks.deleteApplication).not.toHaveBeenCalled();
    expect(mocks.redirect).toHaveBeenCalledWith(
      "/applications?error=not_found",
    );
  });

  it("elimina con el userId de sesión y revalida las rutas", async () => {
    const formData = new FormData();
    formData.set("applicationId", application.id);
    formData.set("userId", "browser-controlled-user");
    mocks.deleteApplication.mockResolvedValue(true);

    await expect(deleteApplicationAction(formData)).rejects.toThrow(
      "REDIRECT:/applications?success=deleted",
    );

    expect(mocks.deleteApplication).toHaveBeenCalledWith(
      application.id,
      sessionUserId,
    );
    expect(mocks.deleteApplication).not.toHaveBeenCalledWith(
      application.id,
      "browser-controlled-user",
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/applications");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/");
    expect(mocks.redirect).toHaveBeenCalledWith(
      "/applications?success=deleted",
    );
  });

  it("redirige si delete no encuentra la candidatura", async () => {
    const formData = new FormData();
    formData.set("applicationId", application.id);
    mocks.deleteApplication.mockResolvedValue(false);

    await expect(deleteApplicationAction(formData)).rejects.toThrow(
      "REDIRECT:/applications?error=not_found",
    );

    expect(mocks.redirect).toHaveBeenCalledWith(
      "/applications?error=not_found",
    );
  });

  it("redirige a error de base de datos si delete falla", async () => {
    const formData = new FormData();
    formData.set("applicationId", application.id);
    mocks.deleteApplication.mockRejectedValue(new Error("database error"));

    await expect(deleteApplicationAction(formData)).rejects.toThrow(
      "REDIRECT:/applications?error=database",
    );

    expect(mocks.redirect).toHaveBeenCalledWith(
      "/applications?error=database",
    );
  });
});
