"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import type { ComponentProps, ReactNode } from "react";
import { lazy, Suspense } from "react";

const Toaster = lazy(() => import("ui/sonner").then((mod) => ({ default: mod.Toaster })));

type AppProps = {
  children: ReactNode;
  session?: Session | null;
} & ComponentProps<typeof ThemeProvider>;
export function Providers({ children, attribute, defaultTheme, enableSystem }: AppProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute={attribute} defaultTheme={defaultTheme} enableSystem={enableSystem}>
        {children}
        <Suspense fallback={null}>
          <Toaster richColors closeButton />
        </Suspense>
      </ThemeProvider>
    </SessionProvider>
  );
}
