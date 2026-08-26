"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

import { authClient } from "@/lib/auth-client";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);
  const isRegisterMode = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    if (isRegisterMode && !name.trim()) {
      setError("Introduce tu nombre.");
      return;
    }

    if (!email.trim() || !password) {
      setError("Introduce tu email y tu contraseña.");
      return;
    }

    setIsPending(true);

    try {
      const result = isRegisterMode
        ? await authClient.signUp.email({
            name: name.trim(),
            email: email.trim(),
            password,
          })
        : await authClient.signIn.email({
            email: email.trim(),
            password,
            rememberMe: true,
          });

      if (result.error) {
        setError(result.error.message ?? "No se ha podido completar la operación.");
        setIsPending(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("No se ha podido completar la operación. Inténtalo de nuevo.");
      setIsPending(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          JobTrack
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          {isRegisterMode ? "Crea tu cuenta" : "Bienvenido de nuevo"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {isRegisterMode
            ? "Empieza a organizar tu búsqueda de empleo."
            : "Inicia sesión para continuar con tus candidaturas."}
        </p>
      </div>

      {error ? (
        <p
          aria-live="polite"
          className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {isRegisterMode ? (
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="name">
              Nombre
            </label>
            <input
              autoComplete="name"
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-950/10"
              id="name"
              onChange={(event) => setName(event.target.value)}
              required
              type="text"
              value={name}
            />
          </div>
        ) : null}

        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            autoComplete="email"
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-950/10"
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="password">
            Contraseña
          </label>
          <input
            autoComplete={isRegisterMode ? "new-password" : "current-password"}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-950/10"
            id="password"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </div>

        <button
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending
            ? "Procesando..."
            : isRegisterMode
              ? "Crear cuenta"
              : "Iniciar sesión"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        {isRegisterMode ? "¿Ya tienes una cuenta?" : "¿Todavía no tienes cuenta?"}{" "}
        <Link
          className="font-semibold text-slate-950 hover:underline"
          href={isRegisterMode ? "/login" : "/register"}
        >
          {isRegisterMode ? "Inicia sesión" : "Regístrate"}
        </Link>
      </p>
    </div>
  );
}
