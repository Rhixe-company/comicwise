"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { isDevelopment } from "@/lib/clientConfig";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset(): void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log critical error to monitoring service
    console.error("Global application error:", error);
  }, [error]);

  return (
    <div
      className={`
        bg-background flex min-h-screen flex-col items-center justify-center
        px-4
      `}
    >
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <AlertCircle aria-hidden="true" className="text-destructive size-16" />
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight">Something went wrong</h1>

        <p className="text-muted-foreground mb-6">
          An unexpected error occurred. Our team has been notified and is working on a fix.
        </p>

        {error.digest && (
          <p className="text-muted-foreground mb-6 text-sm">Error ID: {error.digest}</p>
        )}

        <div
          className={`
            flex flex-col gap-3
            sm:flex-row sm:justify-center
          `}
        >
          <Button onClick={reset} size="lg">
            Try Again
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>

        {isDevelopment && (
          <details
            className={`
              border-border bg-muted mt-8 rounded-lg border p-4 text-left
            `}
          >
            <summary className="cursor-pointer font-semibold">Error Details</summary>
            <pre className="mt-2 overflow-auto text-xs">
              {error.message}
              {"\n\n"}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
