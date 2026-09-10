import { beforeEach, describe, expect, it, vi } from "vitest";

import { updateProfileAction } from "@/app/settings/actions";
import { initialSettingsActionState } from "@/types/settings";

const mocks = vi.hoisted(() => ({
  requireSession: vi.fn(),
  updateUser: vi.fn(),
  headers: vi.fn(),
}));

vi.mock("@/lib/auth-utils", () => ({
  requireSession: mocks.requireSession,
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      updateUser: mocks.updateUser,
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: mocks.headers,
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

function validFormData(): FormData {
  const formData = new FormData();

  formData.set("name", "  Ana García  ");
  formData.set("userId", "browser-controlled-user");
  return formData;
}

describe("settings Server Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireSession.mockResolvedValue({
      user: { id: "session-user-1", name: "Original", email: "ana@example.test" },
    });
    mocks.headers.mockResolvedValue(new Headers({ cookie: "session=valid" }));
    mocks.updateUser.mockResolvedValue({ status: true });
  });

  it("actualiza el nombre de la sesión y no usa un userId del navegador", async () => {
    const requestHeaders = await mocks.headers();

    const result = await updateProfileAction(
      initialSettingsActionState,
      validFormData(),
    );

    expect(result).toEqual({
      status: "success",
      message: "Nombre actualizado correctamente.",
    });
    expect(mocks.updateUser).toHaveBeenCalledWith({
      body: { name: "Ana García" },
      headers: requestHeaders,
    });
    expect(mocks.updateUser).not.toHaveBeenCalledWith(
      expect.objectContaining({ body: expect.objectContaining({ userId: expect.anything() }) }),
    );
  });

  it("valida el nombre antes de llamar a Better Auth", async () => {
    const formData = validFormData();
    formData.set("name", " A ");

    const result = await updateProfileAction(
      initialSettingsActionState,
      formData,
    );

    expect(result.status).toBe("error");
    expect(result.error).toContain("entre 2 y 60");
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  it("devuelve feedback de error si falla la actualización", async () => {
    mocks.updateUser.mockRejectedValue(new Error("database error"));

    const result = await updateProfileAction(
      initialSettingsActionState,
      validFormData(),
    );

    expect(result).toEqual({
      status: "error",
      error: "No se ha podido guardar el nombre. Inténtalo de nuevo.",
    });
  });

  it("no continúa si no hay una sesión autenticada", async () => {
    mocks.requireSession.mockRejectedValue(new Error("REDIRECT:/login"));

    await expect(
      updateProfileAction(initialSettingsActionState, validFormData()),
    ).rejects.toThrow("REDIRECT:/login");
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });
});
