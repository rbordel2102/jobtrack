import type { Application, ApplicationStatus, LogoTone } from "@/types/application";

const statusStyles: Record<ApplicationStatus, string> = {
  Enviada: "bg-blue-50 text-blue-700 ring-blue-600/10",
  Entrevista: "bg-violet-50 text-violet-700 ring-violet-600/10",
  Oferta: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  Rechazada: "bg-rose-50 text-rose-700 ring-rose-600/10",
};

const logoStyles: Record<LogoTone, string> = {
  blue: "bg-blue-50 text-blue-700",
  violet: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
  emerald: "bg-emerald-50 text-emerald-700",
  rose: "bg-rose-50 text-rose-700",
};

interface RecentApplicationsProps {
  applications: readonly Application[];
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  return (
    <section
      aria-labelledby="recent-applications-heading"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
    >
      <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Proceso
          </p>
          <h2
            className="mt-1 text-lg font-semibold tracking-tight text-slate-950"
            id="recent-applications-heading"
          >
            Candidaturas recientes
          </h2>
        </div>
        <p className="text-sm text-slate-400">{applications.length} más recientes</p>
      </div>

      <div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(120px,0.7fr)_minmax(120px,0.6fr)] gap-4 border-b border-slate-100 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 md:grid md:px-6">
        <span>Empresa y puesto</span>
        <span>Estado</span>
        <span>Fecha de envío</span>
      </div>

      <ul className="divide-y divide-slate-100">
        {applications.map((application) => (
          <li
            className="grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,1.5fr)_minmax(120px,0.7fr)_minmax(120px,0.6fr)] md:items-center md:px-6"
            key={application.id}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${logoStyles[application.logoTone]}`}
              >
                {application.companyInitials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {application.company}
                </p>
                <p className="mt-0.5 truncate text-sm text-slate-500">
                  {application.role}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 md:contents">
              <span
                className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[application.status]}`}
              >
                {application.status}
              </span>
              <time
                className="text-sm text-slate-500 md:text-left"
                dateTime={application.appliedAt}
              >
                {application.appliedLabel}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
