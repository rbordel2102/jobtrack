import "server-only";

import { getCompanyInitials } from "@/lib/application-utils";
import { prisma } from "@/lib/prisma";
import type { Application, ApplicationInput } from "@/types/application";

interface ApplicationRecord {
  id: string;
  company: string;
  position: string;
  status: Application["status"];
  location: string;
  workMode: Application["workMode"];
  appliedAt: Date;
  technologies: string[];
}

function toApplication(record: ApplicationRecord): Application {
  return {
    id: record.id,
    company: record.company,
    companyInitials: getCompanyInitials(record.company),
    position: record.position,
    status: record.status,
    location: record.location,
    workMode: record.workMode,
    appliedAt: record.appliedAt.toISOString().slice(0, 10),
    technologies: record.technologies,
  };
}

function toDatabaseDate(appliedAt: string): Date {
  return new Date(`${appliedAt}T00:00:00.000Z`);
}

export async function getApplications(): Promise<readonly Application[]> {
  const records = await prisma.application.findMany({
    orderBy: [{ appliedAt: "desc" }, { createdAt: "desc" }],
  });

  return records.map(toApplication);
}

export async function getApplication(
  id: string,
): Promise<Application | null> {
  const record = await prisma.application.findUnique({
    where: { id },
  });

  return record ? toApplication(record) : null;
}

export async function createApplication(
  input: ApplicationInput,
): Promise<Application> {
  const record = await prisma.application.create({
    data: {
      company: input.company,
      position: input.position,
      status: input.status,
      location: input.location,
      workMode: input.workMode,
      appliedAt: toDatabaseDate(input.appliedAt),
      technologies: [...input.technologies],
    },
  });

  return toApplication(record);
}

export async function updateApplication(
  id: string,
  input: ApplicationInput,
): Promise<Application> {
  const record = await prisma.application.update({
    where: { id },
    data: {
      company: input.company,
      position: input.position,
      status: input.status,
      location: input.location,
      workMode: input.workMode,
      appliedAt: toDatabaseDate(input.appliedAt),
      technologies: [...input.technologies],
    },
  });

  return toApplication(record);
}
