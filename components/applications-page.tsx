import Link from "next/link";

import { ApplicationsList } from "@/components/applications-list";

interface ApplicationsPageProps {
  successMessage?: string;
}

export function ApplicationsPage({ successMessage }: ApplicationsPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 sm:w-auto"
          href="/applications/new"
        >
          Nueva candidatura
        </Link>
      </div>

      {successMessage ? (
        <p
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          role="status"
        >
          {successMessage}
        </p>
      ) : null}

      <ApplicationsList />
    </div>
  );
}
