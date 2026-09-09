import type { JobOfferAnalysis } from "@/types/offer-analysis";

const seniorityLabels: Record<JobOfferAnalysis["seniority"], string> = {
  intern: "Prácticas",
  junior: "Junior",
  mid: "Intermedio",
  senior: "Senior",
  lead: "Lead",
  unknown: "No determinado",
};

const workModeLabels: Record<JobOfferAnalysis["workMode"], string> = {
  remote: "Remoto",
  hybrid: "Híbrido",
  onsite: "Presencial",
  unknown: "No determinada",
};

interface OfferAnalysisResultProps {
  result: JobOfferAnalysis;
}

function ResultList({
  emptyMessage,
  items,
}: {
  emptyMessage: string;
  items: readonly string[];
}) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li className="flex gap-2 text-sm leading-6 text-slate-600" key={item}>
          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function OfferAnalysisResult({ result }: OfferAnalysisResultProps) {
  return (
    <section
      aria-labelledby="offer-analysis-result-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
    >
      <div className="border-b border-slate-100 pb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Resultado
        </p>
        <h2
          className="mt-1 text-lg font-semibold tracking-tight text-slate-950"
          id="offer-analysis-result-heading"
        >
          Análisis de la oferta
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Es una interpretación aproximada del texto proporcionado, no una
          evaluación objetiva de compatibilidad.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            Nivel aproximado
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-950">
            {seniorityLabels[result.seniority]}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            Modalidad inferida
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-950">
            {workModeLabels[result.workMode]}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-950">Resumen</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{result.summary}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-950">Tecnologías detectadas</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {result.technologies.length === 0 ? (
              <p className="text-sm text-slate-500">No se han detectado tecnologías claras.</p>
            ) : (
              result.technologies.map((technology) => (
                <span
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                  key={technology}
                >
                  {technology}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 border-t border-slate-100 pt-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-950">Habilidades y palabras clave</h3>
          <div className="mt-3">
            <ResultList
              emptyMessage="No se han detectado palabras clave claras."
              items={result.keywords}
            />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-950">
            Qué deberías destacar
          </h3>
          <div className="mt-3">
            <ResultList
              emptyMessage="No hay recomendaciones específicas para esta oferta."
              items={result.applicationHighlights}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
