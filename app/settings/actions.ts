"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { requireSession } from "@/lib/auth-utils";
import { validateDisplayName } from "@/lib/settings-validation";
import type {
  SettingsActionState,
  UpdateProfileAction,
} from "@/types/settings";

export const updateProfileAction: UpdateProfileAction = async (
  previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> => {
  void previousState;

  await requireSession();

  const validation = validateDisplayName(formData.get("name"));

  if (!validation.value) {
    return {
      status: "error",
      error: validation.error,
    };
  }

  try {
    // Better Auth derives the target user from the authenticated request.
    await auth.api.updateUser({
      body: { name: validation.value },
      headers: await headers(),
    });
  } catch {
    return {
      status: "error",
      error: "No se ha podido guardar el nombre. Inténtalo de nuevo.",
    };
  }

  revalidatePath("/settings");
  revalidatePath("/");

  return {
    status: "success",
    message: "Nombre actualizado correctamente.",
  };
};
