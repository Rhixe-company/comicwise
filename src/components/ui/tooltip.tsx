"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";
import { cn } from "utils";

/**
 *
 * @param root0
 * @param root0.delayDuration
 */
function TooltipProvider({
  delayDuration = 0,
  ...properties
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...properties}
    />
  );
}

/**
 *
 * @param root0
 */
function Tooltip({ ...properties }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...properties} />
    </TooltipProvider>
  );
}

/**
 *
 * @param root0
 */
function TooltipTrigger({ ...properties }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...properties} />;
}

/**
 *
 * @param root0
 * @param root0.className
 * @param root0.sideOffset
 * @param root0.children
 */
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...properties
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          `
            animate-in fade-in-0 zoom-in-95
            data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
            data-[side=bottom]:slide-in-from-top-2
            data-[side=left]:slide-in-from-right-2
            data-[side=right]:slide-in-from-left-2
            data-[side=top]:slide-in-from-bottom-2
            z-50 w-fit origin-(--radix-tooltip-content-transform-origin)
            rounded-md bg-foreground px-3 py-1.5 text-xs text-balance
            text-background
            data-[state=closed]:animate-out
          `,
          className
        )}
        {...properties}
      >
        {children}
        <TooltipPrimitive.Arrow
          className={`
            z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]
            bg-foreground fill-foreground
          `}
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
