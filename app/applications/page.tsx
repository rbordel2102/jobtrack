import { ApplicationsPage } from "@/components/applications-page";
import { AppShell } from "@/components/app-shell";
import { applications } from "@/lib/mock-data";

export default function ApplicationsRoute() {
  return (
    <AppShell
      activeNavigationItem="applications"
      headerDescription="Organiza el progreso de cada oportunidad y mantén claros tus próximos pasos."
      headerEyebrow="Proceso"
      headerTitle="Candidaturas"
    >
      <ApplicationsPage applications={applications} />
    </AppShell>
  );
}
