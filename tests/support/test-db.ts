import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

import { getTestRuntimeEnvironment } from "./test-env";

export async function deleteTestUserByEmail(email: string): Promise<void> {
  const environment = getTestRuntimeEnvironment();
  const adapter = new PrismaPg({
    connectionString: environment.DIRECT_URL,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (user) {
      await prisma.user.delete({ where: { id: user.id } });
    }
  } finally {
    await prisma.$disconnect();
  }
}
