export function formatApplicationDate(appliedAt: string): string {
  const date = new Date(`${appliedAt}T00:00:00`);

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
