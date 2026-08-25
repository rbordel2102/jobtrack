import { EditApplicationForm } from "@/components/application-form";
import { AppShell } from "@/components/app-shell";

interface EditApplicationRouteProps {
  params: Promise<{ id: string }>;
}

export default async function EditApplicationRoute({
  params,
}: EditApplicationRouteProps) {
  const { id } = await params;

  return (
    <AppShell
      activeNavigationItem="applications"
      headerDescription="Revisa y actualiza la información de esta oportunidad."
      headerEyebrow="Proceso"
      headerTitle="Editar candidatura"
    >
      <EditApplicationForm applicationId={id} />
    </AppShell>
  );
}
