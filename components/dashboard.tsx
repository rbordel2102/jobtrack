import { RecentApplications } from "@/components/recent-applications";
import { StatCard } from "@/components/stat-card";
import type { Application, DashboardStat } from "@/types/application";

interface DashboardProps {
  stats: readonly DashboardStat[];
  applications: readonly Application[];
}

export function Dashboard({ stats, applications }: DashboardProps) {
  return (
    <div className="space-y-8">
      <section
        aria-labelledby="dashboard-intro-heading"
        className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-slate-500">Bienvenido de nuevo</p>
          <h2
            className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
            id="dashboard-intro-heading"
          >
            Tu búsqueda de empleo, de un vistazo.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Organiza tus candidaturas, ten claros tus próximos pasos y mantén el
            ritmo.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Todo al día
        </div>
      </section>

      <section aria-labelledby="stats-heading">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Resumen
            </p>
            <h2
              className="mt-1 text-lg font-semibold tracking-tight text-slate-950"
              id="stats-heading"
            >
              Estado del proceso
            </h2>
          </div>
          <p className="text-sm text-slate-400">Datos actuales</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </section>

      <RecentApplications applications={applications} />
    </div>
  );
}
