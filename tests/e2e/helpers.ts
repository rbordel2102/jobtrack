import { randomUUID } from "node:crypto";

import { expect, type Page } from "@playwright/test";

export interface TestUser {
  email: string;
  name: string;
  password: string;
}

export interface TestApplication {
  company: string;
  location: string;
  position: string;
  technologies: string;
  updatedCompany: string;
}

function createUniqueSuffix(testId: string): string {
  const readableTestId = testId.replace(/[^a-z0-9]/gi, "").toLowerCase();

  return `${readableTestId.slice(-20)}${randomUUID().slice(0, 8)}`;
}

export function createTestUser(testId: string): TestUser {
  const suffix = createUniqueSuffix(testId);

  return {
    email: `jobtrack-e2e-${suffix}@example.test`,
    name: "JobTrack E2E User",
    password: "test-password-123",
  };
}

export function createTestApplication(testId: string): TestApplication {
  const suffix = createUniqueSuffix(testId);

  return {
    company: `E2E Company ${suffix}`,
    location: "Madrid",
    position: "Frontend developer",
    technologies: "React, TypeScript",
    updatedCompany: `E2E Updated Company ${suffix}`,
  };
}

export async function registerUser(page: Page, user: TestUser): Promise<void> {
  await page.goto("/register");
  await page.getByLabel("Nombre").fill(user.name);
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Contraseña").fill(user.password);
  await page.getByRole("button", { name: "Crear cuenta" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", { name: "Panel" }),
  ).toBeVisible();
}

export async function loginUser(page: Page, user: TestUser): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Contraseña").fill(user.password);
  await page.getByRole("button", { name: "Iniciar sesión" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", { name: "Panel" }),
  ).toBeVisible();
}

export async function logoutUser(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("heading", { name: "Bienvenido de nuevo" }),
  ).toBeVisible();
}

export async function createApplication(
  page: Page,
  application: TestApplication,
): Promise<void> {
  await page.goto("/applications/new");
  await page.getByLabel("Empresa").fill(application.company);
  await page.getByLabel("Puesto").fill(application.position);
  await page.getByLabel("Ubicación").fill(application.location);
  await page.getByLabel("Modalidad").selectOption("remote");
  await page.getByLabel("Fecha de candidatura").fill("2026-08-22");
  await page.getByLabel("Tecnologías").fill(application.technologies);
  await page.getByRole("button", { name: "Crear candidatura" }).click();

  await expect(page).toHaveURL(/\/applications\?success=created$/);
  await expect(page.getByRole("status")).toContainText(
    "Candidatura creada correctamente.",
  );
  await expect(page.getByText(application.company)).toBeVisible();
}

export async function getApplicationId(
  page: Page,
  company: string,
): Promise<string> {
  const applicationCard = page
    .getByRole("article")
    .filter({ hasText: company });
  const editHref = await applicationCard
    .getByRole("link", { name: "Editar" })
    .getAttribute("href");
  const applicationId = editHref?.match(/^\/applications\/([^/]+)\/edit$/)?.[1];

  if (!applicationId) {
    throw new Error(`No se ha podido obtener el id de ${company}.`);
  }

  return applicationId;
}

export async function editApplication(
  page: Page,
  application: TestApplication,
): Promise<void> {
  const applicationId = await getApplicationId(page, application.company);

  await page.goto(`/applications/${applicationId}/edit`);
  await page.getByLabel("Empresa").fill(application.updatedCompany);
  await page.getByRole("button", { name: "Guardar cambios" }).click();

  await expect(page).toHaveURL(/\/applications\?success=updated$/);
  await expect(page.getByText(application.updatedCompany)).toBeVisible();
  await expect(page.getByText(application.company)).not.toBeVisible();
}

export async function deleteApplication(
  page: Page,
  application: TestApplication,
): Promise<void> {
  await page.goto("/applications");
  const applicationCard = page
    .getByRole("article")
    .filter({ hasText: application.company });

  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });
  await applicationCard.getByRole("button", { name: "Eliminar" }).click();

  await expect(page).toHaveURL(/\/applications\?success=deleted$/);
  await expect(page.getByText(application.company)).not.toBeVisible();
}
