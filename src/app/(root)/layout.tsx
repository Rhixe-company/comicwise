import React, { Suspense } from "react";

import { AppNavbar } from "@/components/layout/AppNavbar";
import CurrentYear from "@/components/layout/CurrentYear";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <AppNavbar />
      </Suspense>
      <main className="flex-1">{children}</main>
      <footer
        className={`
          border-t py-6
          md:py-8
        `}
      >
        <div
          className={`
            text-muted-foreground container mx-auto px-4 text-center text-sm
          `}
        >
          <p>
            © <CurrentYear /> ComicWise. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
