import { ApplicationsPage } from "@/components/applications-page";
import { AppShell } from "@/components/app-shell";

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

  return (
    <AppShell
      activeNavigationItem="applications"
      headerDescription="Organiza el progreso de cada oportunidad y mantén claros tus próximos pasos."
      headerEyebrow="Proceso"
      headerTitle="Candidaturas"
    >
      <ApplicationsPage successMessage={successMessage} />
    </AppShell>
  );
}
