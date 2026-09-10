import { expect, test } from "./fixtures";
import {
  createApplication,
  createTestApplication,
  deleteApplication,
  editApplication,
} from "./helpers";

test("crea una candidatura y la muestra en el listado", async ({
  page,
  testUser,
}, testInfo) => {
  const application = createTestApplication(testInfo.testId);
  const firstName = testUser.name.trim().split(/\s+/)[0] ?? testUser.name;

  await expect(
    page.getByRole("banner").getByText(firstName, { exact: true }),
  ).toBeVisible();
  await createApplication(page, application);
});

test("edita una candidatura existente", async ({
  page,
  testUser,
}, testInfo) => {
  const application = createTestApplication(testInfo.testId);
  const firstName = testUser.name.trim().split(/\s+/)[0] ?? testUser.name;

  await expect(
    page.getByRole("banner").getByText(firstName, { exact: true }),
  ).toBeVisible();
  await createApplication(page, application);
  await editApplication(page, application);
});

test("elimina una candidatura después de confirmar", async ({
  page,
  testUser,
}, testInfo) => {
  const application = createTestApplication(testInfo.testId);
  const firstName = testUser.name.trim().split(/\s+/)[0] ?? testUser.name;

  await expect(
    page.getByRole("banner").getByText(firstName, { exact: true }),
  ).toBeVisible();
  await createApplication(page, application);
  await deleteApplication(page, application);
});
