import type {
  Application,
  ApplicationInput,
  ApplicationStatus,
  WorkMode,
} from "@/types/application";
import {
  applicationStatusOptions,
  workModeOptions,
} from "@/lib/application-config";

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

export interface ApplicationActionState {
  fieldErrors: ApplicationFormErrors;
  formError?: string;
}

export type ApplicationFormAction = (
  previousState: ApplicationActionState,
  formData: FormData,
) => Promise<ApplicationActionState>;

export const initialApplicationActionState: ApplicationActionState = {
  fieldErrors: {},
};

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

function getFormDataString(formData: FormData, field: string): string {
  const value = formData.get(field);

  return typeof value === "string" ? value : "";
}

function isApplicationStatus(value: string): value is ApplicationStatus {
  return applicationStatusOptions.some((option) => option.value === value);
}

function isWorkMode(value: string): value is WorkMode {
  return workModeOptions.some((option) => option.value === value);
}

export function getApplicationFormValuesFromFormData(formData: FormData): {
  values: ApplicationFormValues;
  errors: ApplicationFormErrors;
} {
  const statusValue = getFormDataString(formData, "status");
  const workModeValue = getFormDataString(formData, "workMode");
  const errors: ApplicationFormErrors = {};

  if (!isApplicationStatus(statusValue)) {
    errors.status = "Selecciona un estado válido.";
  }

  if (!isWorkMode(workModeValue)) {
    errors.workMode = "Selecciona una modalidad válida.";
  }

  return {
    values: {
      company: getFormDataString(formData, "company"),
      position: getFormDataString(formData, "position"),
      status: isApplicationStatus(statusValue) ? statusValue : "applied",
      location: getFormDataString(formData, "location"),
      workMode: isWorkMode(workModeValue) ? workModeValue : "remote",
      appliedAt: getFormDataString(formData, "appliedAt"),
      technologies: getFormDataString(formData, "technologies"),
    },
    errors,
  };
}

function isValidApplicationDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
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
  } else if (!isValidApplicationDate(values.appliedAt.trim())) {
    errors.appliedAt = "Introduce una fecha de candidatura válida.";
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
