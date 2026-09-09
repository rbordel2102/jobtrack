import "server-only";

const RATE_LIMIT_WINDOW_MS = 60_000;
const lastAnalysisByUser = new Map<string, number>();

/**
 * Best-effort in-memory limit for the demo. It is not a distributed
 * production rate limiter and resets when the server process restarts.
 */
export function isOfferAnalysisRateLimited(
  userId: string,
  now = Date.now(),
): boolean {
  const lastAnalysisAt = lastAnalysisByUser.get(userId);

  if (
    lastAnalysisAt !== undefined &&
    now - lastAnalysisAt < RATE_LIMIT_WINDOW_MS
  ) {
    return true;
  }

  return false;
}

export function recordOfferAnalysisAttempt(
  userId: string,
  now = Date.now(),
): void {
  lastAnalysisByUser.set(userId, now);
}
