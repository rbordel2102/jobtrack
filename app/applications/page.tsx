import { ApplicationsPage } from "@/components/applications-page";
import { AppShell } from "@/components/app-shell";
import { getApplications } from "@/lib/application-data";
import { requireSession } from "@/lib/auth-utils";
import type { Application } from "@/types/application";

export const dynamic = "force-dynamic";

interface ApplicationsRouteProps {
  searchParams: Promise<{
    error?: string | string[];
    success?: string | string[];
  }>;
}

export default async function ApplicationsRoute({
  searchParams,
}: ApplicationsRouteProps) {
  const session = await requireSession();
  const params = await searchParams;
  const success = Array.isArray(params.success)
    ? params.success[0]
    : params.success;
  const successMessage =
    success === "created"
      ? "Candidatura creada correctamente."
      : success === "updated"
        ? "Candidatura actualizada correctamente."
        : success === "deleted"
          ? "Candidatura eliminada correctamente."
          : undefined;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const errorMessage =
    error === "not_found"
      ? "No se ha encontrado la candidatura."
      : error === "database"
        ? "No se ha podido completar la operación. Inténtalo de nuevo más tarde."
        : undefined;
  let applications: readonly Application[] = [];
  let loadError = false;

  try {
    applications = await getApplications(session.user.id);
  } catch {
    loadError = true;
  }

  return (
    <AppShell
      activeNavigationItem="applications"
      headerDescription="Organiza el progreso de cada oportunidad y mantén claros tus próximos pasos."
      headerEyebrow="Proceso"
      headerTitle="Candidaturas"
      userName={session.user.name}
    >
      <ApplicationsPage
        errorMessage={errorMessage}
        applications={applications}
        loadError={loadError}
        successMessage={successMessage}
      />
    </AppShell>
  );
}
