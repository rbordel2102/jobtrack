"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createApplication as createApplicationRecord,
  deleteApplication as deleteApplicationRecord,
  updateApplication as updateApplicationRecord,
} from "@/lib/application-data";
import { requireSession } from "@/lib/auth-utils";
import {
  getApplicationFormValuesFromFormData,
  type ApplicationActionState,
  toApplicationInput,
  validateApplicationForm,
} from "@/lib/application-validation";

function getValidationState(formData: FormData):
  | { state: ApplicationActionState }
  | { input: ReturnType<typeof toApplicationInput> } {
  const parsedForm = getApplicationFormValuesFromFormData(formData);
  const fieldErrors = {
    ...parsedForm.errors,
    ...validateApplicationForm(parsedForm.values),
  };

  if (Object.keys(fieldErrors).length > 0) {
    return { state: { fieldErrors } };
  }

  return { input: toApplicationInput(parsedForm.values) };
}

function isRecordNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  );
}

export async function createApplicationAction(
  previousState: ApplicationActionState,
  formData: FormData,
): Promise<ApplicationActionState> {
  void previousState;

  const session = await requireSession();

  const validation = getValidationState(formData);

  if ("state" in validation) {
    return validation.state;
  }

  try {
    await createApplicationRecord(session.user.id, validation.input);
  } catch {
    return {
      fieldErrors: {},
      formError: "No se ha podido guardar la candidatura. Inténtalo de nuevo.",
    };
  }

  revalidatePath("/applications");
  revalidatePath("/");
  redirect("/applications?success=created");
}

export async function updateApplicationAction(
  applicationId: string,
  previousState: ApplicationActionState,
  formData: FormData,
): Promise<ApplicationActionState> {
  void previousState;

  const session = await requireSession();

  const validation = getValidationState(formData);

  if ("state" in validation) {
    return validation.state;
  }

  try {
    const application = await updateApplicationRecord(
      applicationId,
      session.user.id,
      validation.input,
    );

    if (!application) {
      return {
        fieldErrors: {},
        formError: "No se ha encontrado la candidatura que quieres editar.",
      };
    }
  } catch (error: unknown) {
    if (isRecordNotFoundError(error)) {
      return {
        fieldErrors: {},
        formError: "No se ha encontrado la candidatura que quieres editar.",
      };
    }

    return {
      fieldErrors: {},
      formError: "No se ha podido guardar la candidatura. Inténtalo de nuevo.",
    };
  }

  revalidatePath("/applications");
  revalidatePath("/");
  redirect("/applications?success=updated");
}

export async function deleteApplicationAction(formData: FormData): Promise<void> {
  const session = await requireSession();
  const applicationId = formData.get("applicationId");

  if (typeof applicationId !== "string" || applicationId.length === 0) {
    redirect("/applications?error=not_found");
  }

  let deleted = false;

  try {
    deleted = await deleteApplicationRecord(applicationId, session.user.id);
  } catch {
    redirect("/applications?error=database");
  }

  if (!deleted) {
    redirect("/applications?error=not_found");
  }

  revalidatePath("/applications");
  revalidatePath("/");
  redirect("/applications?success=deleted");
}
