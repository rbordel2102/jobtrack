"use client";

import { useActionState, useState } from "react";

import {
  initialSettingsActionState,
  type UpdateProfileAction,
} from "@/types/settings";

interface SettingsFormProps {
  action: UpdateProfileAction;
  email: string;
  initialName: string;
}

export function SettingsForm({
  action,
  email,
  initialName,
}: SettingsFormProps) {
  const [name, setName] = useState(initialName);
  const [state, formAction, isPending] = useActionState(
    action,
    initialSettingsActionState,
  );

  return (
    <section
      aria-labelledby="settings-account-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
    >
      <div className="border-b border-slate-100 pb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Cuenta
        </p>
        <h2
          className="mt-1 text-lg font-semibold tracking-tight text-slate-950"
          id="settings-account-heading"
        >
          Datos personales
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Actualiza el nombre que aparece en tu espacio de trabajo.
        </p>
      </div>

      <form action={formAction} className="mt-6 space-y-5">
        <div>
          <label
            className="block text-sm font-semibold text-slate-700"
            htmlFor="settings-name"
          >
            Nombre visible
          </label>
          <input
            autoComplete="name"
            className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-950/10"
            id="settings-name"
            maxLength={60}
            minLength={2}
            name="name"
            onChange={(event) => setName(event.target.value)}
            required
            value={name}
          />
        </div>

        <div>
          <label
            className="block text-sm font-semibold text-slate-700"
            htmlFor="settings-email"
          >
            Email
          </label>
          <input
            className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
            id="settings-email"
            readOnly
            value={email}
          />
          <p className="mt-2 text-xs leading-5 text-slate-400">
            El email se utiliza para iniciar sesión y no se puede editar aquí.
          </p>
        </div>

        {state.status === "success" && state.message ? (
          <p
            aria-live="polite"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
            role="status"
          >
            {state.message}
          </p>
        ) : null}

        {state.status === "error" && state.error ? (
          <p
            aria-live="polite"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}

        <button
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </section>
  );
}
