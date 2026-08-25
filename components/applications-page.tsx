import { ApplicationsList } from "@/components/applications-list";
import type { Application } from "@/types/application";

interface ApplicationsPageProps {
  applications: readonly Application[];
}

export function ApplicationsPage({ applications }: ApplicationsPageProps) {
  return <ApplicationsList applications={applications} />;
}
