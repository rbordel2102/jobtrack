import { test as base, expect } from "@playwright/test";

import { deleteTestUserByEmail } from "../support/test-db";
import {
  createApplication,
  createTestApplication,
  createTestUser,
  getApplicationId,
  registerUser,
  type TestUser,
} from "./helpers";

async function closeAndCleanUsers(
  context: { close: () => Promise<void> },
  users: readonly TestUser[],
): Promise<void> {
  await context.close();

  for (const user of users) {
    await deleteTestUserByEmail(user.email);
  }
}

base("un usuario no ve candidaturas de otro usuario", async ({
  browser,
  page,
}, testInfo) => {
  const userA = createTestUser(`${testInfo.testId}-a`);
  const userB = createTestUser(`${testInfo.testId}-b`);
  const application = createTestApplication(testInfo.testId);
  const userBContext = await browser.newContext();

  try {
    await registerUser(page, userA);
    await createApplication(page, application);

    const userBPage = await userBContext.newPage();
    await registerUser(userBPage, userB);
    await userBPage.goto("/applications");

    await expect(userBPage.getByText(application.company)).not.toBeVisible();
  } finally {
    await closeAndCleanUsers(userBContext, [userA, userB]);
  }
});

base("rechaza el acceso directo a una candidatura ajena", async ({
  browser,
  page,
}, testInfo) => {
  const userA = createTestUser(`${testInfo.testId}-a`);
  const userB = createTestUser(`${testInfo.testId}-b`);
  const application = createTestApplication(testInfo.testId);
  const userBContext = await browser.newContext();

  try {
    await registerUser(page, userA);
    await createApplication(page, application);
    const applicationId = await getApplicationId(page, application.company);

    const userBPage = await userBContext.newPage();
    await registerUser(userBPage, userB);
    await userBPage.goto(`/applications/${applicationId}/edit`);

    await expect(
      userBPage.getByRole("heading", {
        name: "No se ha encontrado la candidatura",
      }),
    ).toBeVisible();
  } finally {
    await closeAndCleanUsers(userBContext, [userA, userB]);
  }
});
