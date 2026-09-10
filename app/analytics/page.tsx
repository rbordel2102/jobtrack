import { AnalyticsPage } from "@/components/analytics-page";
import { AppShell } from "@/components/app-shell";
import { getAnalytics } from "@/lib/analytics-data";
import { requireSession } from "@/lib/auth-utils";
import type { AnalyticsSummary } from "@/types/analytics";

export const dynamic = "force-dynamic";

export default async function AnalyticsRoute() {
  const session = await requireSession();
  let summary: AnalyticsSummary;

  try {
    summary = await getAnalytics(session.user.id);
  } catch {
    return (
      <AppShell
        activeNavigationItem="analytics"
        headerDescription="Revisa los datos actuales de tu búsqueda de empleo."
        headerEyebrow="Analíticas"
        headerTitle="Analíticas"
        userName={session.user.name}
      >
        <p
          className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-10 text-center text-sm font-medium text-rose-700 sm:px-6"
          role="alert"
        >
          No se han podido cargar las analíticas. Inténtalo de nuevo más tarde.
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeNavigationItem="analytics"
      headerDescription="Revisa los datos actuales de tu búsqueda de empleo."
      headerEyebrow="Analíticas"
      headerTitle="Analíticas"
      userName={session.user.name}
    >
      <AnalyticsPage summary={summary} />
    </AppShell>
  );
}
