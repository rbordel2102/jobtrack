import Link from "next/link";

import {
  applicationStatusLabels,
  workModeLabels,
} from "@/lib/application-config";
import type {
  AnalyticsStatusCount,
  AnalyticsSummary,
  AnalyticsWorkModeCount,
} from "@/types/analytics";

interface AnalyticsPageProps {
  summary: AnalyticsSummary;
}

const statusStyles: Record<AnalyticsStatusCount["status"], string> = {
  applied: "bg-blue-500",
  interview: "bg-violet-500",
  technical_test: "bg-amber-500",
  offer: "bg-emerald-500",
  rejected: "bg-rose-500",
};

const workModeStyles: Record<AnalyticsWorkModeCount["workMode"], string> = {
  remote: "bg-cyan-500",
  hybrid: "bg-indigo-500",
  onsite: "bg-slate-500",
};

function formatPercentage(value: number | null): string {
  return value === null ? "Sin datos" : `${value.toLocaleString("es-ES")} %`;
}

function getCountBarWidth(count: number, total: number): string {
  if (total === 0) {
    return "0%";
  }

  return `${Math.max((count / total) * 100, count > 0 ? 4 : 0)}%`;
}

function AnalyticsBar({
  count,
  label,
  percentage,
  style,
  total,
}: {
  count: number;
  label: string;
  percentage: number | null;
  style: string;
  total: number;
}) {
  return (
    <li className="space-y-2">
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="shrink-0 text-slate-500">
          {count} · {formatPercentage(percentage)}
        </span>
      </div>
      <div
        aria-hidden="true"
        className="h-2 overflow-hidden rounded-full bg-slate-100"
      >
        <div
          className={`h-full rounded-full ${style}`}
          style={{ width: getCountBarWidth(count, total) }}
        />
      </div>
    </li>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
      {message}
    </p>
  );
}

