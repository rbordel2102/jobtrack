import { ApplicationForm } from "@/components/application-form";
import { AppShell } from "@/components/app-shell";
import { createApplicationAction } from "@/app/applications/actions";
import { emptyApplicationFormValues } from "@/lib/application-validation";

export default function NewApplicationRoute() {
  return (
    <AppShell
      activeNavigationItem="applications"
      headerDescription="Añade una nueva oportunidad a tu proceso de búsqueda."
      headerEyebrow="Proceso"
      headerTitle="Nueva candidatura"
    >
      <ApplicationForm
        action={createApplicationAction}
        initialValues={emptyApplicationFormValues}
        mode="create"
      />
    </AppShell>
  );
}
