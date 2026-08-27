import { describe, expect, it } from "vitest";

import {
  getApplicationFormValues,
  getApplicationFormValuesFromFormData,
  parseTechnologies,
  toApplicationInput,
  validateApplicationForm,
  type ApplicationFormValues,
} from "@/lib/application-validation";
import type { Application } from "@/types/application";

const validFormValues: ApplicationFormValues = {
  company: "Acme",
  position: "Frontend developer",
  status: "applied",
  location: "Madrid",
  workMode: "remote",
  appliedAt: "2026-08-22",
  technologies: "React, TypeScript",
};

const application: Application = {
  ...toApplicationInput(validFormValues),
  id: "application-1",
  companyInitials: "AC",
};

function createFormData(
  values: Record<keyof ApplicationFormValues, string>,
): FormData {
  const formData = new FormData();

  for (const [name, value] of Object.entries(values)) {
    formData.set(name, value);
  }

  return formData;
}

describe("application validation", () => {
  it("separa y limpia las tecnologías", () => {
    expect(parseTechnologies(" React, , TypeScript ,, Next.js ")).toEqual([
      "React",
      "TypeScript",
      "Next.js",
    ]);
  });

  it("lee los valores válidos de FormData", () => {
    const result = getApplicationFormValuesFromFormData(
      createFormData(validFormValues),
    );

    expect(result.errors).toEqual({});
    expect(result.values).toEqual(validFormValues);
  });

  it("rechaza status y modalidad no válidos", () => {
    const result = getApplicationFormValuesFromFormData(
      createFormData({
        ...validFormValues,
        status: "unknown",
        workMode: "flexible",
      }),
    );

    expect(result.errors).toEqual({
      status: "Selecciona un estado válido.",
      workMode: "Selecciona una modalidad válida.",
    });
    expect(result.values.status).toBe("applied");
    expect(result.values.workMode).toBe("remote");
  });

  it("detecta campos obligatorios y fechas imposibles", () => {
    const errors = validateApplicationForm({
      ...validFormValues,
      company: " ",
      position: "",
      location: "",
      appliedAt: "2026-02-30",
      technologies: " , ",
    });

    expect(errors).toEqual({
      company: "Introduce el nombre de la empresa.",
      position: "Introduce el puesto.",
      location: "Introduce la ubicación.",
      appliedAt: "Introduce una fecha de candidatura válida.",
      technologies: "Introduce al menos una tecnología.",
    });
  });

  it("permite una fecha válida y limpia la entrada final", () => {
    expect(
      validateApplicationForm({
        ...validFormValues,
        appliedAt: "2024-02-29",
      }),
    ).toEqual({});

    expect(
      toApplicationInput({
        ...validFormValues,
        company: "  Acme  ",
        position: " Frontend developer ",
        location: " Madrid ",
        technologies: " React, TypeScript ",
      }),
    ).toEqual({
      company: "Acme",
      position: "Frontend developer",
      status: "applied",
      location: "Madrid",
      workMode: "remote",
      appliedAt: "2026-08-22",
      technologies: ["React", "TypeScript"],
    });
  });

  it("convierte una candidatura existente al formato del formulario", () => {
    expect(getApplicationFormValues(application)).toEqual(validFormValues);
  });
});
