"use client";

import { useActionState, useState } from "react";
import type { FormEvent } from "react";

import { OfferAnalysisResult } from "@/components/offer-analysis-result";
import {
  initialOfferAnalysisActionState,
  type OfferAnalysisAction,
  type OfferAnalysisProvider,
} from "@/types/offer-analysis";
import {
  MAX_OFFER_TEXT_LENGTH,
  validateOfferText,
} from "@/lib/offer-analysis-validation";

interface OfferAnalysisFormProps {
  action: OfferAnalysisAction;
  provider: OfferAnalysisProvider;
}

export function OfferAnalysisForm({ action, provider }: OfferAnalysisFormProps) {
  const [offerText, setOfferText] = useState("");
  const [clientError, setClientError] = useState<string | undefined>();
  const [state, formAction, isPending] = useActionState(
    action,
    initialOfferAnalysisActionState,
  );
  const error = clientError ?? state.error;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const validation = validateOfferText(offerText);

    if (validation.error) {
      event.preventDefault();
      setClientError(validation.error);
      return;
    }

    setClientError(undefined);
  }

  function handleTextChange(value: string) {
    setOfferText(value);

    if (clientError) {
      setClientError(undefined);
    }
  }

  return (
    <div className="space-y-6">
      <section
        aria-labelledby="offer-analysis-form-heading"
        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
      >
        <div className="border-b border-slate-100 pb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Análisis asistido
          </p>
          <h2
            className="mt-1 text-lg font-semibold tracking-tight text-slate-950"
            id="offer-analysis-form-heading"
          >
            Pega una oferta de empleo
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Obtén un resumen, las tecnologías detectadas y los puntos que
            podrías destacar al aplicar.
          </p>
        </div>

        {provider === "openai" ? (
          <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
          El texto se enviará a un proveedor externo para analizarlo. No pegues
          información personal, confidencial o que no tengas permiso para
          compartir.
          </p>
        ) : (
          <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
            <span className="font-semibold">Análisis automático local.</span>{" "}
            El análisis se realiza en JobTrack sin enviar el texto a servicios
            externos.
          </p>
        )}

        {error ? (
          <p
            aria-live="polite"
            className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <form
          action={formAction}
          className="mt-6 space-y-4"
          noValidate
          onSubmit={handleSubmit}
        >
          <label className="block" htmlFor="offerText">
            <span className="text-sm font-semibold text-slate-700">
              Texto de la oferta
            </span>
            <textarea
              aria-describedby="offer-text-help"
              aria-invalid={Boolean(error)}
              className="mt-2 min-h-64 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-950/10"
              id="offerText"
              maxLength={MAX_OFFER_TEXT_LENGTH}
              name="offerText"
              onChange={(event) => handleTextChange(event.target.value)}
              placeholder="Pega aquí la descripción de la oferta..."
              required
              value={offerText}
            />
          </label>
          <div className="flex flex-col gap-1 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p id="offer-text-help">
              Entre 80 y {MAX_OFFER_TEXT_LENGTH.toLocaleString("es-ES")} caracteres.
            </p>
            <p aria-live="polite">
              {offerText.length.toLocaleString("es-ES")} / {MAX_OFFER_TEXT_LENGTH.toLocaleString("es-ES")}
            </p>
          </div>
          <button
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Analizando..." : "Analizar oferta"}
          </button>
        </form>
      </section>

      {state.status === "success" && state.result ? (
        <OfferAnalysisResult result={state.result} />
      ) : null}
    </div>
  );
}
