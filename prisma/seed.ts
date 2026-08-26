import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../generated/prisma/client";

const directUrl = process.env.DIRECT_URL;

if (!directUrl) {
  throw new Error("DIRECT_URL no está configurada.");
}

const adapter = new PrismaPg({ connectionString: directUrl });
const prisma = new PrismaClient({ adapter });

const seedApplications = [
  {
    id: "app-linear",
    company: "Linear",
    position: "Diseñador/a de producto sénior",
    status: "interview",
    location: "Madrid, España",
    workMode: "hybrid",
    appliedAt: new Date("2026-08-22T00:00:00.000Z"),
    technologies: ["Figma", "FigJam", "User research"],
  },
  {
    id: "app-vercel",
    company: "Vercel",
    position: "Ingeniero/a frontend",
    status: "applied",
    location: "Remoto",
    workMode: "remote",
    appliedAt: new Date("2026-08-21T00:00:00.000Z"),
    technologies: ["React", "TypeScript", "Next.js"],
  },
  {
    id: "app-notion",
    company: "Notion",
    position: "Responsable de producto",
    status: "offer",
    location: "Londres, Reino Unido",
    workMode: "onsite",
    appliedAt: new Date("2026-08-18T00:00:00.000Z"),
    technologies: ["Product strategy", "SQL", "Analytics"],
  },
  {
    id: "app-ramp",
    company: "Ramp",
    position: "Diseñador/a UX sénior",
    status: "rejected",
    location: "Nueva York, Estados Unidos",
    workMode: "hybrid",
    appliedAt: new Date("2026-08-16T00:00:00.000Z"),
    technologies: ["Figma", "Prototyping", "Design systems"],
  },
  {
    id: "app-figma",
    company: "Figma",
    position: "Ingeniero/a de diseño",
    status: "technical_test",
    location: "San Francisco, Estados Unidos",
    workMode: "remote",
    appliedAt: new Date("2026-08-14T00:00:00.000Z"),
    technologies: ["React", "TypeScript", "CSS"],
  },
  {
    id: "app-stripe",
    company: "Stripe",
    position: "Ingeniero/a de software",
    status: "applied",
    location: "Dublín, Irlanda",
    workMode: "hybrid",
    appliedAt: new Date("2026-08-12T00:00:00.000Z"),
    technologies: ["Node.js", "TypeScript", "PostgreSQL"],
  },
  {
    id: "app-github",
    company: "GitHub",
    position: "Diseñador/a de producto",
    status: "interview",
    location: "Remoto",
    workMode: "remote",
    appliedAt: new Date("2026-08-10T00:00:00.000Z"),
    technologies: ["Figma", "Accessibility", "Design systems"],
  },
  {
    id: "app-airbnb",
    company: "Airbnb",
    position: "Ingeniero/a frontend",
    status: "technical_test",
    location: "Barcelona, España",
    workMode: "onsite",
    appliedAt: new Date("2026-08-07T00:00:00.000Z"),
    technologies: ["React", "GraphQL", "Testing"],
  },
] satisfies Omit<Prisma.ApplicationCreateManyInput, "userId">[];

async function seed() {
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!user) {
    console.log("No hay usuarios para asociar las candidaturas de desarrollo.");
    return;
  }

  await prisma.application.createMany({
    data: seedApplications.map((application) => ({
      ...application,
      userId: user.id,
    })) satisfies Prisma.ApplicationCreateManyInput[],
    skipDuplicates: true,
  });
}

seed()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(() => {
    process.exitCode = 1;
  });
