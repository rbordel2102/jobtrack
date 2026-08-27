import { test as base, expect } from "@playwright/test";

import { deleteTestUserByEmail } from "../support/test-db";
import { createTestUser, registerUser, type TestUser } from "./helpers";

interface E2EFixtures {
  testUser: TestUser;
}

export const test = base.extend<E2EFixtures>({
  testUser: async ({ page }, applyFixture, testInfo) => {
    const user = createTestUser(testInfo.testId);

    try {
      await registerUser(page, user);
      await applyFixture(user);
    } finally {
      await deleteTestUserByEmail(user.email);
    }
  },
});

export { expect };
