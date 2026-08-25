import { ApplicationsPage } from "@/components/applications-page";
import { AppShell } from "@/components/app-shell";
import { getApplications } from "@/lib/application-data";
import type { Application } from "@/types/application";

export const dynamic = "force-dynamic";

interface ApplicationsRouteProps {
  searchParams: Promise<{ success?: string | string[] }>;
}

export default async function ApplicationsRoute({
  searchParams,
}: ApplicationsRouteProps) {
  const params = await searchParams;
  const success = Array.isArray(params.success)
    ? params.success[0]
    : params.success;
  const successMessage =
    success === "created"
      ? "Candidatura creada correctamente."
      : success === "updated"
        ? "Candidatura actualizada correctamente."
        : undefined;
  let applications: readonly Application[] = [];
  let loadError = false;

  try {
    applications = await getApplications();
  } catch {
    loadError = true;
  }

  return (
    <AppShell
      activeNavigationItem="applications"
      headerDescription="Organiza el progreso de cada oportunidad y mantén claros tus próximos pasos."
      headerEyebrow="Proceso"
      headerTitle="Candidaturas"
    >
      <ApplicationsPage
        applications={applications}
        loadError={loadError}
        successMessage={successMessage}
      />
    </AppShell>
  );
}
