import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (!error) return fallback;

  // RTK Query fetch errors (404, 401, 500, etc.)
  if (typeof error === "object" && error !== null && "status" in error) {
    const apiError = error as FetchBaseQueryError;

    if (typeof apiError.data === "object" && apiError.data !== null) {
      const data = apiError.data as {
        message?: string;
        error?: string;
      };

      return data.message || data.error || fallback;
    }

    if (typeof apiError.data === "string") {
      return apiError.data || fallback;
    }

    if (typeof apiError.status === "string") {
      return apiError.error || fallback;
    }

    return `Request failed with status ${apiError.status}.`;
  }

  // Standard JavaScript errors
  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};
