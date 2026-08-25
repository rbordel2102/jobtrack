import type {
  Application,
  ApplicationInput,
  ApplicationStatus,
  WorkMode,
} from "@/types/application";

export interface ApplicationFormValues {
  company: string;
  position: string;
  status: ApplicationStatus;
  location: string;
  workMode: WorkMode;
  appliedAt: string;
  technologies: string;
}

export type ApplicationFormErrors = Partial<
  Record<keyof ApplicationFormValues, string>
>;

export const emptyApplicationFormValues = {
  company: "",
  position: "",
  status: "applied",
  location: "",
  workMode: "remote",
  appliedAt: "",
  technologies: "",
} satisfies ApplicationFormValues;

export function getApplicationFormValues(
  application: Application,
): ApplicationFormValues {
  return {
    company: application.company,
    position: application.position,
    status: application.status,
    location: application.location,
    workMode: application.workMode,
    appliedAt: application.appliedAt,
    technologies: application.technologies.join(", "),
  };
}

export function parseTechnologies(value: string): readonly string[] {
  return value
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean);
}

export function validateApplicationForm(
  values: ApplicationFormValues,
): ApplicationFormErrors {
  const errors: ApplicationFormErrors = {};

  if (!values.company.trim()) {
    errors.company = "Introduce el nombre de la empresa.";
  }

  if (!values.position.trim()) {
    errors.position = "Introduce el puesto.";
  }

  if (!values.location.trim()) {
    errors.location = "Introduce la ubicación.";
  }

  if (!values.appliedAt.trim()) {
    errors.appliedAt = "Selecciona la fecha de candidatura.";
  }

  if (parseTechnologies(values.technologies).length === 0) {
    errors.technologies = "Introduce al menos una tecnología.";
  }

  return errors;
}

export function toApplicationInput(
  values: ApplicationFormValues,
): ApplicationInput {
  return {
    company: values.company.trim(),
    position: values.position.trim(),
    status: values.status,
    location: values.location.trim(),
    workMode: values.workMode,
    appliedAt: values.appliedAt.trim(),
    technologies: parseTechnologies(values.technologies),
  };
}
