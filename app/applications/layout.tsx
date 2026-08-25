import type { ReactNode } from "react";

import { ApplicationsProvider } from "@/components/applications-provider";
import { applications } from "@/lib/mock-data";

interface ApplicationsLayoutProps {
  children: ReactNode;
}

export default function ApplicationsLayout({
  children,
}: ApplicationsLayoutProps) {
  return (
    <ApplicationsProvider initialApplications={applications}>
      {children}
    </ApplicationsProvider>
  );
}
