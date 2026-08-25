"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { FormEvent } from "react";

import {
  applicationStatusOptions,
  workModeOptions,
} from "@/lib/application-config";
import {
  initialApplicationActionState,
  type ApplicationFormAction,
  type ApplicationFormErrors,
  type ApplicationFormValues,
  validateApplicationForm,
} from "@/lib/application-validation";
import type { ApplicationStatus, WorkMode } from "@/types/application";

interface ApplicationFormProps {
  action: ApplicationFormAction;
  initialValues: ApplicationFormValues;
  mode: "create" | "edit";
}

interface FieldErrorProps {
  id: string;
  message?: string;
}

function FieldError({ id, message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      className="mt-1.5 text-xs font-medium text-rose-600"
      id={id}
      role="alert"
    >
      {message}
    </p>
  );
}

export function ApplicationForm({
  action,
  initialValues,
  mode,
}: ApplicationFormProps) {
  const [formValues, setFormValues] = useState<ApplicationFormValues>(() => ({
    ...initialValues,
  }));
  const [clientErrors, setClientErrors] = useState<ApplicationFormErrors>({});
  const [serverState, formAction, isPending] = useActionState(
    action,
    initialApplicationActionState,
  );
  const errors = { ...serverState.fieldErrors, ...clientErrors };
  const isEditMode = mode === "edit";
  const title = isEditMode ? "Editar candidatura" : "Nueva candidatura";
  const description = isEditMode
    ? "Actualiza la información de esta oportunidad."
    : "Añade una nueva oportunidad a tu proceso de búsqueda.";

  function clearFieldError(field: keyof ApplicationFormValues) {
    setClientErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function updateField<Field extends keyof ApplicationFormValues>(
    field: Field,
    value: ApplicationFormValues[Field],
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
    clearFieldError(field);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const validationErrors = validateApplicationForm(formValues);

    if (Object.keys(validationErrors).length > 0) {
      event.preventDefault();
      setClientErrors(validationErrors);
      return;
    }

    setClientErrors({});
  }

  return (
    <section
      aria-labelledby="application-form-heading"
      className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
    >
      <div className="border-b border-slate-100 pb-5">
        <h2
          className="text-lg font-semibold tracking-tight text-slate-950"
          id="application-form-heading"
        >
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-slate-500">{description}</p>
      </div>

      {serverState.formError ? (
        <p
          aria-live="polite"
          className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
          role="alert"
        >
          {serverState.formError}
        </p>
      ) : null}

      <form
        action={formAction}
        className="mt-6 space-y-5"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              className="text-sm font-semibold text-slate-700"
              htmlFor="company"
            >
              Empresa
            </label>
            <input
              aria-describedby={errors.company ? "company-error" : undefined}
              aria-invalid={Boolean(errors.company)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-950/10"
              id="company"
              name="company"
              onChange={(event) => updateField("company", event.target.value)}
              required
              type="text"
              value={formValues.company}
            />
            <FieldError id="company-error" message={errors.company} />
          </div>

          <div>
            <label
              className="text-sm font-semibold text-slate-700"
              htmlFor="position"
            >
              Puesto
            </label>
            <input
              aria-describedby={errors.position ? "position-error" : undefined}
              aria-invalid={Boolean(errors.position)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-950/10"
              id="position"
              name="position"
              onChange={(event) => updateField("position", event.target.value)}
              required
              type="text"
              value={formValues.position}
            />
            <FieldError id="position-error" message={errors.position} />
          </div>

          <div>
            <label
              className="text-sm font-semibold text-slate-700"
              htmlFor="status"
            >
              Estado
            </label>
            <select
              aria-describedby={errors.status ? "status-error" : undefined}
              aria-invalid={Boolean(errors.status)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-950/10"
              id="status"
              name="status"
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as ApplicationStatus,
                )
              }
              required
              value={formValues.status}
            >
              {applicationStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FieldError id="status-error" message={errors.status} />
          </div>

          <div>
            <label
              className="text-sm font-semibold text-slate-700"
              htmlFor="location"
            >
              Ubicación
            </label>
            <input
              aria-describedby={errors.location ? "location-error" : undefined}
              aria-invalid={Boolean(errors.location)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-950/10"
              id="location"
              name="location"
              onChange={(event) => updateField("location", event.target.value)}
              required
              type="text"
              value={formValues.location}
            />
            <FieldError id="location-error" message={errors.location} />
          </div>

          <div>
            <label
              className="text-sm font-semibold text-slate-700"
              htmlFor="workMode"
            >
              Modalidad
            </label>
            <select
              aria-describedby={errors.workMode ? "workMode-error" : undefined}
              aria-invalid={Boolean(errors.workMode)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-950/10"
              id="workMode"
              name="workMode"
              onChange={(event) =>
                updateField("workMode", event.target.value as WorkMode)
              }
              required
              value={formValues.workMode}
            >
              {workModeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FieldError id="workMode-error" message={errors.workMode} />
          </div>

          <div>
            <label
              className="text-sm font-semibold text-slate-700"
              htmlFor="appliedAt"
            >
              Fecha de candidatura
            </label>
            <input
              aria-describedby={errors.appliedAt ? "appliedAt-error" : undefined}
              aria-invalid={Boolean(errors.appliedAt)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-950/10"
              id="appliedAt"
              name="appliedAt"
              onChange={(event) => updateField("appliedAt", event.target.value)}
              required
              type="date"
              value={formValues.appliedAt}
            />
            <FieldError id="appliedAt-error" message={errors.appliedAt} />
          </div>
        </div>

        <div>
          <label
            className="text-sm font-semibold text-slate-700"
            htmlFor="technologies"
          >
            Tecnologías
          </label>
          <input
            aria-describedby={
              errors.technologies
                ? "technologies-help technologies-error"
                : "technologies-help"
            }
            aria-invalid={Boolean(errors.technologies)}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-950/10"
            id="technologies"
            name="technologies"
            onChange={(event) =>
              updateField("technologies", event.target.value)
            }
            placeholder="React, TypeScript, Next.js"
            required
            type="text"
            value={formValues.technologies}
          />
          <p className="mt-1.5 text-xs text-slate-400" id="technologies-help">
            Separa las tecnologías con comas.
          </p>
          <FieldError id="technologies-error" message={errors.technologies} />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950"
            href="/applications"
          >
            Cancelar
          </Link>
          <button
            aria-busy={isPending}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending
              ? "Guardando..."
              : isEditMode
                ? "Guardar cambios"
                : "Crear candidatura"}
          </button>
        </div>
      </form>
    </section>
  );
}
