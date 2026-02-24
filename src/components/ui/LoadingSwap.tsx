import { Loader2Icon } from "lucide-react";

import { cn } from "utils";

import type { ReactNode } from "react";

export function LoadingSwap({
  isLoading,
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  isLoading: boolean;
}) {
  return (
    <div className="grid grid-cols-1 place-items-center">
      <div
        className={cn(
          "col-start-1 col-end-2 row-start-1 row-end-2 w-full",
          isLoading ? "invisible" : "visible",
          className
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "col-start-1 col-end-2 row-start-1 row-end-2",
          isLoading ? "visible" : "invisible",
          className
        )}
      >
        <Loader2Icon className="animate-spin" />
      </div>
    </div>
  );
}
