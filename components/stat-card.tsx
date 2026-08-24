import { Icon } from "@/components/icon";
import type { DashboardStat } from "@/types/application";

const iconStyles: Record<DashboardStat["label"], string> = {
  Candidaturas: "bg-blue-50 text-blue-600",
  Entrevistas: "bg-violet-50 text-violet-600",
  Ofertas: "bg-amber-50 text-amber-600",
  Rechazos: "bg-rose-50 text-rose-600",
};

interface StatCardProps {
  stat: DashboardStat;
}

export function StatCard({ stat }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyles[stat.label]}`}
        >
          <Icon className="h-5 w-5" name={stat.icon} />
        </span>
      </div>

      <div className="mt-5 flex items-end gap-3">
        <p className="text-3xl font-semibold tracking-tight text-slate-950">
          {stat.value}
        </p>
        <span
          className="mb-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700"
        >
          {stat.change}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-400">{stat.changeLabel}</p>
      <p className="mt-5 text-sm leading-5 text-slate-500">{stat.helperText}</p>
    </article>
  );
}
