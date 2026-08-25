import { AppShell } from "@/components/app-shell";
import { Dashboard } from "@/components/dashboard";
import { dashboardStats, recentApplications } from "@/lib/mock-data";

export default function Home() {
  return (
    <AppShell
      activeNavigationItem="dashboard"
      headerEyebrow="Resumen"
      headerTitle="Panel"
    >
      <Dashboard stats={dashboardStats} applications={recentApplications} />
    </AppShell>
  );
}
