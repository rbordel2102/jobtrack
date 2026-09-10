import { AppShell } from "@/components/app-shell";
import { Dashboard } from "@/components/dashboard";
import { getApplications } from "@/lib/application-data";
import { getDashboardStats } from "@/lib/application-utils";
import { requireSession } from "@/lib/auth-utils";
import type { Application } from "@/types/application";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await requireSession();
  let applications: readonly Application[];

  try {
    applications = await getApplications(session.user.id);
  } catch {
    return (
      <AppShell
        activeNavigationItem="dashboard"
        headerEyebrow="Resumen"
        headerTitle="Panel"
        userName={session.user.name}
      >
        <p
          className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-10 text-center text-sm font-medium text-rose-700 sm:px-6"
          role="alert"
        >
          No se han podido cargar los datos del panel. Inténtalo de nuevo más
          tarde.
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeNavigationItem="dashboard"
      headerEyebrow="Resumen"
      headerTitle="Panel"
      userName={session.user.name}
    >
      <Dashboard
        applications={applications.slice(0, 5)}
        stats={getDashboardStats(applications)}
      />
    </AppShell>
  );
}
