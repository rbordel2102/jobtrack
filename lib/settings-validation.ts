export const MIN_DISPLAY_NAME_LENGTH = 2;
export const MAX_DISPLAY_NAME_LENGTH = 60;

export interface DisplayNameValidationResult {
  value?: string;
  error?: string;
}

export function validateDisplayName(value: unknown): DisplayNameValidationResult {
  if (typeof value !== "string") {
    return {
      error: `El nombre debe tener entre ${MIN_DISPLAY_NAME_LENGTH} y ${MAX_DISPLAY_NAME_LENGTH} caracteres.`,
    };
  }

  const trimmedValue = value.trim();

  if (
    trimmedValue.length < MIN_DISPLAY_NAME_LENGTH ||
    trimmedValue.length > MAX_DISPLAY_NAME_LENGTH
  ) {
    return {
      error: `El nombre debe tener entre ${MIN_DISPLAY_NAME_LENGTH} y ${MAX_DISPLAY_NAME_LENGTH} caracteres.`,
    };
  }

  return { value: trimmedValue };
}
