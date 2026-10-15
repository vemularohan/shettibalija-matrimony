export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (typeof error === "string" && error.trim()) return error;
  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string" && error.message.trim()) {
      return error.message;
    }
  }
  return fallback;
}
