"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense } from "react";

import type { Session } from "next-auth";
import type { ComponentProps, ReactNode } from "react";

const Toaster = lazy(() =>
  import("@/components/ui/sonner").then((module_) => ({ default: module_.Toaster }))
);

type AppProps = {
  children: ReactNode;
  session?: null | Session;
} & ComponentProps<typeof ThemeProvider>;
export function Providers({ children, attribute, defaultTheme, enableSystem }: AppProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute={attribute} defaultTheme={defaultTheme} enableSystem={enableSystem}>
        {children}
        <Suspense fallback={null}>
          <Toaster />
        </Suspense>
      </ThemeProvider>
    </SessionProvider>
  );
}
