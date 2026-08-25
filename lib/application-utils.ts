export function formatApplicationDate(appliedAt: string): string {
  const date = new Date(`${appliedAt}T00:00:00`);

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getCompanyInitials(company: string): string {
  const initials = company
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();

  return initials || "?";
}
