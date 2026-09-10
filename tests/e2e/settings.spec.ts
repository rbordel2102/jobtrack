import { expect, test } from "./fixtures";

test("permite actualizar el nombre visible desde configuración", async ({
  page,
  testUser,
}) => {
  await page.goto("/settings");

  await expect(
    page.getByRole("heading", { name: "Configuración" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Configuración" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(page.getByLabel("Nombre visible")).toHaveValue(testUser.name);
  await expect(page.getByLabel("Email")).toHaveValue(testUser.email);

  await page.getByLabel("Nombre visible").fill("Nombre Actualizado");
  await page.getByRole("button", { name: "Guardar cambios" }).click();

  await expect(page.getByRole("status")).toContainText(
    "Nombre actualizado correctamente.",
  );

  await page.goto("/settings");
  await expect(page.getByLabel("Nombre visible")).toHaveValue(
    "Nombre Actualizado",
  );
});

test("mantiene el layout estable en los anchos principales", async ({
  page,
  testUser,
}) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/settings");

    await expect(page.getByLabel("Email")).toHaveValue(testUser.email);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Cerrar sesión" }),
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      )
      .toBe(true);

    const sidebar = page.getByRole("complementary", {
      name: "Barra lateral",
    });

    if (viewport.width >= 1024) {
      await expect(sidebar).toBeVisible();
    } else {
      await expect(sidebar).toBeHidden();
    }
  }
});
