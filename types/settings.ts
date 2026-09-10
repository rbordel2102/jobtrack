export interface SettingsActionState {
  status: "idle" | "success" | "error";
  message?: string;
  error?: string;
}

export type UpdateProfileAction = (
  previousState: SettingsActionState,
  formData: FormData,
) => Promise<SettingsActionState>;

export const initialSettingsActionState: SettingsActionState = {
  status: "idle",
};
