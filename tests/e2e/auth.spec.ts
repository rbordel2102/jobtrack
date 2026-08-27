import { test as base, expect } from "@playwright/test";

import { deleteTestUserByEmail } from "../support/test-db";
import {
  createTestUser,
  loginUser,
  logoutUser,
  registerUser,
} from "./helpers";
import { test } from "./fixtures";

base("registro crea una cuenta y abre el panel", async ({ page }, testInfo) => {
  const user = createTestUser(testInfo.testId);

  try {
    await registerUser(page, user);
    await expect(page.getByText(user.name)).toBeVisible();
  } finally {
    await deleteTestUserByEmail(user.email);
  }
});

test("login permite volver a entrar con una cuenta existente", async ({
  page,
  testUser,
}) => {
  await logoutUser(page);
  await loginUser(page, testUser);
});

test("logout cierra la sesión y deja protegidas las rutas", async ({
  page,
  testUser,
}) => {
  await expect(page.getByText(testUser.name)).toBeVisible();
  await logoutUser(page);

  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
});

base("las rutas protegidas redirigen a login sin sesión", async ({ page }) => {
  for (const route of ["/", "/applications", "/applications/new"]) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/login$/);
  }
});
