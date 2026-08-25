"use client";

import Link from "next/link";
import { useState } from "react";

import { Icon } from "@/components/icon";
import {
  applicationStatusLabels,
  applicationStatusOptions,
  workModeLabels,
} from "@/lib/application-config";
import { formatApplicationDate } from "@/lib/application-utils";
import type { Application, ApplicationStatus } from "@/types/application";

const statusStyles: Record<ApplicationStatus, string> = {
  applied: "bg-blue-50 text-blue-700 ring-blue-600/10",
  interview: "bg-violet-50 text-violet-700 ring-violet-600/10",
  technical_test: "bg-amber-50 text-amber-700 ring-amber-600/10",
  offer: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  rejected: "bg-rose-50 text-rose-700 ring-rose-600/10",
};

interface ApplicationsListProps {
  applications: readonly Application[];
}

export function ApplicationsList({ applications }: ApplicationsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all",
  );
  const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase("es-ES");

  const filteredApplications = applications.filter((application) => {
    const normalizedCompany = application.company.toLocaleLowerCase("es-ES");
    const normalizedPosition = application.position.toLocaleLowerCase("es-ES");
    const matchesSearch =
      normalizedSearchTerm.length === 0 ||
      normalizedCompany.includes(normalizedSearchTerm) ||
      normalizedPosition.includes(normalizedSearchTerm);
    const matchesStatus =
      statusFilter === "all" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <section
      aria-labelledby="applications-list-heading"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
    >
      <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Seguimiento
          </p>
          <h2
            className="mt-1 text-lg font-semibold tracking-tight text-slate-950"
            id="applications-list-heading"
          >
            Todas tus candidaturas
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          {filteredApplications.length} {filteredApplications.length === 1 ? "candidatura" : "candidaturas"}
        </p>
      </div>

      <div className="flex min-w-0 flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-end sm:px-6">
        <label className="min-w-0 flex-1">
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Buscar
          </span>
          <span className="relative block">
            <Icon
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              name="search"
            />
            <input
              aria-label="Buscar por empresa o puesto"
              className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-950/10"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Empresa o puesto"
              type="search"
              value={searchTerm}
            />
          </span>
        </label>

        <label className="min-w-0 sm:w-56 sm:shrink-0">
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">
            Estado
          </span>
          <select
            aria-label="Filtrar por estado"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-950/10"
            onChange={(event) =>
              setStatusFilter(event.target.value as ApplicationStatus | "all")
            }
            value={statusFilter}
          >
            <option value="all">Todos los estados</option>
            {applicationStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="px-5 py-14 text-center sm:px-6">
          <p className="text-sm font-semibold text-slate-950">
            No hay candidaturas que coincidan.
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Prueba a cambiar la búsqueda o seleccionar otro estado.
          </p>
        </div>
      ) : (
        <ul className="grid min-w-0 gap-4 p-4 sm:p-5 xl:grid-cols-2">
          {filteredApplications.map((application) => (
            <li className="min-w-0" key={application.id}>
              <article className="h-full min-w-0 rounded-2xl border border-slate-200 p-4 transition-colors hover:border-slate-200">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-1">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700">
                    {application.companyInitials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-sm font-semibold text-slate-950 sm:truncate">
                      {application.company}
                    </h3>
                    <p className="mt-0.5 break-words text-sm text-slate-500 sm:truncate">
                      {application.position}
                    </p>
                  </div>
                  <span
                    className={`col-span-2 inline-flex w-fit max-w-full flex-wrap items-center break-words rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset sm:col-span-1 ${statusStyles[application.status]}`}
                  >
                    {applicationStatusLabels[application.status]}
                  </span>
                </div>

                <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Ubicación
                    </dt>
                    <dd className="mt-1 break-words text-sm text-slate-600">
                      {application.location}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Modalidad
                    </dt>
                    <dd className="mt-1 break-words text-sm text-slate-600">
                      {workModeLabels[application.workMode]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Fecha de candidatura
                    </dt>
                    <dd className="mt-1 break-words text-sm text-slate-600">
                      <time dateTime={application.appliedAt}>
                        {formatApplicationDate(application.appliedAt)}
                      </time>
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Tecnologías principales
                  </p>
                  <ul className="mt-2 flex min-w-0 flex-wrap gap-2">
                    {application.technologies.map((technology) => (
                      <li
                        className="max-w-full break-words rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                        key={technology}
                      >
                        {technology}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex justify-end">
                  <Link
                    className="inline-flex min-h-9 items-center justify-center rounded-lg px-3 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950"
                    href={`/applications/${application.id}/edit`}
                  >
                    Editar
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
