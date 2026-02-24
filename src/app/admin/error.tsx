"use client";

import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { isDevelopment } from "@/lib/clientConfig";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset(): void;
}

export default function AdminError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("Admin panel error:", error);
  }, [error]);

  return (
    <div
      className={`
        flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4
      `}
    >
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <AlertCircle aria-hidden="true" className="text-destructive size-16" />
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight">Admin Panel Error</h1>

        <p className="text-muted-foreground mb-6">
          An error occurred in the admin panel. This has been logged for investigation.
        </p>

        {error.digest && (
          <div
            className={`
              bg-muted text-muted-foreground mb-6 rounded-md px-3 py-2 font-mono
              text-sm
            `}
          >
            Error ID: {error.digest}
          </div>
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
            <Link href="/admin">
              <ArrowLeft className="mr-2 size-4" />
              Admin Dashboard
            </Link>
          </Button>
        </div>

        {isDevelopment && (
          <details
            className={`
              border-destructive/50 bg-destructive/10 mt-8 rounded-lg border p-4
              text-left
            `}
          >
            <summary className="text-destructive cursor-pointer font-semibold">
              Debug Information
            </summary>
            <div className="mt-3 space-y-2">
              <div>
                <p className="text-sm font-semibold">Error Message:</p>
                <p className="text-destructive text-sm">{error.message}</p>
              </div>
              {error.stack && (
                <div>
                  <p className="text-sm font-semibold">Stack Trace:</p>
                  <pre className="mt-1 overflow-auto text-xs">{error.stack}</pre>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