export function AnalyticsPage({ summary }: AnalyticsPageProps) {
  const statusLabels = summary.statusCounts.map((item) => ({
    ...item,
    label: applicationStatusLabels[item.status],
  }));
  const pipelineLabels = [
    "Actualmente aplicadas",
    "Actualmente en entrevista",
    "Actualmente en prueba técnica",
    "Actualmente en oferta",
    "Actualmente rechazadas",
  ];

  return (
    <div className="space-y-8">
      <section
        aria-labelledby="analytics-intro-heading"
        className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-slate-500">
            Datos de tu proceso
          </p>
          <h2
            className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
            id="analytics-intro-heading"
          >
            Entiende cómo está tu búsqueda de empleo ahora.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            Estas métricas describen únicamente el estado actual de tus
            candidaturas. No representan conversiones históricas.
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 sm:w-auto"
          href="/analytics/offer"
        >
          Analizar una oferta
        </Link>
      </section>

      {summary.total === 0 ? (
        <p
          className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800"
          role="status"
        >
          Todavía no hay candidaturas para analizar. Cuando añadas una,
          aparecerán aquí tus datos actuales.
        </p>
      ) : null}

      <section aria-labelledby="analytics-summary-heading">
        <div className="mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Resumen
          </p>
          <h2
            className="mt-1 text-lg font-semibold tracking-tight text-slate-950"
            id="analytics-summary-heading"
          >
            Indicadores actuales
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <p className="text-sm font-medium text-slate-500">
              Total de candidaturas
            </p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              {summary.total}
            </p>
            <p className="mt-2 text-sm leading-5 text-slate-500">
              Registros de tu proceso actual.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <p className="text-sm font-medium text-slate-500">
              Actualmente en entrevista
            </p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              {formatPercentage(summary.interviewRate)}
            </p>
            <p className="mt-2 text-sm leading-5 text-slate-500">
              Porcentaje de candidaturas cuyo estado actual es entrevista.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <p className="text-sm font-medium text-slate-500">
              Actualmente en oferta
            </p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              {formatPercentage(summary.offerRate)}
            </p>
            <p className="mt-2 text-sm leading-5 text-slate-500">
              Porcentaje de candidaturas cuyo estado actual es oferta.
            </p>
          </article>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section
          aria-labelledby="status-distribution-heading"
          className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Estado actual
            </p>
            <h2
              className="mt-1 text-lg font-semibold tracking-tight text-slate-950"
              id="status-distribution-heading"
            >
              Distribución por estado
            </h2>
          </div>
          <ul className="mt-6 space-y-5">
            {statusLabels.map((item) => (
              <AnalyticsBar
                count={item.count}
                key={item.status}
                label={item.label}
                percentage={item.percentage}
                style={statusStyles[item.status]}
                total={summary.total}
              />
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="work-mode-heading"
          className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Preferencias registradas
            </p>
            <h2
              className="mt-1 text-lg font-semibold tracking-tight text-slate-950"
              id="work-mode-heading"
            >
              Distribución por modalidad
            </h2>
          </div>
          <ul className="mt-6 space-y-5">
            {summary.workModeCounts.map((item) => (
              <AnalyticsBar
                count={item.count}
                key={item.workMode}
                label={workModeLabels[item.workMode]}
                percentage={item.percentage}
                style={workModeStyles[item.workMode]}
                total={summary.total}
              />
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section
          aria-labelledby="technology-frequency-heading"
          className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Palabras registradas
            </p>
            <h2
              className="mt-1 text-lg font-semibold tracking-tight text-slate-950"
              id="technology-frequency-heading"
            >
              Tecnologías más frecuentes
            </h2>
          </div>
          {summary.technologies.length === 0 ? (
            <div className="mt-6">
              <EmptyState message="No hay tecnologías registradas todavía." />
            </div>
          ) : (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {summary.technologies.slice(0, 10).map((technology) => (
                <li
                  className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3"
                  key={technology.name}
                >
                  <span className="min-w-0 break-words text-sm font-medium text-slate-700">
                    {technology.name}
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-slate-950">
                    {technology.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          aria-labelledby="pipeline-heading"
          className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Snapshot del proceso
            </p>
            <h2
              className="mt-1 text-lg font-semibold tracking-tight text-slate-950"
              id="pipeline-heading"
            >
              Pipeline actual
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Cada cifra refleja el estado actual guardado, no una etapa
              histórica alcanzada.
            </p>
          </div>
          <ol className="mt-6 space-y-3">
            {summary.pipeline.map((item, index) => (
              <li
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 px-4 py-3"
                key={item.status}
              >
                <span className="flex min-w-0 items-center gap-3 text-sm font-medium text-slate-700">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                    {index + 1}
                  </span>
                  <span className="break-words">
                    {pipelineLabels[index] ?? applicationStatusLabels[item.status]}
                  </span>
                </span>
                <span className="shrink-0 text-lg font-semibold text-slate-950">
                  {item.count}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section
        aria-labelledby="monthly-evolution-heading"
        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Fecha de candidatura
          </p>
          <h2
            className="mt-1 text-lg font-semibold tracking-tight text-slate-950"
            id="monthly-evolution-heading"
          >
            Evolución mensual
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Número de candidaturas agrupadas según su fecha de envío.
          </p>
        </div>
        {summary.monthlyApplications.length === 0 ? (
          <div className="mt-6">
            <EmptyState message="No hay fechas de candidatura para mostrar." />
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Candidaturas enviadas por mes
              </caption>
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.12em] text-slate-400">
                  <th className="px-3 py-3 font-semibold" scope="col">
                    Mes
                  </th>
                  <th className="px-3 py-3 font-semibold" scope="col">
                    Candidaturas
                  </th>
                  <th className="px-3 py-3 font-semibold" scope="col">
                    Representación
                  </th>
                </tr>
              </thead>
              <tbody>
                {summary.monthlyApplications.map((month) => (
                  <tr className="border-b border-slate-50 last:border-0" key={month.month}>
                    <th className="px-3 py-4 font-medium text-slate-700" scope="row">
                      {month.label}
                    </th>
                    <td className="px-3 py-4 font-semibold text-slate-950">
                      {month.count}
                    </td>
                    <td className="px-3 py-4">
                      <div
                        aria-hidden="true"
                        className="h-2 min-w-32 overflow-hidden rounded-full bg-slate-100"
                      >
                        <div
                          className="h-full rounded-full bg-slate-800"
                          style={{
                            width: `${Math.max(
                              (month.count /
                                Math.max(
                                  ...summary.monthlyApplications.map(
                                    (item) => item.count,
                                  ),
                                )) *
                                100,
                              4,
                            )}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
