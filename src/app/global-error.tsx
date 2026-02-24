"use client";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Global Error Boundary Component
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Catches and handles errors in the application
 * Provides user-friendly error messages
 * Logs errors to Sentry (if configured)
 */

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset(): void;
}) {
  useEffect(() => {
    // Log error to Sentry or other monitoring service
    console.error("Global error caught:", error);

    // Optional: Send to Sentry
    if (typeof window !== "undefined" && window.Sentry) {
      window.Sentry.captureException(error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          className="
          from-background to-muted flex min-h-screen flex-col items-center
          justify-center bg-linear-to-b p-4
        "
        >
          <div className="max-w-md space-y-6 text-center">
            <div className="space-y-2">
              <h1
                className="
                text-destructive text-4xl font-bold tracking-tighter
              "
              >
                Oops! Something went wrong
              </h1>
              <p className="text-muted-foreground text-lg">
                We&apos;re sorry for the inconvenience. An unexpected error occurred.
              </p>
            </div>

            {error.digest && (
              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground font-mono text-sm">Error ID: {error.digest}</p>
              </div>
            )}

            <div
              className="
              flex flex-col gap-2
              sm:flex-row sm:justify-center
            "
            >
              <button
                className="
                  bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary inline-flex
                  items-center justify-center rounded-md px-6 py-3
                  text-sm
                  font-medium
                  transition-colors focus:ring-2 focus:ring-offset-2
                  focus:outline-none
                "
                onClick={reset}
              >
                Try Again
              </button>
              <Link
                className="
                  border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-primary
                  inline-flex items-center justify-center rounded-md border px-6
                  py-3
                  text-sm font-medium
                  transition-colors focus:ring-2 focus:ring-offset-2
                  focus:outline-none
                "
                href="/"
              >
                Go Home
              </Link>
            </div>

            {process.env["NODE_ENV"] === "development" && (
              <details className="bg-muted mt-8 rounded-lg p-4 text-left">
                <summary className="cursor-pointer font-semibold">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 overflow-auto text-xs">
                  {error.message}
                  {"\n\n"}
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

declare global {
  interface Window {
    Sentry?: {
      captureException(error: Error): void;
    };
  }
}
