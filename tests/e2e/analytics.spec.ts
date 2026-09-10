import { expect, test } from "./fixtures";
import { createApplication, createTestApplication } from "./helpers";

test("muestra la distribución actual del usuario", async ({ page, testUser }, testInfo) => {
  void testUser;
  const application = createTestApplication(testInfo.testId);

  await createApplication(page, application);
  await page.goto("/analytics");

  await expect(
    page.getByRole("heading", { name: "Indicadores actuales" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Distribución por estado" }),
  ).toBeVisible();
  await expect(page.getByText("Actualmente en entrevista").first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Analizar una oferta" }),
  ).toHaveAttribute("href", "/analytics/offer");
});

test("analiza una oferta con el proveedor local sin servicios externos", async ({
  page,
  testUser,
}) => {
  void testUser;
  await page.goto("/analytics/offer");
  await page.getByLabel("Texto de la oferta").fill(
    "Buscamos una persona desarrolladora frontend con experiencia en React y TypeScript para colaborar con producto y diseño.",
  );
  await page.getByRole("button", { name: "Analizar oferta" }).click();

  await expect(
    page.getByRole("heading", { name: "Análisis de la oferta" }),
  ).toBeVisible();
  await expect(page.getByText("Análisis automático local")).toBeVisible();
  await expect(
    page.getByText(/Oferta orientada a un perfil técnico de desarrollo de software/),
  ).toBeVisible();
});
