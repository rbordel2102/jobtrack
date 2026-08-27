import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AuthForm } from "@/components/auth-form";

const routerMocks = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
}));
const authMocks = vi.hoisted(() => ({
  signInEmail: vi.fn(),
  signUpEmail: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMocks,
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: { email: authMocks.signInEmail },
    signUp: { email: authMocks.signUpEmail },
  },
}));

describe("AuthForm", () => {
  it("valida el nombre antes de registrar", async () => {
    const user = userEvent.setup();

    render(<AuthForm mode="register" />);

    await user.type(screen.getByLabelText("Email"), "user@example.test");
    await user.type(screen.getByLabelText("Contraseña"), "password123");
    const form = screen
      .getByRole("button", { name: "Crear cuenta" })
      .closest("form");

    if (!form) {
      throw new Error("No se ha encontrado el formulario de registro.");
    }

    fireEvent.submit(form);

    expect(screen.getByRole("alert")).toHaveTextContent("Introduce tu nombre.");
    expect(authMocks.signUpEmail).not.toHaveBeenCalled();
  });

  it("registra y redirige cuando Better Auth responde correctamente", async () => {
    const user = userEvent.setup();
    authMocks.signUpEmail.mockResolvedValue({ error: null });

    render(<AuthForm mode="register" />);

    await user.type(screen.getByLabelText("Nombre"), "  Test User  ");
    await user.type(screen.getByLabelText("Email"), "user@example.test");
    await user.type(screen.getByLabelText("Contraseña"), "password123");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    await waitFor(() => expect(authMocks.signUpEmail).toHaveBeenCalledOnce());

    expect(authMocks.signUpEmail).toHaveBeenCalledWith({
      name: "Test User",
      email: "user@example.test",
      password: "password123",
    });
    expect(routerMocks.push).toHaveBeenCalledWith("/");
    expect(routerMocks.refresh).toHaveBeenCalledOnce();
  });

  it("inicia sesión y muestra errores del proveedor", async () => {
    const user = userEvent.setup();
    authMocks.signInEmail.mockResolvedValue({
      error: { message: "Credenciales inválidas" },
    });

    render(<AuthForm mode="login" />);

    await user.type(screen.getByLabelText("Email"), "user@example.test");
    await user.type(screen.getByLabelText("Contraseña"), "password123");
    await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Credenciales inválidas",
      ),
    );
    expect(authMocks.signInEmail).toHaveBeenCalledWith({
      email: "user@example.test",
      password: "password123",
      rememberMe: true,
    });
    expect(routerMocks.push).not.toHaveBeenCalled();
  });
});
