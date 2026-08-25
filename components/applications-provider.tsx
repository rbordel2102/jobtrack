"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import { getCompanyInitials } from "@/lib/application-utils";
import type { Application, ApplicationInput } from "@/types/application";

interface ApplicationsContextValue {
  applications: readonly Application[];
  createApplication: (input: ApplicationInput) => void;
  findApplication: (id: string) => Application | undefined;
  updateApplication: (id: string, input: ApplicationInput) => void;
}

interface ApplicationsProviderProps {
  children: ReactNode;
  initialApplications: readonly Application[];
}

const ApplicationsContext = createContext<ApplicationsContextValue | null>(
  null,
);

export function ApplicationsProvider({
  children,
  initialApplications,
}: ApplicationsProviderProps) {
  const [applications, setApplications] = useState<Application[]>(() => [
    ...initialApplications,
  ]);

  function createApplication(input: ApplicationInput) {
    const application: Application = {
      ...input,
      id: `app-${crypto.randomUUID()}`,
      companyInitials: getCompanyInitials(input.company),
    };

    setApplications((currentApplications) => [
      application,
      ...currentApplications,
    ]);
  }

  function updateApplication(id: string, input: ApplicationInput) {
    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === id
          ? {
              ...input,
              id,
              companyInitials: getCompanyInitials(input.company),
            }
          : application,
      ),
    );
  }

  function findApplication(id: string) {
    return applications.find((application) => application.id === id);
  }

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
        createApplication,
        findApplication,
        updateApplication,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications(): ApplicationsContextValue {
  const context = useContext(ApplicationsContext);

  if (!context) {
    throw new Error("useApplications must be used within ApplicationsProvider");
  }

  return context;
}
