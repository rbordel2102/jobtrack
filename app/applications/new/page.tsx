import { ApplicationForm } from "@/components/application-form";
import { AppShell } from "@/components/app-shell";
import { createApplicationAction } from "@/app/applications/actions";
import { emptyApplicationFormValues } from "@/lib/application-validation";
import { requireSession } from "@/lib/auth-utils";

export default async function NewApplicationRoute() {
  const session = await requireSession();

  return (
    <AppShell
      activeNavigationItem="applications"
      headerDescription="Añade una nueva oportunidad a tu proceso de búsqueda."
      headerEyebrow="Proceso"
      headerTitle="Nueva candidatura"
      userName={session.user.name}
    >
      <ApplicationForm
        action={createApplicationAction}
        initialValues={emptyApplicationFormValues}
        mode="create"
      />
    </AppShell>
  );
}
